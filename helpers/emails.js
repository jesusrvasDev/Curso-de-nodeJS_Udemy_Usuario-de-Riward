import nodemailer from "nodemailer"
import dotenv from "dotenv"
import colors from "colors"

dotenv.config();

const emailRegistro = async (datos) => {
        const transport = nodemailer.createTransport({
              host: process.env.EMAIL_HOST,
              port: process.env.EMAIL_PORT,
              auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
              }
            });

    transport.sendMail({
      from: "Private Person <from@example.com>",
      to: "A Test User <to@example.com>",
      subject: "Hola bienvenido al Registro de Instiuciones,programas,grados y titulaciones",
      text: "Este registro es una Operación Estaística, Coordinada y Ejecutada por el Ministerio del Poder Popular para la Educación Universitaria" 
    }, (error, info) => {
      if (error) {
        return console.log("El error es: ", error);
      }
      console.log("Message sent: %s", info.messageId);
      console.log("Estos son los datos de usuario:", datos);
    });

    }

export {
    emailRegistro
} 