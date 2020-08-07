const Sequelize = require('sequelize')

const sqlConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "network_disk"
}

console.log('init sequelize...');
console.log('mysql: ' + JSON.stringify(sqlConfig));

const sequelize = new Sequelize(sqlConfig.database, sqlConfig.user, sqlConfig.password, {
  host: sqlConfig.host,
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    idle: 10000
  },
  timezone: '+08:00'
})

exports.sequelize = sequelize
exports.defineModel = (name, attributes) => {
  const attrs = {}
  for(let key in attributes) {
    let val = attributes[key]
    if(typeof val === 'object' && val['type']) {
      val.allowNull = val.allowNull || false
      attrs[key] = val
    } else {
      attrs[key] = {
        type: val
      }
    }
  }
  attrs.version = {
    type: Sequelize.BIGINT
  }
  attrs.createUser  = {
    type: Sequelize.STRING,
    allowNull: false
  }
  attrs.updateUser = {
    type: Sequelize.STRING,
    allowNull: false
  }
  return sequelize.define(name, attrs, {
    tableName: name,
    timestamps: true,
    paranoid: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    hooks: {
      beforeBulkCreate: (obj) => {
        obj.version = 0
      },
      beforeValidate: (obj) => {
        obj.isNewRecord ? obj.version = 0 : obj.version = obj.version + 1
      }
    }
  })
}
