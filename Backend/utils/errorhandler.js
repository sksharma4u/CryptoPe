class ErrorHandler extends Error { // Error is a default class of Node

    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = ErrorHandler