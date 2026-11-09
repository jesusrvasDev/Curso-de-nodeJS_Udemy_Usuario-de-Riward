import express from 'express'
import colors from 'colors'
import router from './routers/authUser.js'
import db from './data/db.js'



// Se crea la instancias de express, es decir, la aplicacion 
const app= express()

// Habilitar lectura de datos en el servidor 

app.use(express.urlencoded({extended: true}))


// Conexión de la base de datos por medio de sequelice

try {
    await db.authenticate();
    db.sync()   // Crea las tabla en la base de datos, si o existe
    console.log('Conexión realizada con exito a la base de datos jesusrvasDB'.bgGreen.red.bold)
} catch (error) {
    console.log('El error en la conexión es: ' + error)
}

// Habilitar pug (Templeate engine), .set es para agregar configuraciones
app.set('view engine','pug')
app.set('views','./views')

// Carpeta publica
app.use(express.static('public'))

// Aqui las rutas, se redirige al rauoter de autenticacion de usuario
app.use('/auth', router)


// Se crea una constante para defirir el tipo de puerto, local o una variable de entorno en caso de conexion a otro servidor 
const port=3001 || process.env.PORT

// Se levanta el servidor, indicando por que puerto estara escuchando
app.listen(port,()=>{
    console.log("Servidor funcionando por el puerto 3001".bgGreen.red.bold)
})