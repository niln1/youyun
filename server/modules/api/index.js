/*
 * file: index.js
 * Copyright (c) 2014, Ranchao Zhang & Zhihao Ni. All rights reserved.
 */
'use strict';

var __ = require('underscore');
var nconf = require('nconf');
var apiSpec = require('./utils/apiSpec');

function invalidContentType(req, res, desc) {
    res.json(400, {
        'result': false,
        'message': 'Invalid Content-Type',
        'description': desc,
        'source': nconf.get('SERVER_NAME')
    });
}

function invalidQueryParameters(req, res, desc) {
    res.json(400, {
        'result': false,
        'message': 'Invalid Query Parameters specified',
        'description': desc,
        'source': nconf.get('SERVER_NAME')
    });
}

function missingRequiredQueryParameters(req, res, desc) {
    res.json(400, {
        'result': false,
        'message': 'Required Query Parameters missing',
        'description': desc,
        'source': nconf.get('SERVER_NAME')
    });
}

function apiNotDefined(req, res, e) {
    res.json(401, {
        'result': false,
        'message': !e ? 'API requested is not defined' : e,
        'description': req.url + ' is not defined',
        'source': nconf.get('SERVER_NAME')
    });
}

function serveApiSpec(req, res) {
    res.json(200, apiSpec);
}

function isValidQueryParams(req, res, queryParams) {
    var invalidQueryParameterList = [];
    var optionalParams = __.pluck(apiSpec[req.path][req.method]
        ['optional'], 'param');
    var requiredParams = __.pluck(apiSpec[req.path][req.method]
        ['required'], 'param');
    // verifying if the query parameters supplied are valid query parameters
    __.each(queryParams, function(queryParam) {
        if (!__.contains(requiredParams, queryParam) && !__.contains(optionalParams, queryParam)) {
            invalidQueryParameterList.push(queryParam);
        }
    });
    if (invalidQueryParameterList.length > 0) {
        invalidQueryParameters(req, res, 'Invalid Query Parameter(s) \'' +
            invalidQueryParameterList + '\'.');
        return false;
    } else {
        return true;
    }
};


function isValidQueryParamsType(req, res, query) {
    var optionalParamsList = apiSpec[req.path][req.method]['optional'];
    var requiredParamsList = apiSpec[req.path][req.method]['required'];
    var paramsList = optionalParamsList.concat(requiredParamsList);
    // verifying if the query parameters supplied are valid query parameters
    __.each(query, function(queryData, queryKey) {
        __.each(paramsList, function(parameter) {
            if (parameter['param'] == queryKey) {
                switch (parameter['type']) {
                    case 'string':
                        console.log("Check String: " + queryData);
                        if (__.isString(queryData) && queryData.length != 0) {
                            break;
                        } else {
                            invalidQueryParameters(req, res, 'Invalid Query Parameter Type');
                            return false;
                        }
                    case 'list':
                        console.log("Check List: " + queryData.split(',') + "  " + queryData.split(',').length);
                        if (__.isArray(queryData.split(',')) && queryData.length != 0) {
                            break;
                        } else {
                            invalidQueryParameters(req, res, 'Invalid Query Parameter Type');
                            return false;
                        }
                    case 'number':
                        console.log("Check Number: " + queryData);
                        if (Number(queryData) != NaN && queryData.length != 0) {
                            break;
                        } else {
                            invalidQueryParameters(req, res, 'Invalid Query Parameter Type');
                            return false;
                        }
                        break;
                    case 'boolean':
                        console.log("Check Boolean: " + queryData);
                        if (Number(queryData) > -1 && Number(queryData) < 2 && queryData.length != 0) {
                            break;
                        } else {
                            invalidQueryParameters(req, res, 'Invalid Query Parameter Type');
                            return false;
                        }
                        break;
                    default:
                        console.log("Err:" + queryData);
                        break;
                }
            }
        })
    });
    return true;
};


function isRequiredQueryParams(req, res, queryParams) {
    var requiredQueryParameterList = [];
    var requiredParams = __.pluck(apiSpec[req.path][req.method]
        ['required'], 'param');
    // verify if all the required query parameters are specified
    __.each(requiredParams, function(requiredQueryParam) {
        if (!__.contains(queryParams, requiredQueryParam)) {
            requiredQueryParameterList.push(requiredQueryParam);
        }
    });
    if (requiredQueryParameterList.length > 0) {
        missingRequiredQueryParameters(req, res,
            'Missing Required Query Parameter(s) ' + requiredQueryParameterList + '.');
        return false;
    } else {
        return true;
    }
};

exports.getSpec = function(req, res) {
    if (req.path.search(/^\/api\/v\d*\/spec$/) !== -1) {
        return serveApiSpec(req, res);
    } else {
        return apiNotDefined(req, res);
    }
};

exports.getObjects = function(req, res) {
    if (__.has(apiSpec, req.path)) {
        var queryParams = __.keys(req.query);
        if (isValidQueryParams(req, res, queryParams) &&
            isRequiredQueryParams(req, res, queryParams) &&
            isValidQueryParamsType(req, res, req.query)) {
            return apiSpec[req.path][req.method]['handler'](req, res);
        }
    } else {
        return apiNotDefined(req, res);
    }
};

// not used
exports.postObjects = function(req, res) {
    if (__.has(apiSpec, req.path)) {
        if (__.isEqual(req.headers['content-type'].split(';')[0],
            apiSpec[req.path][req.method]['content-type'])) {
            var queryParams = __.keys(req.body);
            if (isValidQueryParams(req, res, queryParams) &&
                isRequiredQueryParams(req, res, queryParams) &&
                isValidQueryParamsType(req, res, queryParams)) {
                return apiSpec[req.path][req.method]['handler'](req, res);
            }
        } else {
            return invalidContentType(req, res, 'Content-Type: ' +
                req.headers['content-type'].split(';')[0] + ' not supported.');
        }
    } else {
        return apiNotDefined(req, res);
    }
};