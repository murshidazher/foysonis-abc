const handleProfileGet = (db) => (req, res) => {
    const { id } = req.params;

    db.select('*').from('user_account').where({ id })
    .then(user => {

        if (user.length) {
            res.json({
                email: user[0].email,
                id: user[0].id,
                name: user[0].name,
                joined: user[0].joined,
                group_id: user[0].group_id,
                user_role_id: user[0].user_role_id,
            })
        } else {
            res.status(404).json('Not found');
        }
    })
}

const handleProfileUpdate = (db) => (req, res) => { 
    const { id } = req.params;
    const { name } = req.body.formInput;

    const obj = {}
    if (name !== undefined && name !== null && name !== '') obj.name = name;


    db('user_account')
        .where({ id })
        .update({
            ...obj
        })
        .then( resp => {
            if (resp) {
                res.status(200).json('success')
            } else {
                res.status(400).json('Unable to update');
            }
        })
    .catch(err => res.status(400).json('Error update'))

}

module.exports = {
    handleProfileGet,
    handleProfileUpdate
}