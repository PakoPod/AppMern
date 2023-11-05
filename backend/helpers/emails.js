// 4 correos uno para confirmar / recuperar contraseña / añadido al proyecto / eliminado del proyecto
import nodemailer from "nodemailer";

export const emailRegistro = async (datos) => {
  // console.log("Datos usuario:", datos);
  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  // Esto es para configurar el cliente para  enviar el email y
  // despues se tiene acceso a la variable
  // y el metodo que existe
  const info = await transport.sendMail({
    from: '"Administrador de proyectos" <cuentas@uptask.com>',
    to: email,
    subject: "Administrador de proyectos - Confirma tu cuenta",
    text: "Comprueba tu cuenta en Administrador de proyectos",
    html: `<p> Hola: ${nombre} Comprueba tu cuenta ahora</p>
        <p> Tu cuenta esta ya casi lista, debes solo comprobarla con el siguiente enlace:
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
        <p> Si tu no creaste la cuenta, puedes ignorar el mensaje </p>
        `,
  });
};

export const emailOlvidePassword = async (datos) => {
  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  // Esto es para configurar el cliente para  enviar el email y
  // despues se tiene acceso a la variable
  // y el metodo que existe
  const info = await transport.sendMail({
    from: '"Administrador de proyectos" <cuentas@uptask.com>',
    to: email,
    subject: "Administrador de proyectos - Reestablece tu Password",
    text: "Comprueba tu cuenta en Administrador de proyectos",
    html: `<p> Hola: ${nombre} has solicitado reestablecer tu password</p>
        <p> Sigue el siguiente enlace para generar un nuevo password:

        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>
        <p> Si tu no solicitaste este email, puedes ignorar el mensaje </p>
        `,
  });
};
