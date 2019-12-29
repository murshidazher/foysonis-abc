const handleRegister = (db, bcrypt, req, res) => {

    const {email, name, password} = req.body;

    if ( !email || !password || !name ) {
        return Promise.reject('incorrect form submission');
    }

    const hash = bcrypt.hashSync(password);

    console.log('hash is ----- = ' + hash);

    return db.transaction(trx => {
        return trx.insert({
            hash: hash,
            email: email
        })
        .into('credential')
        .returning('email')
            .then(loginEmail => {

                // select user group
                return trx('user_group')
                    .where({
                        name: 'Customer',
                    }).select('id')
                    .then(userGroup => {

                        // select user role
                        return trx('user_role')
                        .where({
                            name: 'Account Holder',
                        }).select('id')
                        .then(userRole => {

                            return trx('user_account')
                                .returning('*')
                                .insert({
                                    name: name,
                                    email: loginEmail[0],
                                    joined: new Date(),
                                    group_id: userGroup[0].id,
                                    user_role_id: userRole[0].id,
                                })
                                .then(user => {
                                    return Promise.resolve(user[0]);
                                })
                        })
                    })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
	.catch(err => Promise.reject('unable to register'));
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

const handleRegisterAuthentication = (db, bcrypt, redisClient, jwt) => (req, res) => {
    
    return handleRegister(db, bcrypt, req, res)
        .then(data => {
            
                return (data.id && data.email) ? createSessions(data, redisClient, jwt): Promise.reject(data)
            })
            .then(session => res.status(200).json(session))
            .catch(err => res.status(400).json(err))
}

module.exports = {
    handleRegisterAuthentication
}