module.exports = function (io) {
  var amqp = require('amqplib/callback_api')
  var local_data = JSON.stringify(require('./utilities/data-min'))
  var net = require('net')
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

  var client = new net.Socket()

  var processedData
  var defaultRoom = 'general'


  //IP AND PORT FOR POD TCP
  var PORT = "1337"
  var HOST = "192.168.0.223"
  var HOST_RABBIT = "localhost"
  var PORT_RABBIT = "5672"
  var USER_RABBIT = "hyper"
  var PASS_RABBIT = "hyperpass"

  /**
   * Connect to websocket on frontend
   * @description - important to connect in order to receive ip address for base station
   *                if debug mode activated send test json as data
   */
  io.on('connection', function (socket) {
    try {
      socket.join(defaultRoom)
      console.log("joined room")
      //socket.emit('data', local_data)
    } catch (e) {
      console.log(e.message)
    }

      try {
        amqp.connect('amqp://' + USER_RABBIT + ':' + PASS_RABBIT + '@' + HOST_RABBIT + ':' + PORT_RABBIT, function (err, conn) {
          
        try {
        conn.createChannel(function (err, ch) {
            var q = 'data'
            ch.purgeQueue(q)
            ch.assertQueue(q, { durable: true })

            console.log('Connected to aamqp://' + USER_RABBIT + ':' + PASS_RABBIT + '@' + HOST_RABBIT + ':' + PORT_RABBIT)
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);

            ch.consume(q, function (msg) {
              processedData = msg.content.toString()
              io.to(defaultRoom).emit('data', processedData)
            }, { noAck: true })
          });
        } catch (error) {
          console.log("Can't create Channel data on rabbit/socket.on")
        }
        /***************************************************************/
        try {
          conn.createChannel(function (err, ch) {
              var q2 = 'alive'
              ch.purgeQueue(q2)
              ch.assertQueue(q2, { durable: true })

              console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q2)
  
              ch.consume(q2, function (msg) {                
              var processedData2 = msg.content.toString()              
                io.to(defaultRoom).emit('alive', processedData2)
              }, { noAck: true })
            });
          } catch (error) {
            console.log("Can't create Channel alive on rabbit/socket.on")
          }
          /*****************************************************************/
        });
      } catch (error) {
        console.log('Can\'t connect to Rabbit stream on the following address: amqp://' + USER_RABBIT + ':' + PASS_RABBIT + '@' + data + ':' + PORT_RABBIT)
      }

    /**
     * On action from GUI send to POD
     */
    socket.on('sendToPod', function (action,payload) {
      try{
        client = net.connect(PORT, HOST)
        console.log('Client Socket TCP Connected')
        var m = new Object()
        m.a=action
        m.p=payload
        m = JSON.stringify(m)
        console.log("TO POD: \n" + m)
        client.write(m)
        console.log('Enviado')
        client.end()

      }catch(error){
        console.log(error)
      }
    })

    /*socket.on('sendToMiddleware', function (m) {
      var notSend = true
      while(notSend){
        try{
        client = net.connect(PORT, HOST)
        console.log('Client Socket TCP Connected')

        var m = '1;'+m
        m = m.replace(/\s+/g, '')
        console.log("TO MIDDLEWARE: \n" + m)
        client.write(m)
        console.log('Enviado')
        client.end()
        notSend = false
        }catch(error){
          console.log(error)
          notSend = true
        }
      }
    })*/

    socket.on('debug',(mode)=>{
        if(mode){
          debugInterval = setInterval(()=>{
            socket.emit('data', local_data)
          },50)
          console.log('DEBUG ACTIVADO')
        }else{
          try{
            clearInterval(debugInterval)
            console.log('DEBUG DESACTIVADO')
          }catch(error){
            console.log(error)
          }
        }
    })

  socket.on('simulation', () => {     
    
    var rawFile = new XMLHttpRequest();
    var file =  'file:C:/repos/middleware_deployable/container-data/logs/data/data.log'
    rawFile.open("GET", file, false)
    var allText = ''
    rawFile.onreadystatechange = function ()
    {
      allText = rawFile.responseText;
      console.log(allText);
    }
    rawFile.send(null);

    index = 0

    var intervalSimulation = setInterval(() => {

      while(allText[index] != '{'){
        index++
      }

      indexStart=index

      while(allText[index] != '\n'){
        index++
      }

      trama = allText.substring(indexStart,index)

      io.to(defaultRoom).emit('data', trama)

      if(index > allText.length - 10){
        clearInterval(intervalSimulation)
      }

    },50)

  })
  


})

}