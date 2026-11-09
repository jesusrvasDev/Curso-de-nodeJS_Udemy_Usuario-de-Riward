import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import db from '../data/db.js'


const Usuarios= db.define('usuarios',{
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN,
    }, {
        hooks: {
    beforeCreate: async function(usuario) {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
        }
    }    
})

export default Usuarios