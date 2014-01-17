



var StudentParent = schema.define('Student-Parent', {
	id: 		  String, 
	sid:          String,
	pid:          String
});

var UserClass = schema.define('User-Class', {
	id: 		  String, 
	uid:          String,
	cid:          String
});

var Message = schema.define('Messages', {
	id: 		  String, 
	uid:          String,
	message:      String,
	timestamp:    { type: Number,  default: Date.now },
	flag:         Boolean
});

var Reminder = schema.define('Reminders', {
	id: 		  String, 
	uid:          String,
	message:      String,
	timestamp:    { type: Number,  default: Date.now }
	flag:         Boolean
});

var Alert = schema.define('Alerts', {
	id: 		  String, 
	uid:          String,
	message:      String,
	timestamp:    { type: Number,  default: Date.now }
	flag:         Boolean
});