const handleSignin = (db, bcrypt, req, res) => {

    const { email, password } = req.body;

    if ( !email || !password ) {
        return Promise.reject('incorrect form submission');
    }

    return db.select('email', 'hash').from('credential')
    .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);

            if(isValid) {
                return db.select('*').from('user_account')
                .where('email', '=', email)
                .then(user => {
                    return ({
                        email: user[0].email,
                        id: user[0].id,
                    })
                })
                .catch(err => Promise.reject('error logging in'));
            } else {
                Promise.reject('wrong credentials')
            }
        })
        .catch(err => Promise.reject('wrong credentials'))    
}

const getAuthTokenId = (req, res, redisClient) => {
    let { authorization } = req.headers;

    if (authorization.startsWith('Bearer ')) {
        authorization = authorization.slice(7, authorization.length);
    }

    return redisClient.get(authorization, (err, reply) => {
        if (err || !reply) {
            return res.status(400).json('Unauthorized');
        }
        return res.json({id: reply});
    })
}

const signToken = (email, jwt) => {
    const jwtPayload = { email };
    return jwt.sign(jwtPayload, 'JWT_SECRET', {expiresIn: '2 days'});
}

const setToken = (token, id, redisClient) => {
    return Promise.resolve(redisClient.set(token, id))
}

const createSessions = (user, redisClient, jwt) => {
    
    // JWT token
    const { id, email } = user;
    const token = signToken(email, jwt);
    return setToken(token, id, redisClient)
        .then(() => ({
            success: 'true',
            userId: id,
            token: token
        }))
        .catch(console.log)
}

const handleSigninAuthentication = (db, bcrypt, redisClient, jwt) => (req, res) => {
    const { authorization } = req.headers;

    return authorization ?
        getAuthTokenId(req, res, redisClient) :
        handleSignin(db, bcrypt, req, res)
            .then(data => {
                return data.id && data.email ? createSessions(data, redisClient, jwt): Promise.reject(data)
            })
            .then(session => res.status(200).json(session))
            .catch(err => res.status(400).json(err))
}

module.exports = {
    handleSigninAuthentication
}