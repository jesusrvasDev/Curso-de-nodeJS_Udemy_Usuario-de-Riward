import { check,validationResult } from "express-validator"
import colors from 'colors'
import generateID from "../helpers/tokens.js"
import Usuarios from "../models/Usuarios.js"
import { emailRegistro} from "../helpers/emails.js"



// Controladores para el registro de usuarios
const formularioRegister = (req,resp)=>{
        
        // Renderizar el formulario de registro de usuarios por primer vez, sin errores ni  datos ingresados por el usuario
        resp.render('./Auth/register.pug',{
            pagina:"Crear cuenta"
        })
    }
    const Registra = async (req,resp)=>{
            // Validaciones de los campos del fromaulario 
            await check('nombre').notEmpty().withMessage('El nombre no debe estar vacio').run(req);
            await check('email').isEmail().withMessage('El campo correo debe tener formato de correo electrónico').run(req);
            await check('password').isLength({min:6}).withMessage('El campo password debe tener al menos 6 carácteres').run(req);
            //await check('repite_password').equals('pepino').withMessage('El password no coincide').run(req); //ESTA VALIDACION NO FUNCIONA, SE DEBE HACER DE OTRA MANERA, YA QUE EL METODO EQUALS COMPARA CON UN STRING Y NO CON EL VALOR DE OTRO CAMPO DEL FORMULARIO
            await check('repite_password').custom((value,{req})=> {
                if (value !== req.body.password) {
                    throw new Error('El password no coinciden')
                }   console.log("El password coincide".bgGreen.magenta.bold)
                return true
            }).run(req);

    // Se obtiene el resultado de la validacion en la consola del servidor, para verificar que los datos del formulario sean correctos
    let resultado=validationResult(req);        
    console.log("resultado de la validacion es".bgRed.white.bold, resultado)

    // Verificar que el resultado este vacio para poder continuar con el registro del usuario, en caso de que no este vacio se redirige al formulario de registro con los errores y los datos ingresados por el usuario
    if(!resultado.isEmpty()) {
        return resp.render('./Auth/register.pug',{
             pagina: "Crear página",  
             errores:resultado.array(),
                usuario: {
                 nombre: req.body.nombre,
                 correo: req.body.email
                }              
        })
    }

    // extraer los datos del formulario
    const {nombre,email,password} = req.body

    // Verificar que el usuario no tenga un correo ya registrado
    const existeUsuario = await Usuarios.findOne({where:{email:req.body.email}})
       if (existeUsuario) {
        // Si el usuario ya existe, se redirige al formulario de registro con un mensaje de error y los datos ingresados por el usuario
           return resp.render('./Auth/register.pug',{
                  pagina: "Crear Cuenta",
                  errores:[{msg:"El correo esta registrado"}],
                  usuario: {nombre,email}            
           })     
        }

    // Crear el usuario en la base de datos con los datos que se pasan en el objeto del método crate  
       const usuario = await Usuarios.create({
        nombre,
        email,
        password,
        token: generateID()
       })
    
    // Enviar el correo de confirmacion de cuenta al usuario registrado
    await emailRegistro({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })

    // Se renderiza la vista de registro de usuario con un mensaje de éxito y los datos del usuario registrado
       
       resp.render('./Templates/mensaje.pug',{
           pagina: "Cuenta creada correctamente",
           mensaje: `Bienvenido, tu cuenta ha sido creada correctamente. Por favor revisa tu correo electrónico ${usuario.nombre} para confirmar tu cuenta.`
       })
       
    
       //console.log("informacion de la peticion",req.body)
       //console.log("Informacion de la respuesta",usuario)
    }

// Controlador para el login de usuarios
const formularioLogin = (req,resp)=>{
   resp.render('./Auth/login.pug',{
   pagina:"Inicia Sesión" 
   })
}

// Controlador para el olvido de password
const formularioOlvide_password = (req,resp)=>{
    resp.render('./Auth/olvide_password.pug',{
        pagina:"Recupera tu Password"
    })
}

export {
    formularioLogin,
    formularioRegister,
    Registra,
    formularioOlvide_password
}