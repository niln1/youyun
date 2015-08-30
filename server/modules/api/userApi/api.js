/*
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */
'use strict';

var users = require('./users');
var parameters = require('../utils/parameters');

// An array containing User API spec objects
module.exports = [{
    'url': '/api/v1/users',
    'GET': {
        'handler': users.readUsers,
        'required': [
        parameters.signature
        ],
        'optional': [
        parameters.userType,
        parameters.isPickUp
        ],
        'description': 'List all users that user is able to view',
        'response': {} // sample data
    },
    'POST': {
        'handler': users.createUser,
        'content-type': 'application/json',
        'required': [
        parameters.signature,
        parameters.username,
        parameters.password,
        parameters.userType
        ],
        'optional': [parameters.classList],
        'description': 'create user',
        'response': {} // sample data
    }
}, {
    'url': '/api/v1/users/image',
    'POST': {
        'handler': users.updateUserImage,
        'content-type': 'multipart/form-data',
        'required': [
        parameters.signature,
        ],
        'optional': [],
        'description': 'create user image',
        'response': {} // sample data
    },
    'PUT': {
        'handler': users.updateUserImage,
        'content-type': 'multipart/form-data',
        'required': [
        parameters.signature,
        ],
        'optional': [],
        'description': 'create user image',
        'response': {} // sample data
    }
}, {
    'url': '/api/v1/users/{id}',
    'PATCH': {
        'handler': users.updateUserWithId,
        'content-type': 'application/json',
        'required': [
        parameters.signature,
        ],
        'optional': [
        parameters.firstname,
        parameters.lastname,
        parameters.pickupLocation,
        parameters.pickupStudentGrade,
        parameters.pickupStudentRoomNumber,
        parameters.pickupStudentDayTime,
        ],
        'description': 'update user',
        'response': {} // sample data
    },
    'DELETE': {
        'handler': users.deleteUserWithId,
        'required': [
        parameters.signature
        ],
        'optional': [],
        'description': 'delete the user',
        'response': {} // sample data
    }
}, {
    'url': '/api/v1/users/child',
    'GET': {
        'handler': users.getChild,
        'required': [
        parameters.signature,
        parameters.userId
        ],
        'optional': [],
        'description': 'return child user of user with userId',
        'response': {} // sample data
    },
    'POST': {
        'handler': users.addChild,
        'content-type': 'application/json',
        'required': [
        parameters.signature,
        parameters.userId,
        parameters.firstname,
        parameters.lastname,
        parameters.pickupLocation
        ],
        'optional': [],
        'description': 'add child user to parent',
        'response': {
            "result": [
            {
                "_id": "55d143356420fd0000b3b688",
                "userImage": "/static/img/default_image/default-user.png",
                "username": "child1.test4",
                "password": "Black Sheep Wall",
                "firstname": "child1",
                "lastname": "test",
                "pickupLocation": "4",
                "userType": 3,
                "__v": 0,
                "devices": [],
                "classes": [],
                "fullname": "child1 test",
                "id": "55d143356420fd0000b3b688"
            }
            ],
            "description": "Children info successfully retrieved",
            "source": "YouYun Server"
        } // sample data
    },
    'PATCH': {
        'handler': users.updateChild,
        'content-type': 'application/json',
        'required': [
        parameters.signature,
        parameters.userId,
        parameters.childId,
        parameters.firstname,
        parameters.lastname,
        parameters.pickupLocation
        ],
        'optional': [],
        'description': 'update child info',
        'response': {} // sample data    
    }
}];