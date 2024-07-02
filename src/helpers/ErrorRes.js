class ErrorRes extends Error {
    constructor(statusCode,message) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = ErrorRes