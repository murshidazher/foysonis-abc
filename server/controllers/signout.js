
const deleteToken = (token, redisClient) => {
    return Promise.resolve(redisClient.del(token))
}

const deleteSessions = (authorization, redisClient) => {

    const token = authorization;
    
    return deleteToken(token, redisClient)
        .then(() => ({
            logout: 'true'
        }))
        .catch(console.log)
}

const handleSignOut = (redisClient) => (req, res) => {
    const { authorization } = req.headers;

    return authorization ? (deleteSessions(authorization, redisClient)
            .then(session => res.status(200).json(session))
        .catch(err => res.status(400).json(err))) :
        res.status(400).json(err)
}

module.exports = {
    handleSignOut
}