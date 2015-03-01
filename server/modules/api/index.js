/*
 * file: index.js
 * Copyright (c) 2014, Ranchao Zhang & Zhihao Ni. All rights reserved.
 */
'use strict';

var __ = require('underscore');
var nconf = require('nconf');
var apiServer = require('./utils/apiServer');
var apiSpec = require('./utils/apiSpec');
var logger = require('../../utils/logger');

function filterParamValue(req, res) {
    logger.debug("filter the parameters");
    __.each(req.body, function(val, key){
        if (val == null) {
            delete req.body[key];
        }
    });
};

function isValidQueryParams(path, method, res, queryParams) {
    logger.debug("Checking if Parameter is valid");
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
        apiServer.invalidQueryParameters(res, 'Invalid Query Parameter(s) \'' +
            invalidQueryParameterList + '\'.');
        return false;
    } else {
        return true;
    }
}

function isValidQueryParamsType(path, method, res, query) {
    logger.debug("Checking if Parameter Type is valid");
    logger.debug("path: " + path + ", method: " + method + ", query: " + JSON.stringify(query));

    var optionalParamsList = apiSpec[path][method]['optional'];
    var requiredParamsList = apiSpec[path][method]['required'];
    var paramsList = optionalParamsList.concat(requiredParamsList);
    // verifying if the query parameters supplied are valid query parameters
    var result = [];
    return __.every(query, function(queryData, queryKey) {
         return __.every(paramsList, function(parameter) {
            if (parameter['param'] == queryKey) {
                switch (parameter['type']) {
                    case 'string':
                        if (__.isString(queryData) && queryData.length != 0) {
                            logger.trace("Check String Type Passed - " + queryData);
                            break;
                        } else {
                            logger.warn("Check String Type - " + queryData + "is Not a String");
                            apiServer.invalidQueryParameters(res, 'Invalid Query Parameter Type');
                            return false;
                        }
                    case 'date':
                        var date = new Date(queryData);
                        if (date instanceof Date && !isNaN(date.valueOf()) && queryData.length != 0) {
                            logger.trace("Check Date Type Passed - " + queryData);
                            break;
                        } else {
                            logger.warn("Check Date Type - " + queryData + "is Not a Date");
                            apiServer.invalidQueryParameters(res, 'Invalid Query Parameter Type');
                            return false;
                        }
                    case 'list':
                        if (__.isArray(queryData.split(',')) && queryData.length != 0) {
                            logger.trace("Check List Type Passed - " + queryData.split(',') + "  " + queryData.split(',').length);
                            break;
                        } else {
                            logger.warn("Check List Type - " + queryData + "is Not a List");
                            apiServer.invalidQueryParameters(res, 'Invalid Query Parameter Type');
                            return false;
                        }
                    case 'number':
                        if (!isNaN(queryData) && queryData.length != 0) {
                            logger.trace("Check Number Type Passed - " + queryData);
                            break;
                        } else {
                            logger.warn("Check Number Type - " + queryData + "is Not a Number");
                            apiServer.invalidQueryParameters(res, 'Invalid Query Parameter Type');
                            return false;
                        }
                    case 'boolean':
                        if (Number(queryData) > -1 && Number(queryData) < 2 && queryData.length != 0) {
                            logger.trace("Check Boolean Type Passed - " + queryData);
                            break;
                        } else {
                            logger.warn("Check Boolean Type - " + queryData + "is Not a Boolean");
                            apiServer.invalidQueryParameters(res, 'Invalid Query Parameter Type');
                            return false;
                        }
                    case 'timeString':
                        if (/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(queryData)) {
                            logger.trace("Check timeString Type Passed - " + queryData);
                            break;
                        } else {
                            if (queryData === "") {
                                logger.trace("Check empty timeString Type Passed - " + queryData);
                                break;
                            }
                            logger.warn("Check timeString Type - " + queryData + "is Not a timeString");
                            apiServer.invalidQueryParameters(res, 'Invalid Query Parameter Type');
                            return false;
                        }
                    case 'mongoId':
                        if (/^[0-9a-fA-F]{24}$/.test(queryData)) {
                            logger.trace("Check mongoId Type Passed - " + queryData);
                            break;
                        } else {
                            if (queryData === "") {
                                logger.trace("Check empty mongoId Type Passed - " + queryData);
                                break;
                            }
                            logger.warn("Check Id Type - " + queryData + "is Not a Id");
                            apiServer.invalidQueryParameters(res, 'Invalid Query Parameter Type');
                            return false;
                        }
                    default:
                        logger.warn("Invalid Query Parameter Type - " + queryData);
                        apiServer.invalidQueryParameters(res, 'Invalid Query Parameter Type');
                        return false;
                }
            }
            return true;
        })
    });
}

function isRequiredQueryParams(path, method, res, queryParams) {
    logger.debug("Checking if Parameter Type is required");
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
        apiServer.missingRequiredQueryParameters(res,
            'Missing Required Query Parameter(s) ' + requiredQueryParameterList + '.');
        return false;
    } else {
        return true;
    }
};


exports.getSpec = function(req, res) {
    if (req.path.search(/^\/api\/v\d*\/spec$/) !== -1) {
        apiServer.serveApiSpec(res);
    } else {
        apiServer.apiNotDefined(req, res);
    }
};

exports.readObject = function(req, res) {
    logger.debug("ReadObject");
    logger.debug("path: " + req.path + ", method: " + req.method);
    filterParamValue(req, res);

    if (__.has(apiSpec, req.path)) {
        var queryParams = __.keys(req.query);

        // else is handled in isValid function
        if (isValidQueryParams(req.path, req.method, res, queryParams) &&
            isRequiredQueryParams(req.path, req.method, res, queryParams) &&
            isValidQueryParamsType(req.path, req.method, res, req.query)) {
            apiSpec[req.path][req.method]['handler'](req, res);
        }
    } else {
        apiServer.apiNotDefined(req, res);
    }
};

exports.createObject = function(req, res) {
    logger.debug("CreateObject");
    logger.debug("path: " + req.path + ", method: " + req.method);
    filterParamValue(req, res);

    if (__.has(apiSpec, req.path)) {
        // TODO: check content type; if not return error
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
            logger.debug(req.headers['content-type']);
            apiServer.invalidContentType(res, 'Content-Type: ' +
                req.headers['content-type'].split(';')[0] + ' not supported.');
        }
    } else {
        apiServer.apiNotDefined(req, res);
    }
};

exports.updateObjectWithId = function(req, res) {
    logger.debug("UpdateObject");
    logger.debug("path: " + req.path + ", method: " + req.method);
    filterParamValue(req, res);

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
            apiServer.invalidContentType(res, 'Content-Type: ' +
                req.headers['content-type'].split(';')[0] + ' not supported.');
        }
    } else {
        apiServer.apiNotDefined(req, res);
    }
};

exports.deleteObjectWithId = function(req, res) {
    logger.debug("DeleteObject");
    logger.debug("path: " + req.path + ", method: " + req.method + ",da" + JSON.stringify(req.body));
    filterParamValue(req, res);

    var pathWithoutId = req.path.substring(0, req.path.lastIndexOf("/"));
    var path = pathWithoutId + '/{id}';

    if (__.has(apiSpec, path)) {
        var queryParams = __.keys(req.query);

        // else is handled in isValid function
        if (isValidQueryParams(path, req.method, res, queryParams) &&
            isRequiredQueryParams(path, req.method, res, queryParams) &&
            isValidQueryParamsType(path, req.method, res, req.query)) {
            apiSpec[path][req.method]['handler'](req, res);
        }
    } else {
        apiServer.apiNotDefined(req, res);
    }
};