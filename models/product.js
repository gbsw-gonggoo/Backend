const Sequelize = require('sequelize');
const User = require('./user');

module.exports = class Product extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
          author : {
            type : Sequelize.INTEGER,
            allowNull : false,
          },
          name : {
            type : Sequelize.STRING(30),
            allowNull : false,
          },
          amount : {
            type : Sequelize.STRING(20),
            allowNull : false,
          },
          price : {
            type : Sequelize.INTEGER(20),
            allowNull : false,
          },
          image : {
            type : Sequelize.STRING(200),
            allowNull : true,
          },
          text : {
            type : Sequelize.STRING(50),
            allowNull : true,
          },
          targetCount : {
            type : Sequelize.INTEGER,
            allowNull : false,
          },
          count : {
            type : Sequelize.INTEGER,
            allowNull : false,
          },
          maxCount : {
            type : Sequelize.INTEGER,
            allowNull : false,
          },
          date : {
            type : Sequelize.DATE,
            allowNull : false,
          },
          link : {
            type : Sequelize.STRING,
            allowNull : false,
          }

        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Product',
            tableName: 'product',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db){
      db.Product.belongsToMany(db.User, {
        foreignKey: 'registeredProduct',
        ad: 'productId',
        through: 'Apply',
      })
    }
};
