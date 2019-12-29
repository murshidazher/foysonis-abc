const handleCreateAccount = (db) => (req, res) => {
  const { id } = req.body;

  if ( !id ) {
      return Promise.reject('Sorry! An error occured.');
  }

  return db.transaction(trx => {
  
      return trx('bank_account')
          .returning('*')
          .insert({
              balance: 0,
              opened: new Date(),
              user_id: id,
              last_transaction_id: 0
          })
          .then(account => {
              return Promise.resolve(account[0]);
          })
        .then(trx.commit)
        .catch(trx.rollback)
      })
    .catch(err => Promise.reject('unable to create account'));
  
}

module.exports = {
  handleCreateAccount
}