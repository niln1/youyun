/**
* Use CSV to populate MongoDB
*
* @author Nil Ni
*/

var csv = require('csv');
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
 mongoose.connect(config['mongodb-url']);

 var db = mongoose.connection;
 db.on('error', function(err) {
  console.log("mongoErr:", err);
});

 var helper = (function(){
  function App() {
    console.log("hello");
    this.rawData = [];
    this.students = [];
    this.parents = [];
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
    .then(function () {
      console.log("Done");
    })
    .fail(function (error) {
      console.log("Error: ", error);
    })
    .done();
  };

  App.prototype.startIteration = function (index) {
    var self = this;
    var defer = Q.defer();
    var currentData = self.rawData[index];
    
    Q.all([
      this.createStudent(currentData),
      this.createParentIfNeeded(currentData.parentsname)
    ])
    .spread( function(studentUsername, parentUsername) {
      console.log(studentUsername,parentUsername);
      return true;
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
  }

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

App.prototype.createStudent = function (data) {
  var self = this;
  var mainDeferred = Q.defer();

  console.log("create student:", data);

  this.generateUsernameByFnLn(data.firstname, data.lastname, 0)
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
      deferred.resolve(uname);
    });

    return deferred.promise;
  })
  .then(function(uname){
    console.log("create student for " + data.firstname + "done");
    mainDeferred.resolve(uname);
  }).done();

  return mainDeferred.promise;
};

App.prototype.createParentIfNeeded = function (name) {
  var self = this;
  var mainDeferred = Q.defer();
  console.log("here");

  console.log("create Parent:", name);

  this.generateUsernameByFnLn(name, "", 0)
  .then(function (uname) {
    tempPassword = self.generateRandomPassword(10);
    var user = { username: uname, password: tempPassword };
    console.log("Parent// Username:", uname, "==","Password", tempPassword, "Name:"+ name + " " + " " );
    // self.parents.push(user);
    return uname;
  }).done(function(uname) {
    console.log("create parent done");
    mainDeferred.resolve(uname);
  });

  return mainDeferred.promise;
};

App.prototype.createStudentParentRelationship = function (name) {
};

App.prototype.createTeacher = function (data) {

};

App.prototype.createAdmin = function (data) {

};

App.prototype.generateUsernameByFnLn = function( firstname, lastname, hit ) {
  var self = this;
  var string1 = firstname.replace(/\s+/g, '').replace(",", ".");
  var string2 = lastname.replace(/\s+/g, '').replace(",", ".");

  string1 = (string1.length > 3) ? string1.substring(0,3) : string1;
  string2 = (string2.length > 3) ? string2.substring(0,3) : string2;

  var testUsername = string1 + string2 + hit;

  var deferred = Q.defer();

  User.find({"username":testUsername}, function(err, users){
    if (err) deferred.reject(err);
    if ( users.length === 0 ) {
      deferred.resolve(testUsername);
    }
    else {
      console.log("++++++++++++++++USERNAME EXIST+++++++++");
      deferred.resolve(self.generateUsernameByFnLn(firstname, lastname, hit+1));
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