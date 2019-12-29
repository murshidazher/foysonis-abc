const handleGetTodayReport = (db, moment) => (req, res) => {

  let yesterday = moment(new Date(Date.now() - 864e5)).format('YYYY-MM-DDTHH:mm:ssZ');
  let today = moment(new Date(Date.now())).format('YYYY-MM-DDTHH:mm:ssZ');

  // inspect for permission
  return db.select('*').from('transaction_log')
  .whereBetween('t_date', [yesterday.toString() , today.toString()])
  .then(transactions => {

    console.log('transactions.length =============== ' + transactions.length);
      if (transactions.length) {
          return Promise.resolve(res.json(transactions))
      } else {
        return Promise.reject(res.status(404).json('Not transactions found'));
      }
  })
}

module.exports = {
  handleGetTodayReport
}