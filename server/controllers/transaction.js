/**
 * Get transaction details from the database.
 * @param {database} db 
 * @param {interger} transaction_id 
 */
const getTransactionType = (db, transaction_id) => {

  return db.select('*').from('transaction_type')
    .where('id', '=', transaction_id)
    .then(transaction => {

      if (transaction.length) {
          return transaction[0];
        } else {
          return 'Not found';
        }
    })
}

const getTransactionLog = (db, transaction_id) => {

  return db.select('*').from('transaction_log')
    .where('id', '=', transaction_id)
    .then(transaction => {

      if (transaction.length) {
          return transaction[0];
        } else {
          return 'Not found';
        }
    })
}

const handlerGetTransaction = (db) => (req, res) => {
    
  const { id } = req.params;

  return getTransactionLog(db, id).then(transaction => {
      
      if (transaction.length !== 0) return res.json(transaction);
      else return res.status(400).json('Unable to get');
    })
};

const handlerGetAllTransaction = (db) => (req, res) => {
    
  const { id } = req.body;
  return db.select('*').from('transaction_log')
    .where('bank_account_id', '=', id)
    .orderBy('t_date', 'desc')
    .then(transactions => {
      if (transactions.length) {
          return res.json(transactions);
        } else {
          return res.status(400).json('Unable to get');
        }
   })
};

/**
 * Get All transaction types details from the database.
 * @param {database} db 
 */
const getAllTransactionTypes = (db) => (req, res) => {

  db.select('*').from('transaction_type')
  .then(data => {

    if (data.length) {
        res.status(200).json(data);
      } else {
          res.status(404).json('Not found');
      }
  })
}

/**
 * Get account balance from the database.
 * @param {database} db 
 * @param {interger} account_id
 */
const getBalance = (db, account_id) => {

  return db.select('balance').from('bank_account')
    .where('id', '=', account_id)
    .then(account => {

      if (account.length) {
          return account[0].balance;
        } else {
          return 'Not found';
        }
    })
    .catch(err => Promise.reject('Unexpected error')) 
}

/**
 * Handle Bank transactions like deposits and withdrawals.
 * @param {daabase} db 
 * @param {json} req 
 * @param {json} res 
 */
const handleTransaction = (db) => (req, res) => {

  const {user_id, bank_account_id, transaction_id, amount } = req.body;

  getTransactionType(db, transaction_id).then(transaction_details => {
    getBalance(db, bank_account_id).then(balance => {

      if (!user_id || !bank_account_id || !transaction_id || !transaction_details || !amount) {
        return Promise.reject('Sorry! An error occured.');
      }
  
      let new_balance = balance;
  
      if (amount <= 0) {
        return Promise.reject('Sorry! Invalid transaction amount.');
      } else if (transaction_details.name === 'Withdrawal') {
        if (balance < amount)
          return Promise.reject('Sorry! Insufficient Balance.');
        else
          new_balance = parseFloat(parseFloat(new_balance) - parseFloat(amount));
        
      } else {
        new_balance = parseFloat(parseFloat(new_balance) + parseFloat(amount));
      }
  
      return db.transaction(trx => {
    
        return trx('transaction_log')
          .returning('*')
          .insert({
            t_date: new Date(),
            t_type_id: transaction_id,
            t_amount: amount,
            new_balance: new_balance,
            bank_account_id: bank_account_id,
            user_account_id: user_id,
          })
          .then(log => {
            return trx('bank_account')
              .where({'id': bank_account_id})
              .update({
                balance: new_balance,
                last_transaction_id: log[0].id
              })
              .returning('*')
              .then(account => {
                return res.json({
                  balance: account[0].balance,
                  last_transaction_id: log[0].id
                });
              })
          })
          .then(trx.commit)
          .catch(trx.rollback)
      })
    })
  })

  .catch(err => Promise.reject('unable to create account'));
}

module.exports = {
  handleTransaction,
  getAllTransactionTypes,
  handlerGetTransaction,
  handlerGetAllTransaction
}