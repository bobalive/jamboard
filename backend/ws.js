const { json } = require('express');
const WebSocket = require('ws');
const Tables = require('./Tables');

const wsconnect = ()=>{
    const server = new WebSocket.Server({ port: 3000 });
    const tableClients = {}
    server.on('connection', ws => {
        ws.on('message', async message => {
            const clientId =  Math.random().toString(36).substring(7);
            const tableId = JSON.parse(message)

            if(typeof JSON.parse(message) == 'string' ){               
                tableClients[tableId] = tableClients[tableId]?[...tableClients[tableId], {clientId,ws}]:[{clientId, ws}] 
                const table = await Tables.findById(tableId)

                ws.send(JSON.stringify(table))


            }else if(typeof JSON.parse(message) === 'object'){
                const req = JSON.parse(message)         
                const table = await Tables.findByIdAndUpdate(req.id,req.data)
                console.log(req.data);
                server.clients.forEach(client=>{
                    client.send(JSON.stringify({...req.data ,color:req.color}))
                })
                
                    
               
            
            }

        });
    });
}
module.exports = wsconnect