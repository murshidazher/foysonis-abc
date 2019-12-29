const requireAuth = (redisClient) => (req, res, next) => {
    let { authorization } = req.headers;

    if (authorization.startsWith('Bearer ')) {
        authorization = authorization.slice(7, authorization.length);
    }

    if (!authorization) {
        return res.status(401).json('Unauthorized');
    }
    
    return redisClient.get(authorization, (err, reply) => {
        if (err || !reply) {
            return res.status(401).json('Unauthorized');
        }
        return next()
    })    
}

module.exports = {
    requireAuth
}