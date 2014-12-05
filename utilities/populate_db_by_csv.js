/**
* Use CSV to populate MongoDB
*
* @author Nil Ni
*/

var csv = require('csv');
var json2csv = require('json2csv');
var fs = require('fs');
var mongoose = require('mongoose');
var nconf = require('nconf');
var __ = require('underscore');
var config = require('../server/utils/config.json');
var Q = require('q');

var User = require('../server/models/User');
var Class = require('../server/models/Class');
var StudentParent = require('../server/models/StudentParent');
var StudentPickupReport = require('../server/models/StudentPickupReport');

/*
 * Setup mongoose
 */
var uristring = process.env.MONGO_URL ||
                process.env.MONGO_URI ||
                nconf.get('mongodb-url');

var mongoOptions = {
    user: process.env.MONGODB_USERNAME,
    pass: process.env.MONGODB_PASSWORD
}

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, { mongos: true }, function (err, res) {
  if (err) {
    console.error('ERROR connecting to: ' + uristring + '. ' + err);
    process.exit(-1);
  } else {
    console.log('Succeessfully connected to: ' + uristring);
  }
});

var teachersData = require("./datasource/teachers").data;

var helper = (function(){

  function App() {
    console.log("initializing the helper");
    this.rawData = [];
    this.students = [];
    this.parents = [];
    this.teachers = [];
    this.admin = [];
    this.currentIndex = 0;
  }

  App.prototype.start = function (options) {
    var self = this;
    if (!options) options = {};

    Q.all([
      this.removeUser(),
      this.removeClass(),
      this.removeStudentParent(),
      this.removeStudentPickupReport()
      ])
    .then(self.parseDataCsv())
    .then(function() {
      var defer = Q.defer();
      defer.resolve(self.startIteration(0));
      return defer.promise;
    })
    .then(function() {
      var defer = Q.defer();
      defer.resolve(self.startIterationForTeacher(0));
      return defer.promise;
    })
    .then(function() {
      return self.createAdmin();
    })
    .then(function() {
      return self.createSuperAdmin();
    })
    .then(function() {
      return self.createDataCsvByToken("teacher");
    })
    .then(function() {
      return self.createDataCsvByToken("student");
    })
    .then(function() {
      return self.createDataCsvByToken("parent");
    })
    .then(function() {
      return self.createDataCsvByToken("admin");
    })
    .fail(function (error) {
      console.log("Error: ", error);
    })
    .done(function(){
      console.log("EVERYTHING DONE");
    });
  };

  App.prototype.startIteration = function (index) {
    var self = this;
    var defer = Q.defer();
    var currentData = self.rawData[index];
    
    Q.all([
      this.createStudent(currentData),
      this.createParentIfNeeded(currentData.parentsname)
      ])
    .spread( function(studentId, parentId) {
      return self.createStudentParentRelationship(studentId, parentId);
    })
    .then(function() {
      index++;
      console.log("currentIndex", index);
      if (index === self.rawData.length) {
        defer.resolve();
      } else {
        defer.resolve(self.startIteration(index));
      }
    });
    return defer.promise;
  };

  App.prototype.startIterationForTeacher = function (index) {
    var self = this;
    var defer = Q.defer();
    var currentData = teachersData[index];
    
    this.createTeacher(currentData)
    .then(function() {
      index++;
      console.log("currentTeacherIndex", index);
      if (index === teachersData.length) {
        defer.resolve();
      } else {
        defer.resolve(self.startIterationForTeacher(index));
      }
    });
    return defer.promise;
  };

  App.prototype.removeUser = function () {
    var deferred = Q.defer();
    User.remove({}, function (err) {
      if (err) deferred.reject(err);
      console.log('info: User removed');
      deferred.resolve();
    });
    return deferred.promise;
  };

  App.prototype.removeClass = function () {
    var deferred = Q.defer();
    Class.remove({}, function (err) {
      if (err) deferred.reject(err);
      console.log('info: Class removed');
      deferred.resolve();
    });
    return deferred.promise;
  };

  App.prototype.removeStudentParent = function () {
    var deferred = Q.defer();
    StudentParent.remove({}, function(err) {
      if (err) deferred.reject(err);
      console.log('info: StudentParent removed');
      deferred.resolve();
    });
    return deferred.promise;
  };

  App.prototype.removeStudentPickupReport = function () {
    var deferred = Q.defer();

    StudentPickupReport.remove({}, function (err) {
      if (err) deferred.reject(err);
      console.log('info: Class removed');
      deferred.resolve();

    });
    return deferred.promise;
  };

  App.prototype.parseDataCsv = function () {
    var self = this;
    var deferred = Q.defer();
    var studentCsvStream = fs.createReadStream(__dirname + '/datasource/all.csv');

    var parser = csv.parse({
      ltrim:true,
      rtrim:true,
      skip_empty_lines:true,
      columns: true
    }, function(err, datas){
      if (err) deferred.reject(new Error(err));
      self.rawData = datas;
    });

    studentCsvStream.pipe(parser)
    .on("end", function(){
      var log = "info: End parsing CSV data";
      console.log(log);
      deferred.resolve(log);
    });

    return deferred.promise;
  };

  App.prototype.createDataCsvByToken = function (token) {
    var self = this;
    var deferred = Q.defer();
    var options = {};

    options.name = token;

    if (token === "teacher") {
      options.data = this.teachers;
      options.path = '/output/teachers.csv';
    } else if (token === "student") {
      options.data = this.students;
      options.path = '/output/students.csv';
    } else if (token === "admin") {
      options.data = this.admin;
      options.path = '/output/admin.csv';
    } else if (token === "parent") {
      options.data = this.parents;
      options.path = '/output/parents.csv';
    }

    json2csv({data: options.data,
      fields: ['firstname', 'lastname', 'username', 'password']},
      function(err, csv) {
        if (err) console.log(err);
        fs.writeFile(__dirname + options.path, csv, function(err) {
          if (err) throw err;
          console.log(options.name + ' csv file saved');
          deferred.resolve();
        });
      });

    return deferred.promise;
  };

  App.prototype.createStudent = function (data) {
    var self = this;
    var mainDeferred = Q.defer();

    console.log("create student:", data.firstname);

    this.generateUsernameByFnLn(data.firstname, data.lastname, "stu", 0)
    .then(function (uname) {
      var deferred = Q.defer();

      tempPassword = self.generateRandomPassword(10);
      console.log("++++uname++++",uname);

      var tempStudent = new User({
        firstname: data.firstname,
        lastname: data.lastname || " ",
        username: uname,
        password: tempPassword,
        pickupStudentGrade: data.grade,
        pickupStudentRoomNumber: data.room,
        pickupLocation: data.location,
        userType: 3
      });

      tempStudent.save(function (err, student) {
        if (err) deferred.reject(err);
        console.log("== Student Saved ==", uname);
        self.students.push({
          firstname:student.firstname,
          lastname:student.lastname,
          username:student.username,
          password: tempPassword
        });
        deferred.resolve(student._id);
      });

      return deferred.promise;
    })
    .done(function(uid){
      console.log("create student for " + data.firstname + "done");
      mainDeferred.resolve(uid);
    });

    return mainDeferred.promise;
  };

  App.prototype.createParentIfNeeded = function (name) {
    var self = this;
    var mainDeferred = Q.defer();

    tempName = name.replace(/\s+/g, '');
    var nameArray = tempName.split("/");

    console.log("create Parent:", name);
    Q.fcall(function () {
      var deferred = Q.defer();
      User.find({firstname: name}, function(err, parents) {
        if (err) throw err;
        else if (parents.length === 1) {
          console.log("=create parent not needed done=");
          mainDeferred.resolve(parents[0]._id);
        } else if (parents.length === 0) {
          deferred.resolve();
        } else {
          throw new Error("Parent Length Internal Error");
        }
      });
      return deferred.promise;
    })
    .then(function () {
      return self.generateUsernameByFnLn(nameArray[0], nameArray[1] || "", "par", 0);
    })
    .then(function (uname) {
      var deferred = Q.defer();

      tempPassword = self.generateRandomPassword(10);
      // self.parents.push(user);
      var tempParent = new User({
        firstname: name,
        lastname: " ",
        username: uname,
        password: tempPassword,
        userType: 4
      });

      tempParent.save(function (err, parent) {
        if (err) deferred.reject(err);
        console.log("== Parent Saved ==", uname);
        self.parents.push({
          firstname:parent.firstname,
          lastname:parent.lastname,
          username: parent.username,
          password: tempPassword });
        deferred.resolve(parent._id);
      });

      return deferred.promise;
    }).done(function(uid) {
      console.log("create parent done");
      mainDeferred.resolve(uid);
    });

    return mainDeferred.promise;
  };

  App.prototype.createStudentParentRelationship = function (studentId, parentId) {
    var deferred = Q.defer();

    var tempRelationship = new StudentParent({
      student: studentId,
      parent: parentId
    });

    tempRelationship.save(function (err, studentParent) {
      if (err) deferred.reject(err);
      console.log("== student parent relationship Saved ==", studentParent._id);
      deferred.resolve(studentParent._id);
    })

    return deferred.promise;
  };

  App.prototype.createTeacher = function (data) {
    var self = this;
    var mainDeferred = Q.defer();

    console.log("create teacher:", data.firstname);

    this.generateUsernameByFnLn(data.firstname, data.lastname, "tea", 0)
    .then(function (uname) {
      var deferred = Q.defer();

      tempPassword = self.generateRandomPassword(10);
      console.log("++++uname++++",uname);

      var tempTeacher = new User({
        firstname: data.firstname,
        lastname: data.lastname || " ",
        username: uname,
        password: tempPassword,
        userType: 2
      });

      tempTeacher.save(function (err, teacher) {
        if (err) deferred.reject(err);
        console.log("== Teacher Saved ==", uname);
        self.teachers.push({ 
          firstname:teacher.firstname,
          lastname:teacher.lastname,
          username: teacher.username,
          password: tempPassword });
        deferred.resolve(teacher._id);
      });

      return deferred.promise;
    })
    .done(function(uid){
      console.log("create teacher for " + data.firstname + "done");
      mainDeferred.resolve(uid);
    });

    return mainDeferred.promise;
  };

  App.prototype.createAdmin = function () {
    var self = this;
    var uname = "hanlin-admin"

    console.log("create admin:", uname);

    var deferred = Q.defer();

    tempPassword = self.generateRandomPassword(10);
    console.log("++++uname++++",uname);

    var tempAdmin = new User({
      firstname: "admin",
      lastname: "admin",
      username: uname,
      password: tempPassword,
      userType: 0
    });

    tempAdmin.save(function (err, admin) {
      if (err) deferred.reject(err);
      console.log("== admin Saved ==", uname);
      self.admin.push({ 
        firstname:admin.firstname,
        lastname:admin.lastname,
        username: admin.username,
        password: tempPassword });
      deferred.resolve(admin._id);
    });
    return deferred.promise;
  };

  App.prototype.createSuperAdmin = function () {
    var self = this;
    var uname = "hanlin-super-admin"

    console.log("create superadmin:", uname);

    var deferred = Q.defer();

    tempPassword = "HelloWorld1";
    console.log("++++uname++++",uname);

    var tempAdmin = new User({
      firstname: "superadmin",
      lastname: "superadmin",
      username: uname,
      password: tempPassword,
      userType: 0
    });

    tempAdmin.save(function (err, admin) {
      if (err) deferred.reject(err);
      console.log("== admin Saved ==", uname);
      self.admin.push({ 
        firstname:admin.firstname,
        lastname:admin.lastname,
        username: admin.username,
        password: tempPassword });
      deferred.resolve(admin._id);
    });
    return deferred.promise;
  };

  App.prototype.generateUsernameByFnLn = function( firstname, lastname, token, hit ) {
    var self = this;
    var string1 = firstname.replace(/\s+/g, '').replace(",", ".");
    var string2 = lastname.replace(/\s+/g, '').replace(",", ".");

    string1 = (string1.length > 3) ? string1.substring(0,3) : string1;
    string2 = (string2.length > 3) ? string2.substring(0,3) : string2;

    var testUsername = token.toLowerCase() + string1.toLowerCase() + string2.toLowerCase() + hit;

    var deferred = Q.defer();

    User.find({"username":testUsername}, function(err, users){
      if (err) deferred.reject(err);
      if ( users.length === 0 ) {
        deferred.resolve(testUsername);
      }
      else {
        console.log("++++++++++USERNAME EXIST+++++++++");
        deferred.resolve(self.generateUsernameByFnLn(firstname, lastname, token, hit+1));
      }
    });

    return deferred.promise;
  };

  App.prototype.generateRandomPassword = function ( plength ) {
    var keylistalpha="abcdefghijklmnopqrstuvwxyz";
    var keylistint="123456789";
    var keylistspec="!@#_";
    var temp='';
    var len = plength/2;
    var len = len - 1;
    var lenspec = plength-len-len;

    for (i=0;i<len;i++)
      temp+=keylistalpha.charAt(Math.floor(Math.random()*keylistalpha.length));

    for (i=0;i<lenspec;i++)
      temp+=keylistspec.charAt(Math.floor(Math.random()*keylistspec.length));

    for (i=0;i<len;i++)
      temp+=keylistint.charAt(Math.floor(Math.random()*keylistint.length));

    temp=temp.split('').sort(function(){return 0.5-Math.random()}).join('');

    return temp;
  };

  return App;

})();

var app = new helper();
app.start();