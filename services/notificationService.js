const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // directly pass the credentials to make it work
    pass: process.env.EMAIL_PASS // directly pass the credentials to make it work
  }
});

// SEnd notification through gmail
const sendEmail = (subject, text) => {
  const mailOptions = {
    from: {
      name: 'Debankan Mitra',
      address: process.env.EMAIL_USER
    },
    to: ['debankanmitra@gmail.com'],
    subject: subject,
    text: text,
    html: text
  };
  console.log(mailOptions);
  console.log('Email User:', process.env.EMAIL_USER);
  console.log('Email Pass:', process.env.EMAIL_PASS);

  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = {
  sendEmail
};
