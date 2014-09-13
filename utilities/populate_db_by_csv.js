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
    this.students = [];
    this.parents = [];
  }

  App.prototype.parseStudentCsv = function() {
    var self = this;
    var studentCsvStream = fs.createReadStream(__dirname + '/datasource/student.csv');

    var parser = csv.parse({
      ltrim:true,
      rtrim:true,
      skip_empty_lines:true,
      columns: true
    }, function(err, datas){
      __.each(datas, function(data) {
         self.createStudent(data);
      });
    });

    studentCsvStream.pipe(parser)
    .on("end", function(){
      console.log("done parsing student");
    });
  };

  App.prototype.parseStudentParentCsv = function() {
    var self = this;
    var studentCsvStream = fs.createReadStream(__dirname + '/datasource/studentparent.csv');

    var parser = csv.parse({
      ltrim:true,
      rtrim:true,
      skip_empty_lines:true,
      columns: true
    }, function(err, datas){
      var parents = __.pluck(datas, "parentsname");
      console.log(parents);
      __.each(parents, function(name) {
         self.createParent(name);
      });
    });

    studentCsvStream.pipe(parser)
    .on("end", function(){
      console.log("done parsing student parent");
    });
  };

  App.prototype.createStudent = function (data) {
    var self = this;

    this.generateUsernameByFnLn(data.firstname, data.lastname, 0)
    .then(function (name) {
      tempPassword = self.generateRandomPassword(10);
      var user = { username: name, password: tempPassword };
      console.log("Username:", name, "==","Password", tempPassword, "Name:"+data.firstname + " " + data.lastname );
      self.students.push(user);
    })
    .fail(function (err) {
      console.log("ERROR", err);
    });
  };

  App.prototype.createParent = function (name) {
    var self = this;

    this.generateUsernameByFnLn(name, "", 0)
    .then(function (uname) {
      tempPassword = self.generateRandomPassword(10);
      var user = { username: uname, password: tempPassword };
      console.log("Parent// Username:", uname, "==","Password", tempPassword, "Name:"+ name + " " + " " );
      self.parents.push(user);
    })
    .fail(function (err) {
      console.log("ERROR", err);
    });
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

    User.find({username:testUsername}, function(err, users){
      if (err) deferred.reject(err);
      if ( users.length === 0 ) {
        deferred.resolve(testUsername);
      }
      else self.generateUsernameByFnLn(firstname, lastname, hit++);
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
app.parseStudentCsv();
app.parseStudentParentCsv();