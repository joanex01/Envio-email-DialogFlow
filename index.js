const express = require('express')
//const bodyParser = require('body-parser')
const { request } = require('express')
const {WebhookClient} = require('dialogflow-fulfillment');
const buscaCep = require('busca-cep')

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
    var soma = request.body.queryResult.parameters['number'] + request.body.queryResult.parameters['number1']
    var CEP = request.body.queryResult.parameters['zip-code']
    function BCEP(agent){
        buscaCep(CEP, { sync: false, timeout: 1000 }).then(endereco => {
        var local = endereco.logradouro +" - "+ endereco.bairro +"\n"+ endereco.localidade +" - "+ endereco.uf +"\n"+ endereco.cep;
        agent.add("Ok, seu CEP está confirmado:" + "\n" + local)
        })
    }
    //function Soma(agent){
    //    agent.add("O resultado é: "+ soma)
    //}
    let intentMap = new Map()
    //intentMap.set("Soma", Soma)
    intentMap.set("user.cep",BCEP)
    agent.handleRequest(intentMap)
}