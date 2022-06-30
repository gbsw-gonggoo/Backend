const Sequelize = require('sequelize')

module.exports = class Apply extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
          amount : {
            type : Sequelize.INTEGER,
            allowNull : true,
            defaultValue: 0
          },
          
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Apply',
            tableName: 'apply',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        })
    }

    static associate(db){
    }
}