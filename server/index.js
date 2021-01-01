const express = require('express')
const http = require('http')
const path = require('path')
const serialcomm = require('serialport')

const app = express();
app.set('PORT', 9000)
const server = http.createServer(app)

app.use(express.static(path.join(__dirname, '../client/')))

server.listen(app.get('PORT'), ()=>{
    console.log("servidor trabajando en el puerto", app.get('PORT'))
})

//comunicacion socket
const io = require('socket.io')(server)

//comunicacion serial

const parser = new serialcomm(
    'COM4',
    {baudRate: 9600}
).pipe(new serialcomm.parsers.Readline({delimiter: '\n'}))

parser.on('data', (datos)=>{
    if(datos.includes('ypr')){
        console.log(datos)
        io.emit('datos-giro', datos)
    }
})


