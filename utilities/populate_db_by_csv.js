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
    User.find({}, function(err, users){
      console.log(users);
    });
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
        self.generateUsernameByFnLn(data.firstname, data.lastname,0)
      })
    });

    studentCsvStream.pipe(parser)
    .on("end", function(){
      console.log("done");
    });
  }

  App.prototype.generateUsernameByFnLn = function( firstname, lastname, hit ) {
    var string1 = firstname.replace(/\s+/g, '').replace(",", ".");
    var string2 = lastname.replace(/\s+/g, '').replace(",", ".");

    string1 = (string1.length > 3) ? string1.substring(0,3) : string1;
    string2 = (string2.length > 3) ? string2.substring(0,3) : string2;

    testUsername = string1 + string2 + hit;

    // console.log(testUsername);
  }

  return App;
})();

var app = new helper();
app.parseStudentCsv();