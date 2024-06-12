const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');



const app = express();
app.use(cors());
app.use(bodyParser.json());

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

app.listen(port, ()=>{
    console.log('listening');
})
