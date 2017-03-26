var http = require('http');
var express = require('express');
var azure = require('azure');
var app = express();

// view engine setup
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');


// static file setting
app.use(express.static('public'));

//route setup
var index = require('./routes/index');
app.use('/', index);

//port setup
var port = process.env.PORT || 3000;


var server = http.createServer(app);
server.listen(port);

var hubName = "nodeazurechatnotihub";
var connectionString = "Endpoint=sb://nodeazurechatnamespace.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=tHRyBxEvd6IydZzy5yyE37S8kvUlMft4FuG/OwfA9Tc=";
var notificationHubService = azure.createNotificationHubService(hubName,connectionString);

var io = require('socket.io').listen(server);
io.sockets.on('connection',function(socket){   // on 함수는 이벤트 들어오는것을 기다림
    socket.emit('toclient',{msg:'Welcome !'});

    // azure - noti hub
    notificationHubService.gcm.send(null /*group - azure 포탈에서 설정*/, {data:{id:socket.id, message:'Welcome'}}, function(error){
        if(!error){
            console.log('send');
        }
    });

    // socket.on('fromclient',function(data){
    //     socket.broadcast.emit('toclient',data); // 자신을 제외하고 다른 클라이언트에게 보냄
    //     socket.emit('toclient',data); // 해당 클라이언트에게만 보냄. 다른 클라이언트에 보낼려면?
    //     console.log('Message from client :'+data.msg);
    // });
    
    socket.on('fromclient',function(data){
        socket.broadcast.emit('toclient',data); 
        socket.emit('toclient',data);
        console.log('Message from client :'+data.msg);
       
        if(data.msg!=""){
            notificationHubService.gcm.send(null, {data:{id:socket.id, message:data.msg}}, function(error){
                if(!error){
                    //notification sent
                        console.log('send');
                }
            });
        }
    });
});