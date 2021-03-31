// Associate a message and status code to present to user when there is an error
class ExpressError extends Error {
    constructor(message, statusCode) {
        super()
        this.message = message
        this.statusCode = statusCode
    }
}

module.exports = ExpressError