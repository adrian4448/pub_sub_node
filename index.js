const express = require('express');
const app = express();

app.use(express.json())

function escutarEventosPull() {
    const { PubSub } = require('@google-cloud/pubsub');
    const pubSubClient = new PubSub();

    const subscription = pubSubClient.subscription('projects/planar-root-338415/subscriptions/teste-adrian-sub');

    // callback com as mensagens disponiveis na fila
    subscription.on('eventos', message => {
        console.log('recebi a mensagem de id:', message.id)
        console.log('conteudo da mensagem', message.data.toString())

        //Esse cara remove a mensagem da fila
        message.ack()
    });
}

app.post('/publicar-evento', async (req, res) => {
    const { PubSub } = require('@google-cloud/pubsub');
    const pubSubClient = new PubSub();

    const dataBuffer = Buffer.from(JSON.stringify(req.body));
    try {
        const messageId = await pubSubClient
            .topic('projects/planar-root-338415/topics/teste-adrian')
            .publish(dataBuffer);
        console.log(`Message ${messageId} published.`);
    } catch (error) {
        console.error(`Received error while publishing: ${error.message}`);
        process.exitCode = 1;
    }

    res.send('deu boa')
})

app.listen(3000, () => {
    console.log('Agora estou escutando os eventos')    

    escutarEventosPull()
})