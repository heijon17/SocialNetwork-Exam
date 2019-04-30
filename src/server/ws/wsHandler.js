// Inspired by https://github.com/arcuri82/web_development_and_api_design/blob/master/les10/connect4-v2/src/server/ws/ws-handler.js

const express_ws = require('express-ws');
const WebSocket = require('ws');

let ews;

const messages = [];
let counter = 0;

function init(app) {
    ews = express_ws(app);

    app.ws('/', function (ws, req) {
        ws.send(JSON.stringify(messages));
        ws.on('message', fromClient => {
            const dto = JSON.parse(fromClient);
            const id = counter++;
            const msg = { id: id, author: dto.author, text: dto.text };
            messages.push(msg);

            ews.getWss().clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify([msg]));
                }
            })
        })
    })
}

module.exports = { init };