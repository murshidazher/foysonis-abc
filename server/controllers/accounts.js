const handleGetAccounts = (db) => (req, res) => {
  const { id } = req.body;

  return db.select('id').from('bank_account').where({ 'user_id': id })
    .then(accounts => {
      if (accounts.length) {
        Promise.resolve(res.status(200).json(accounts))
      } else {
        Promise.reject(res.status(404).json('Not found'));
      }
  })
}

const handleGetAccountDetails = (db) => (req, res) => {
  const { id, account_id } = req.body;

  return db.select('*').from('bank_account')
  .where({
    'user_id': id,
    'id': account_id
  })
  .then(account => {
      if (account.length) {
        Promise.resolve(res.json(account[0]));
      } else {
        Promise.reject(res.status(404).json('Not found'));
      }
  })
}

const handleGetAllUserAccounts = (db) => (req, res) => {

  return db.select('id', 'name').from('user_account')
    .where({'user_role_id': 3})
  .then(account => {
      if (account.length) {
        Promise.resolve(res.json(account));
      } else {
        Promise.reject(res.status(404).json('Not found'));
      }
  })
}

module.exports = {
  handleGetAccounts,
  handleGetAccountDetails,
  handleGetAllUserAccounts
}