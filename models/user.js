const Sequelize = require('sequelize')

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            nickname: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            email: {
                type: Sequelize.STRING(40),
                allowNull: false,
                unique: true,
            },
            emailVerify: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            name: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            number: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            profileImg: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            backgroundImg: {
                type: Sequelize.STRING,
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: 'user',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        })
    }

    static associate(db){
        db.User.belongsToMany(db.Product, {
            foreignKey: 'registeredUser',
            as: 'RegisteredUser',
            through: 'Apply',
        })
    }
}
