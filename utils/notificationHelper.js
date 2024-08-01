const nodemailer = require('nodemailer');

// Example function to send notifications
const sendNotification = (task, notificationTime) => {
    // Setup email transport using nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'user@example.com', // Replace with the user's email address
        subject: 'Task Notification',
        text: `Reminder: The task "${task.title}" is due soon.`
    };

    // Schedule email to be sent at notificationTime
    setTimeout(() => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending notification:', error);
            } else {
                console.log('Notification sent:', info.response);
            }
        });
    }, notificationTime - Date.now());
};

module.exports = {
    sendNotification
};
