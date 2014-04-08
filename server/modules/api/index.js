/*
 * file: index.js
 * Copyright (c) 2014, Ranchao Zhang & Zhihao Ni. All rights reserved.
 */
'use strict';

var __ = require('underscore');
var nconf = require('nconf');
var apiSpec = require('./utils/apiSpec');
var logger = require(process.env.PWD + '/server/utils/logger');

// TODO move these to apiServer
function invalidContentType(res, desc) {
    logger.warn("API - invalid Content-Type: " + desc);
    res.json(400, {
        'result': false,
        'message': 'Invalid Content-Type',
        'description': desc,
        'source': nconf.get('server-name')
    });
}

function invalidQueryParameters(res, desc) {
    logger.warn("API - invalid required query parameters: " + desc);
    res.json(400, {
        'result': false,
        'message': 'Invalid Query Parameters specified',
        'description': desc,
        'source': nconf.get('server-name')
    });
}

function missingRequiredQueryParameters(res, desc) {
    logger.warn("API - missing required query parameters: " + desc);
    res.json(400, {
        'result': false,
        'message': 'Required Query Parameters missing',
        'description': desc,
        'source': nconf.get('server-name')
    });
}

function apiNotDefined(req, res, e) {
    logger.warn("API - api not defined: " + e);
    res.json(401, {
        'result': false,
        'message': !e ? 'API requested is not defined' : e,
        'description': req.url + ' is not defined',
        'source': nconf.get('server-name')
    });
}

function serveApiSpec(res) {
    logger.info("API - serving api spec");
    res.json(200, apiSpec);
}

function isValidQueryParams(path, method, res, queryParams) {
    logger.info("Checking if Parameter is valid");
    logger.debug("path: " + path + ", method: " + method + ", queryParams: " + JSON.stringify(queryParams));

    var invalidQueryParameterList = [];
    var optionalParams = __.pluck(apiSpec[path][method]
        ['optional'], 'param');
    var requiredParams = __.pluck(apiSpec[path][method]
        ['required'], 'param');
    // verifying if the query parameters supplied are valid query parameters
    __.each(queryParams, function(queryParam) {
        if (!__.contains(requiredParams, queryParam) && !__.contains(optionalParams, queryParam)) {
            invalidQueryParameterList.push(queryParam);
        }
    });

    if (invalidQueryParameterList.length > 0) {
        invalidQueryParameters(res, 'Invalid Query Parameter(s) \'' +
            invalidQueryParameterList + '\'.');
        return false;
    } else {
        return true;
    }
}


function isValidQueryParamsType(path, method, res, query) {
    logger.info("Checking if Parameter Type is valid");
    logger.debug("path: " + path + ", method: " + method + ", query: " + JSON.stringify(query));

    var optionalParamsList = apiSpec[path][method]['optional'];
    var requiredParamsList = apiSpec[path][method]['required'];
    var paramsList = optionalParamsList.concat(requiredParamsList);
    // verifying if the query parameters supplied are valid query parameters
    __.each(query, function(queryData, queryKey) {
        __.each(paramsList, function(parameter) {
            if (parameter['param'] == queryKey) {
                switch (parameter['type']) {
                    case 'string':
                        if (__.isString(queryData) && queryData.length != 0) {
                            logger.debug("Check String Type Passed - " + queryData);
                            break;
                        } else {
                            logger.warn("Check String Type - " + queryData + "is Not a String");
                            invalidQueryParameters(res, 'Invalid Query Parameter Type');
                            return false;
                        }
                    case 'date':
                        var date = new Date(queryData);
                        if (date instanceof Date && !isNaN(date.valueOf()) && queryData.length != 0) {
                            logger.debug("Check Date Type Passed - " + queryData);
                            break;
                        } else {
                            logger.warn("Check Date Type - " + queryData + "is Not a Date");
                            invalidQueryParameters(res, 'Invalid Query Parameter Type');
                            return false;
                        }
                    case 'list':
                        if (__.isArray(queryData.split(',')) && queryData.length != 0) {
                            logger.debug("Check List Type Passed - " + queryData.split(',') + "  " + queryData.split(',').length);
                            break;
                        } else {
                            logger.warn("Check List Type - " + queryData + "is Not a List");
                            invalidQueryParameters(res, 'Invalid Query Parameter Type');
                            return false;
                        }
                    case 'number':
                        if (!isNaN(queryData) && queryData.length != 0) {
                            logger.debug("Check Number Type Passed - " + queryData);
                            break;
                        } else {
                            logger.warn("Check Number Type - " + queryData + "is Not a Number");
                            invalidQueryParameters(res, 'Invalid Query Parameter Type');
                            return false;
                        }
                    case 'boolean':
                        if (Number(queryData) > -1 && Number(queryData) < 2 && queryData.length != 0) {
                            logger.debug("Check Boolean Type Passed - " + queryData);
                            break;
                        } else {
                            logger.warn("Check Boolean Type - " + queryData + "is Not a Boolean");
                            invalidQueryParameters(res, 'Invalid Query Parameter Type');
                            return false;
                        }
                    default:
                        logger.warn("Invalid Query Parameter Type - " + queryData);
                        invalidQueryParameters(res, 'Invalid Query Parameter Type');
                        return false;
                }
            }
            return true;
        })
    });
    return true;
}

function isRequiredQueryParams(path, method, res, queryParams) {
    logger.info("Checking if Parameter Type is required");
    logger.debug("path: " + path + ", method: " + method + ", queryParams: " + JSON.stringify(queryParams));

    var requiredQueryParameterList = [];
    var requiredParams = __.pluck(apiSpec[path][method]
        ['required'], 'param');
    // verify if all the required query parameters are specified
    __.each(requiredParams, function(requiredQueryParam) {
        if (!__.contains(queryParams, requiredQueryParam)) {
            requiredQueryParameterList.push(requiredQueryParam);
        }
    });
    if (requiredQueryParameterList.length > 0) {
        missingRequiredQueryParameters(res,
            'Missing Required Query Parameter(s) ' + requiredQueryParameterList + '.');
        return false;
    } else {
        return true;
    }
};

exports.getSpec = function(req, res) {
    if (req.path.search(/^\/api\/v\d*\/spec$/) !== -1) {
        serveApiSpec(res);
    } else {
        apiNotDefined(req, res);
    }
};

exports.readObject = function(req, res) {
    logger.info("ReadObject");

    if (__.has(apiSpec, req.path)) {
        var queryParams = __.keys(req.query);

        // else is handled in isValid function
        if (isValidQueryParams(req.path, req.method, res, queryParams) &&
            isRequiredQueryParams(req.path, req.method, res, queryParams) &&
            isValidQueryParamsType(req.path, req.method, res, req.query)) {
            apiSpec[req.path][req.method]['handler'](req, res);
        }
    } else {
        apiNotDefined(req, res);
    }
};

exports.createObject = function(req, res) {
    logger.info("CreateObject");

    if (__.has(apiSpec, req.path)) {
        if (__.isEqual(req.headers['content-type'].split(';')[0],
            apiSpec[req.path][req.method]['content-type'])) {
            var queryParams = __.keys(req.body);

            // else is handled in isValid function
            if (isValidQueryParams(req.path, req.method, res, queryParams) &&
                isRequiredQueryParams(req.path, req.method, res, queryParams) &&
                isValidQueryParamsType(req.path, req.method, res, req.body)) {
                apiSpec[req.path][req.method]['handler'](req, res);
            }
        } else {
            invalidContentType(res, 'Content-Type: ' +
                req.headers['content-type'].split(';')[0] + ' not supported.');
        }
    } else {
        apiNotDefined(req, res);
    }
};

exports.updateObjectWithId = function(req, res) {
    logger.info("UpdateObject");

    var pathWithoutId = req.path.substring(0, req.path.lastIndexOf("/"));
    var path = pathWithoutId + '/{id}';
    if (__.has(apiSpec, path)) {
        if (__.isEqual(req.headers['content-type'].split(';')[0],
            apiSpec[path][req.method]['content-type'])) {
            var queryParams = __.keys(req.body);

            // else is handled in isValid function
            if (isValidQueryParams(path, req.method, res, queryParams) &&
                isRequiredQueryParams(path, req.method, res, queryParams) &&
                isValidQueryParamsType(path, req.method, res, req.body)) {
                apiSpec[path][req.method]['handler'](req, res);
            }
        } else {
            invalidContentType(res, 'Content-Type: ' +
                req.headers['content-type'].split(';')[0] + ' not supported.');
        }
    } else {
        apiNotDefined(req, res);
    }
};

exports.deleteObjectWithId = function(req, res) {
    logger.info("DeleteObject");

    var pathWithoutId = req.path.substring(0, req.path.lastIndexOf("/"));
    var path = pathWithoutId + '/{id}';
    if (__.has(apiSpec, path)) {
        if (__.isEqual(req.headers['content-type'].split(';')[0],
            apiSpec[path][req.method]['content-type'])) {
            var queryParams = __.keys(req.body);

            // else is handled in isValid function
            if (isValidQueryParams(path, req.method, res, queryParams) &&
                isRequiredQueryParams(path, req.method, res, queryParams) &&
                isValidQueryParamsType(path, req.method, res, req.body)) {
                apiSpec[path][req.method]['handler'](req, res);
            }
        } else {
            invalidContentType(res, 'Content-Type: ' +
                req.headers['content-type'].split(';')[0] + ' not supported.');
        }
    } else {
        apiNotDefined(req, res);
    }
};