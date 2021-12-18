const { clearHash } = require('../services/cache')


module.exports = async (req, res, next) => {
    //Let the router habdler to run before the clearHAsh middleware
    await next();
    //to clear cache with an id while making a post request
    clearHash(req.user.id)
}