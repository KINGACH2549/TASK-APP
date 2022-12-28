
const sgmail = require('@sendgrid/mail')



sgmail.setApiKey(process.env.SENDGRID_API_KEY)

sgmail.send({
    to : 'achintyamanoj.mishra2019@vitstudent.ac.in',
    from : 'achintyammishra2000@gmail.com',
    subject : 'This is my first creation',
    text : 'I hope this one actually get to you.'
})

