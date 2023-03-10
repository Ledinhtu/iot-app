const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const port = 8881;

const database = require('./config/db/db_config')
const {ref, set, onValue, child, get } = require("firebase/database");

const io = new Server(server); // websocket instane on server

const cookieParser = require('cookie-parser')
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded(
    {extended: true}
));

const name_user = 'matteo';
const password = '2234';
const cookie = {userId: 'test'}

app.get('/', (req, res) => {
    res.redirect('/app');
});

app.post('/login', (req, res) => {

    console.log(req.body.name, req.body.pass);
    if (req.body.name === name_user && req.body.pass === password) {
        res.cookie('userId', cookie.userId);
        res.redirect('/app');
    } else {
        res.sendFile(__dirname + '/login_wrong.html')
    } 

});

app.get('/login', (req, res) => {
    console.log('Cookie: ', req.cookies, req.cookies.userId );

    if (req.cookies.userId === cookie.userId) {
        res.redirect('/app');
        return;
    }
    res.sendFile(__dirname + '/login.html');
});

app.get('/app', (req, res) => {;
    if (req.cookies.userId != cookie.userId) {
        res.redirect('/login');
        return;
    }
    res.sendFile(__dirname + '/app.html');
});

app.post('/app', (req, res) => {
    console.log( req.body.router);
   switch (req.body.router) {
    case 'setting':
        res.redirect('/setting');
        break;

    case 'livingroom':
        res.redirect('/livingroom');
        break;

    case 'bedroom':
        res.redirect('/bedroom');
        break;

    case 'kitchen':
        res.redirect('/kitchen');
        break;
    case 'mainpage':
        res.redirect('/app');
    break;
    default:
        break;
   }

});

app.get('/livingroom', (req, res) => {;
    if (req.cookies.userId != cookie.userId) {
        res.redirect('/login');
        return;
    }
    res.sendFile(__dirname + '/livingroom.html');
});

app.post('/livingroom', (req, res) => {;
    switch (req.body.router) {
        case 'mainpage':
            res.redirect('/app');
            break;
    
        default:
            break;
    }
});

app.get('/setting', (req, res) => {;
    if (req.cookies.userId != cookie.userId) {
        res.redirect('/login');
        return;
    }
    res.sendFile(__dirname + '/settingmode.html');
    // res.send('<h1>SETTING MODE</h1>')
});

app.post('/setting', (req, res) => {;
    switch (req.body.router) {
        case 'mainpage':
            res.redirect('/app');
            break;
    
        default:
            break;
    }
});

app.get('/bedroom', (req, res) => {;
    if (req.cookies.userId != cookie.userId) {
        res.redirect('/login');
        return;
    }
    res.sendFile(__dirname + '/bedroom.html');
    // res.send('<h1>BEDROOM</h1>')

});

app.post('/bedroom', (req, res) => {;
    switch (req.body.router) {
        case 'mainpage':
            res.redirect('/app');
            break;
    
        default:
            break;
    }
});

app.get('/kitchen', (req, res) => {;
    if (req.cookies.userId != cookie.userId) {
        res.redirect('/login');
        return;
    }
    res.sendFile(__dirname + '/kitchen.html');
    // res.send('<h1>KITCHEN</h1>')

});

app.post('/kitchen', (req, res) => {;
    switch (req.body.router) {
        case 'mainpage':
            res.redirect('/app');
            break;
    
        default:
            break;
    }
});

// x??? l?? khi c?? connect t???i server socket
io.on('connection', (socket) => {
    console.log('user connected');

    // b???t s??? thay ?????i c???a nhi???t ????? tr??n firebase
    onValue(ref(database, 'livingroom/sensordht11/temp/now'), (snapshot) => {
        const data = snapshot.val();
        if (data) {
            console.log(data.temp);
            // emit gi?? tr??? nhi???t ?????
            io.emit('temp-1', data.temp);      
        } else {
            console.log("(onValue) No data available");
        }
    });

    // b???t s??? thay ?????i c???a  ????? ???m tr??n firebase
    onValue(ref(database, 'livingroom/sensordht11/humi/now'), (snapshot) => {
        const data = snapshot.val();
        if (data) {
            console.log(data.humi);
            io.emit('humi-1', data.humi);      
        } else {
            console.log("(onValue) No data available");
        }
    });

    // b???t s??? thay ?????i c???a tr???ng th??i ????n ph??ng kh??ch tr??n firebase
    onValue(ref(database, '/livingroom/lamp1/now/'), (snapshot) => {
        const data = snapshot.val();
        if (data) {
            console.log(data.state);
            io.emit('light-1', data.state);      
        } else {
            console.log("(onValue) No data available");
        }
    });

    // b???t s??? thay ?????i c???a tr???ng th??i ????n ph??ng ng??? tr??n firebase
    onValue(ref(database, '/bedroom/lamp1/now'), (snapshot) => {
        const data = snapshot.val();
        if (data) {
            console.log(data.state);
            io.emit('bedroom-lamp1', data.state);      
        } else {        
            console.log("(onValue) No data available");
        }
    });

    // b???t s??? thay ?????i c???a tr???ng th??i ????n ph??ng b???p tr??n firebase
    onValue(ref(database, '/kitchen/lamp1/now'), (snapshot) => {
        const data = snapshot.val();
        if (data) {
            console.log(data.state);
            io.emit('kitchen-lamp1', data.state);      
        } else {
            console.log("(onValue) No data available");
        }
    });

    socket.on('livingroom-btn-lamp1', data => {
        set(ref(database, 'control/livingroom/lamp1'), {
            signal: 'rst'
          })
          .then(()=>{})
          .catch((e)=>console.log(`(E): ${e}`));
        console.log(data.message);
        set(ref(database, 'control/livingroom/lamp1'), {
            signal: data.message
          })
          .then(()=>{
            // res.status(200).send(JSON.stringify(req.body));
          })
          .catch((e)=>console.log(`(E): ${e}`))
    });

    socket.on('bedroom-btn-lamp1', data => {
        set(ref(database, 'control/bedroom/lamp1'), {
            signal: 'rst'
          })
          .then(()=>{})
          .catch((e)=>console.log(`(E): ${e}`));
        set(ref(database, 'control/bedroom/lamp1'), {
            signal: data.message
          })
          .then(()=>{
            // res.status(200).send(JSON.stringify(req.body));
          })
          .catch((e)=>console.log(`(E): ${e}`))
    });

    socket.on('kitchen-btn-lamp1', data => {
        set(ref(database, 'control/kitchen/lamp1'), {
            signal: 'rst'
          })
          .then(()=>{})
          .catch((e)=>console.log(`(E): ${e}`));
    
        set(ref(database, 'control/kitchen/lamp1'), {
            signal: data.message
          })
          .then(()=>{
            // res.status(200).send(JSON.stringify(req.body));
          })
          .catch((e)=>console.log(`(E): ${e}`))
    });
    
});

// kh???i tao server l???ng nghe t???i c???ng `port`
server.listen(port, () => {
    console.log(`App listening on port ${port}`);
});




