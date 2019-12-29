const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const moment = require('moment');

const morgan = require('morgan');

// Handlers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const signout = require('./controllers/signout');
const profile = require('./controllers/profile');
const createAccount = require('./controllers/createAccount');
const transaction = require('./controllers/transaction');
const accounts = require('./controllers/accounts');
const report = require('./controllers/report');
const role = require('./controllers/role');


const auth = require('./middleware/authorization');

const PORT = process.env.PORT || 8080;

//setup postgresql for dockers
const db = knex({
  client: 'pg',
  connection: process.env.POSTGRES_URI
});


// setup redis client
const redisClient = redis.createClient(process.env.REDIS_URI);


const app = express();

app.use(bodyParser.json());

app.use(morgan('short'));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Server is running..');
})

app.get('/', (res, req) => { res.send("Server is working...") })

app.post('/signin', signin.handleSigninAuthentication(db, bcrypt, redisClient, jwt))

app.post('/signout', auth.requireAuth(redisClient), signout.handleSignOut(redisClient))

app.post('/register', register.handleRegisterAuthentication(db, bcrypt, redisClient, jwt))

app.get('/profile/:id', auth.requireAuth(redisClient), profile.handleProfileGet(db))

app.post('/profile/:id', auth.requireAuth(redisClient), profile.handleProfileUpdate(db))

app.post('/account/all', auth.requireAuth(redisClient), accounts.handleGetAccounts(db))

app.post('/account/details', auth.requireAuth(redisClient), accounts.handleGetAccountDetails(db))

app.get('/account/users/all', auth.requireAuth(redisClient), accounts.handleGetAllUserAccounts(db))

app.post('/account/create', auth.requireAuth(redisClient), createAccount.handleCreateAccount(db))

app.post('/account/transaction', auth.requireAuth(redisClient), transaction.handleTransaction(db))

app.post('/account/transaction/all', auth.requireAuth(redisClient), transaction.handlerGetAllTransaction(db))

app.get('/account/transaction/all/:id', auth.requireAuth(redisClient), transaction.handlerGetTransaction(db))

app.get('/role/permission/:id', auth.requireAuth(redisClient), role.handlerGetPermissionType(db))

app.get('/role/group/:id', auth.requireAuth(redisClient), role.handlerGetGroupType(db))

app.get('/account/transaction/types', auth.requireAuth(redisClient), transaction.getAllTransactionTypes(db))

app.get('/report', auth.requireAuth(redisClient), report.handleGetTodayReport(db, moment))


app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`)
})
