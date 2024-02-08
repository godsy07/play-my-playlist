const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const nodemailerSendgrid = require("nodemailer-sendgrid");

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.SENDGRID_API_KEY,
  }),
);

const handlebarOptions = {
  viewEngine: {
    extName: ".handlebars",
    partialsDir: path.resolve("./utils/views"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./utils/views"),
  extName: ".handlebars",
};
transport.use("compile", hbs(handlebarOptions));

// const sendWelcomeEmail = async (user, email) => {
//   try {
//     let name = user.split(" ")[0];
//     let subject = `Welcome to Blind Weight® Platform`;

//     const mailOptions = {
//       to: email,
//       from: `Blind Weight® <${process.env.AUTH_EMAIL}>`,
//       replyTo: "support@blindweight.com",
//       subject: subject,
//       template: "sendWelcomeMail",
//       context: {
//         name: name,
//         title: "Thank you for choosing Us!",
//         mailto: `mailto:${{ email }}`,
//         email: email,
//       },
//     };

//     const mail = await transport.sendMail(mailOptions);

//     return { mail };
//   } catch (error) {
//     const errorHeading = `Error while sending welcome mail to User`;
//     const errorDetails = JSON.stringify(error, null, 4);
//     await logAndReportToSlackAPI("error", errorHeading, errorDetails, {
//       email,
//     });
//     return { error };
//   }
// };

const sendMail = async (to_email, subject, mail_body) => {
  try {
    const msg = {
      to: to_email,
      from: `Godson <${process.env.AUTH_EMAIL}>`,
      replyTo: process.env.AUTH_REPLY_EMAIL,
      subject: subject,
      html: mail_body,
    };

    const mail = await transport.sendMail(msg);

    return { mail };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

module.exports = {
  sendMail,
};
