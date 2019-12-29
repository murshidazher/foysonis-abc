

const getPermissionType = (db, permission_id) => {

  return db.select('*').from('permission')
    .where('id', '=', permission_id)
    .then(type => {
      if (type.length) {
          return Promise.resolve(type[0].name);
        } else {
          return Promise.reject('Not found');
        }
    })
}

const getPermissionId = (db, role_id) => {

  return db.select('*').from('role_permission')
    .where('user_role_id', '=', role_id)
    .then(permission => {

      if (permission.length) {
          return Promise.resolve(permission[0].permission_id);
        } else {
          return Promise.reject('Not found');
        }
    })
}

const handlerGetPermissionType = (db) => (req, res) => {
    
  const { id } = req.params;
  
  return getPermissionId(db, id).then(permission => {
    return getPermissionType(db, permission).then(type => {
        if (type.length !== 0) return Promise.resolve(res.json(type));
        else return Promise.reject(res.status(400).json('Unable to get'));
      })
    })
};


const getGroupType = (db, group_id) => {

  return db.select('*').from('user_group')
    .where('id', '=', group_id)
    .then(type => {
      if (type.length) {
          return type[0].name;
        } else {
          return 'Not found';
        }
    })
}

const handlerGetGroupType = (db) => (req, res) => {
    
  const { id } = req.params;

  return getGroupType(db, id).then(type => {


      if (type.length !== 0) return res.json(type);
      else return res.status(400).json('Unable to get');
  })
    
};

module.exports = {
  handlerGetPermissionType,
  handlerGetGroupType
}