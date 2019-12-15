const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SEND_GRID_API_KEY)

const sendEmail = async (to, from, subject, text, html) => {
    try{
        let response = await sgMail.send({
            to: to,
            from: from,
            subject: subject,
            text: text,
            html: html,
        })
        return response
    }catch(e){
        return 'Somthing went wrong'
    }   
}

module.exports = sendEmail
