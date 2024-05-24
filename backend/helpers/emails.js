// 4 correos uno para confirmar / recuperar contraseña / añadido al proyecto / eliminado del proyecto
// import nodemailer from "nodemailer";
import dotenv from 'dotenv';

// Configurar dotenv para cargar las variables de entorno
dotenv.config();

// Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const emailRegistro = async (datos) => {
  // console.log("Datos usuario:", datos);
  const { email, nombre, token } = datos;

  const msg = {
    to: email,
    from: 'francisco.ortega@cua.uam.mx', // Dirección verificada en SendGrid
    subject: 'Administrador de proyectos - Confirma tu cuenta',
    text: 'Comprueba tu cuenta en Administrador de proyectos',
    html: `<p>Hola: ${nombre} Comprueba tu cuenta ahora</p>
           <p>Tu cuenta está ya casi lista, solo debes comprobarla con el siguiente enlace:
           <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a></p>
           <p>Si tú no creaste la cuenta, puedes ignorar este mensaje.</p>`,
  };
  try {
    await sgMail.send(msg);
    console.log('Mensaje enviado');
  } catch (error) {
    console.error('Error al enviar el email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};
export const emailOlvidePassword = async (datos) => {
  const { email, nombre, token } = datos;

  const msg = {
    to: email,
    from: 'francisco.ortega@cua.uam.mx', // Dirección verificada en SendGrid
    subject: 'Administrador de proyectos - Restablece tu contraseña',
    text: 'Restablece tu contraseña en Administrador de proyectos',
    html: `<p>Hola: ${nombre}, has solicitado restablecer tu contraseña</p>
           <p>Sigue el siguiente enlace para generar una nueva contraseña:
           <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer Contraseña</a></p>
           <p>Si tú no solicitaste este email, puedes ignorar este mensaje.</p>`,
  };

  try {
    await sgMail.send(msg);
    console.log('Mensaje enviado');
  } catch (error) {
    console.error('Error al enviar el email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};
