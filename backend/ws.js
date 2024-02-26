const { json } = require('express');
const WebSocket = require('ws');
const Tables = require('./Tables');

const wsconnect = ()=>{
    const server = new WebSocket.Server({ port: 3000 });
    const tableClients = {}
    server.on('connection', ws => {
        ws.on('message', async message => {

            if(JSON.parse(message).action == 'clear' ){ 
                let id = JSON.parse(message).id

                const newtable = await Tables.findByIdAndUpdate(id,{
                    eraser:[],
                    texts:[],
                    line:[],
                    squares:[]
                })            
                server.clients.forEach(client=>{
                    client.send("clear")
                })


            }else if(JSON.parse(message).action == 'add'){
                const req = JSON.parse(message)
                console.log(req);
                const table = await Tables.findById(req.id)

                console.log(table);

                const newtable = await Tables.findByIdAndUpdate(req.id,{
                eraser:req.color == 'white'?[...table.eraser, [...req.data.line]]:[...table.eraser],
                line: req.color!= 'white'?[...table.line , [...req.data.line]]:[...table.line],
                squares:table.squares, 
                texts:table.texts})

                

                server.clients.forEach(client=>{
                    client.send(JSON.stringify({...req.data ,line:[req.data.line],color:req.color}))
                })
            }

        });
    });
}
module.exports = wsconnect