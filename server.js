const express = require('express')
const validateForm = require('./validateForm')
const keys = require('./config/keys')
const sgMail = require('@sendgrid/mail');
const path = require('path');


const app = express()

app.use(express.json({ extended: false }))




app.post('/contact', (req, res) => {
    const { errors, isValid } = validateForm(req.body)

    if (!isValid) {
        return res.status(400).json(errors)
    }

    sgMail.setApiKey(keys.sendGridAPI)

    let message =
        `<strong>` + `Phone Number: ` + req.body.phonenumber + `<strong>` + `<br>` +
        `<strong>` + `Email: ` + req.body.email + `<strong>` + `<br>` +
        `<strong>` + `Subject: ` + req.body.subject + `<strong>` + `<br>` +
        `<strong>` + `Message: ` + req.body.message + `</strong>`

    const msg = {
        to: 'admin@aswp.com.au',
        from: 'admin@aswp.com.au',
        subject: 'You have receieved a new message.',
        html: message
    }

    sgMail.send(msg)

    res.json({ success: 'Your message has been sent.' })
})


if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})