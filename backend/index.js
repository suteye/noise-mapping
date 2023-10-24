const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const location = require('./routes/Location');
const audio = require('./routes/Audio');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//routes
app.use("/api/v1/location", location)
app.use("/api/v1/audio", audio)

app.listen(8080,()=>{ console.log(`Server is running on http://localhost:8080`)});