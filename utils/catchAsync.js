// Avoid uncaught promises errors to be catched by error routing in app.js
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}