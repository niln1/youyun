/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */
'use strict';

exports.username = {
    'type': 'string',
    'param': 'username',
    'description': 'A string containing the username of the user.'
};

exports.firstname = {
    'type': 'string',
    'param': 'firstname',
    'description': 'A string containing the firstname of the user.'
};

exports.lastname = {
    'type': 'string',
    'param': 'lastname',
    'description': 'A string containing the lastname of the user.'
};

exports.pickupLocation = {
    'type': 'string',
    'param': 'pickupLocation',
    'description': 'A string containing the pickupLocation of the student.'
};

exports.pickupStudentGrade = {
    'type': 'string',
    'param': 'pickupStudentGrade',
    'description': 'A string containing the pickupStudentGrade of the student.'
};

exports.pickupStudentRoomNumber = {
    'type': 'string',
    'param': 'pickupStudentRoomNumber',
    'description': 'A string containing the pickupStudentRoomNumber of the student.'
};

exports.pickupStudentDayTime = {
    'type': 'string', // change later
    'param': 'pickupLocation',
    'description': 'A string containing the pickupStudentDayTime of the student.'
};

exports.password = {
    'type': 'string',
    'param': 'password',
    'description': 'A string containing the password of the user.'
};

exports.userType = {
    'type': 'number',
    'param': 'userType',
    'description': 'A string containing the userType of the user.'
};

exports.signature = {
    'type': 'string',
    'param': 'signature',
    'description': 'signature'
};

exports.userId = {
    'type': 'mongoId',
    'param': 'userId',
    'description': 'userId'
};

exports.reminderId = {
    'type': 'mongoId',
    'param': 'reminderId',
    'description': 'reminderId'
};

exports.message = {
    'type': 'string',
    'param': 'message',
    'description': 'message'
};

exports.dueDate = {
    'type': 'date',
    'param': 'dueDate',
    'description': 'dueDate'
}

exports.isDone = {
    'type': 'boolean',
    'param': 'isDone',
    'description': 'isDone'
}

exports.isPickUp = {
    'type': 'boolean',
    'param': 'isPickUp',
    'description': 'isPickUp'
}

exports.isAdd = {
    'type': 'boolean',
    'param': 'isAdd',
    'description': 'isAdd'
}

exports.studentId = {
    'type': 'mongoId',
    'param': 'studentId',
    'description': 'studentId'
}

exports.classId = {
    'type': 'mongoId',
    'param': 'classId',
    'description': 'classId'
};

exports.classList = {
    'type': 'list',
    'param': 'classList',
    'description': 'List of classes'
};

exports.deviceType = {
    'type': 'number',
    'param': 'type',
    'description': 'Mobile device type'
}

exports.pushToken = {
    'type': 'string',
    'param': 'token',
    'description': 'Mobile device push notification token'
}


// pickupdetail parameter
exports.pickedBy = {
    'type': 'string',
    'param': 'pickedBy',
    'description': 'pick by which teacher'
}

exports.mondayPickupTime = {
    'type': 'timeString',
    'param': 'mondayPickupTime',
    'description': 'mondayPickupTime'
}

exports.tuesdayPickupTime = {
    'type': 'timeString',
    'param': 'tuesdayPickupTime',
    'description': 'tuesdayPickupTime'
}

exports.wednesdayPickupTime = {
    'type': 'timeString',
    'param': 'wednesdayPickupTime',
    'description': 'wednesdayPickupTime'
}

exports.thursdayPickupTime = {
    'type': 'timeString',
    'param': 'thursdayPickupTime',
    'description': 'thursdayPickupTime'
}

exports.fridayPickupTime = {
    'type': 'timeString',
    'param': 'fridayPickupTime',
    'description': 'fridayPickupTime'
}

exports.saturdayPickupTime = {
    'type': 'timeString',
    'param': 'saturdayPickupTime',
    'description': 'saturdayPickupTime'
}

exports.sundayPickupTime = {
    'type': 'timeString',
    'param': 'sundayPickupTime',
    'description': 'sundayPickupTime'
}

exports.isRead = {
    'type': 'boolean',
    'param': 'isRead',
    'description': 'read boolean'
}