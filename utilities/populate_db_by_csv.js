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
db.on('error', function() {
  console.log('mongod connection error', config['mongodb-url']);
});

var helper = (function(){
  function App() {
    console.log("hello");
  }

  App.prototype.parseStudentCsv = function() {
    var self = this;
    var output = [];
    var studentCsvStream = fs.createReadStream(__dirname + '/datasource/student.csv');

    var parser = csv.parse({
      ltrim:true,
      rtrim:true,
      skip_empty_lines:true,
      columns: true
    }, function(err, datas){
      output.push(datas);
      __.each(datas, function(data) {
          self.generateUsernameByFnLn(data.firstname, data.lastname, 0)
          .then(function (name) {
            console.log(name);
          })
          .fail(function (err) {
            console.log("ERROR", err);
          });
      })
    });

    studentCsvStream.pipe(parser)
    .on("end", function(){
      console.log("done");
    });
  }

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
  }

  return App;
})();

var app = new helper();
app.parseStudentCsv();