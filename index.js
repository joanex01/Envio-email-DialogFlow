const express = require('express')
//const bodyParser = require('body-parser')
const { request } = require('express')
const {WebhookClient} = require('dialogflow-fulfillment');
const sendmail = require('sendmail');
const nodemailer = require('nodemailer');

const app = express()
//app.use(bodyParser.json())
const port = process.env.PORT || 3000
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.post('/dialogflow-fullfillment', (request, response)=>{
    dialogflowFullfillment(request, response)
})

app.listen(port,() =>{
    console.log(`Listening on port ${port}`)
})

const dialogflowFullfillment =(request, response) => {
    const agent = new WebhookClient({request, response})
    function envio_email(agent){
        var nodemailer = require('nodemailer');
        var sendmail = require('sendmail');
        var transporter = nodemailer.createTransport({
            /*sendmail: true,
            newline: 'unix',
            path: '/usr/sbin/sendmail',*/
            service: 'Outlook', //servidor a ser usado
            auth: {
                user: "dorinhateste123@gmail.com", // dizer qual o usuário
                pass: "Aqua1313" // senha da conta
            }
        });

        var email = {
            from:"dorinhateste123@gmail.com", // Quem enviou este e-mail
            to: request.body.queryResult.parameters['email'], // Quem receberá
            subject: request.body.queryResult.parameters['assunto'], // Um assunto
            html: request.body.queryResult.parameters['mensagem'] // O conteúdo do e-mail
        };
        transporter.sendMail(email,function(error, info){ 
                //console.log(info.envelope);
                //console.log(info.messageId);
                if(error){
                    console.log (error);
                    throw error; // algo de errado aconteceu.
                }
                agent.add('Email enviado! Leia as informações adicionais: '+ info);
        });
    }
    
    let intentMap = new Map();
    intentMap.set("envio_email", envio_email)
    agent.handleRequest(intentMap)
}
