const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');

const url = require('url');


const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

const port = 8000;

app.post('/add',(req,res) =>{
    const { roomId, playerName }  = req.body;
    let roomsData ={}; 
  try {
     roomsData = JSON.parse(fs.readFileSync('./rooms.json', 'utf8'));
  } catch (error) {
    console.error('Error reading x.json file:', error);
  }

  if (roomsData[roomId]) {
    roomsData[roomId].push(playerName);
  } else {
    roomsData[roomId] = [playerName];
  }

  
  fs.writeFile('rooms.json', JSON.stringify(roomsData), (err) => {
    if (err) {
      console.error('Error writing data to x.json file:', err);
      res.status(500).send('Error writing data to x.json file');
    } else {
      console.log('Data successfully written to x.json file');
      res.json({});
    }
  });
});


app.post('/getNames',(req,res) =>{
    // u will get room id
    const { roomId, playerName }  = req.body;
    let roomsData ={}; 
    try {
       roomsData = JSON.parse(fs.readFileSync('./rooms.json', 'utf8'));
    } catch (error) {
      console.error('Error reading x.json file:', error);
    }

    if(roomsData[roomId]){
        res.json(roomsData[roomId]);
    }
});


app.post('/getHost',(req,res) =>{
    // u will get room id
    const { roomId, playerName }  = req.body;
    let roomsData ={}; 
    try {
       roomsData = JSON.parse(fs.readFileSync('./rooms.json', 'utf8'));
    } catch (error) {
      console.error('Error reading x.json file:', error);
    }

    if(roomsData[roomId]){
        res.json(roomsData[roomId][0]);
    }
});


// if host clicks on start game 

app.post('/getStatus',(req,res) =>{
  // u will get room id
  const { roomId, playerName }  = req.body;
  let roomsData ={}; 
  try {
     roomsData = JSON.parse(fs.readFileSync('./started.json', 'utf8'));
  } catch (error) {
    console.error('Error reading x.json file:', error);
  }

  if(roomsData[roomId]){
    let start=true;
  res.json({ start });
  }else{
    let start=false;
    res.json({start});
  }
});


app.post('/exists',(req,res) =>{
  // u will get room id
  const { roomId, playerName }  = req.body;
  let roomsData ={}; 
  try {
     roomsData = JSON.parse(fs.readFileSync('./rooms.json', 'utf8'));
  } catch (error) {
    console.error('Error reading x.json file:', error);
  }
  // console.log(roomId+" "+playerName);
  if (roomsData[roomId]) {
    // Check if the playerName exists in the roomId array
    if (roomsData[roomId].includes(playerName)) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } else {
    return res.json({ exists: false });
  }
});


app.post('/addStart',(req,res) =>{
  // u will get room id
  const { roomId, playerName }  = req.body;
  let roomsData ={}; 
  try {
     roomsData = JSON.parse(fs.readFileSync('./started.json', 'utf8'));
  } catch (error) {
    console.error('Error reading x.json file:', error);
  }

  
  if (roomsData[roomId]) {
    roomsData[roomId] = (playerName);
  } else {
    roomsData[roomId] = [playerName];
  }

  
  fs.writeFile('started.json', JSON.stringify(roomsData), (err) => {
    if (err) {
      console.error('Error writing data to x.json file:', err);
      res.status(500).send('Error writing data to x.json file');
    } else {
      console.log('Data successfully written to x.json file');
      res.json({});
    }
  });
});

roomss = {};

wss.on('connection', (ws,req) => {
  // we willl get code with each message
  const parameters = url.parse(req.url, true);
  const code = parameters.query.code;
  if(roomss[code])
  roomss[code].push(ws);
  else roomss[code] = [ws];
  ws.on('message', (message) =>{
    console.log(code);
    const drawingData = JSON.parse(message);
    // console.log(drawingData);
    for(let i=0;i<roomss[code].length;++i) if(roomss[code][i] !== ws) roomss[code][i].send(JSON.stringify(drawingData));
  })
});



server.listen(port, ()=>{
    console.log('listening');
})
