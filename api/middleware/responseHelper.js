import { inspect } from "node:util";

import { StatusCodes } from "http-status-codes";

function isString(aValue) {
  return (typeof aValue === "string" || aValue instanceof String);
}

function hasValue(aTarget, aPropName) {
  let value = aTarget[aPropName];
  let valueInTarget = aPropName in aTarget;
  let valueIsNotNull = value != null;
  let valueIsEmptyString = false;
  if (isString(value)) {
    valueIsEmptyString = value.trim() === "";
  }
  return valueInTarget && valueIsNotNull && !valueIsEmptyString;
}

function hasNull(aTarget, aValues) {
  if (!Array.isArray(aValues)) {
    aValues = [aValues];
  }

  const nullValues = [];
  for (let i = 0; i < aValues.length; i++) {
    let value = aValues[i];
    if (hasValue(aTarget, value)) {
      continue;
    }
    nullValues.push(value);
  }

  if (nullValues.length === 0) {
    return null;
  }
  return nullValues;
}

const LOG = true;
const FILTER = [];
const TRACE_SERVER_ERROR = false;
const TRACE_UNAUTHORIZED = false;
const TRACE_BAD_REQUEST = false;
const TRACE_FORBIDDEN = false;
const TRACE_ALL = false;

export function ResponseHelper(aRequest, aResponse, aNext) {
  aResponse.sendOne = function(aStatusCode, aStatusText, aData) {
    const body = {
      status: aStatusText,
      ...aData
    };
    // Dump entire response body to console if we're logging info.
    const passedFilter = FILTER.length === 0 ||
            FILTER.some(keyword => aRequest.originalUrl?.includes(keyword));
    if (LOG && passedFilter) {
      console.log("");
      console.log(`${aRequest.method} (${aStatusCode}) ${aRequest.originalUrl}`);
      console.log(new Date());
      console.log(inspect(body, false, null, true));
    }
    let traceReason = null;
    if ((TRACE_SERVER_ERROR && aStatusCode === StatusCodes.INTERNAL_SERVER_ERROR) ||
            (TRACE_UNAUTHORIZED && aStatusCode === StatusCodes.UNAUTHORIZED) ||
            (TRACE_BAD_REQUEST && aStatusCode === StatusCodes.BAD_REQUEST) ||
            (TRACE_FORBIDDEN && aStatusCode === StatusCodes.FORBIDDEN) ||
            (TRACE_ALL)) {
      traceReason = aStatusCode;
    }
    if (traceReason != null) {
      console.trace(traceReason);
    }
    aResponse
      .status(aStatusCode)
      .send(body);
    return true;
  };

  aResponse.sendError = function(aError, aStatus) {
    let error = aError;
    // Take only the message if we have an error object.
    let errorIsMessage = true;
    if (aError instanceof Error || isString(aError?.message)) {
      error = aError.message;
    } else if (isString(aError)) {
      error = aError;
    } else {
      errorIsMessage = false;
    }
    return aResponse.sendOne(aStatus, "FAILED", errorIsMessage ? { message: error } : error);
  };

  aResponse.sendErrorServer = function(aError) {
    return aResponse.sendError(
      aError,
      StatusCodes.INTERNAL_SERVER_ERROR);
  };

  aResponse.sendErrorClient = function(aError) {
    return aResponse.sendError(
      aError,
      StatusCodes.BAD_REQUEST);
  };

  aResponse.sendErrorEmptyParam = function(aName) {
    return aResponse.sendError(
      {
        message: "Parameter cannot be empty",
        paramName: aName
      },
      StatusCodes.BAD_REQUEST);
  };

  aResponse.sendErrorEmptyBody = function(aValues) {
    const fieldNames = hasNull(aRequest.body, aValues);

    if (fieldNames) {
      return aResponse.sendError(
        {
          message: "One or more required fields are missing or empty",
          fieldNames
        },
        StatusCodes.BAD_REQUEST);
    }

    return false;
  };

  aResponse.sendErrorEmptyQuery = function(aValues) {
    const fieldNames = hasNull(aRequest.query, aValues);

    if (fieldNames) {
      return aResponse.sendError(
        {
          message: "One or more required query parameters are missing or empty",
          fieldNames
        },
        StatusCodes.BAD_REQUEST);
    }

    return false;
  };

  aResponse.sendErrorUnauthenticated = function(aMessage) {
    return aResponse.sendError(
      {
        message: aMessage ?? "Authentication is required to use this API",
      },
      StatusCodes.UNAUTHORIZED);
  };

  aResponse.sendErrorForbidden = function(aMessage) {
    return aResponse.sendError(
      {
        message: aMessage ?? "This action is forbidden",
      },
      StatusCodes.FORBIDDEN);
  };

  aResponse.sendErrorNotFound = function() {
    return aResponse.sendError(
      {
        message: "The requested resource was not found",
      },
      StatusCodes.NOT_FOUND);
  };

  aResponse.sendErrorNoData = function() {
    return aResponse.sendError(
      {
        message: "No data provided",
      },
      StatusCodes.BAD_REQUEST);
  };

  aResponse.sendOk = function(aData = {}) {
    return aResponse.sendOne(StatusCodes.OK, "OK", aData);
  };

  return aNext();
}
