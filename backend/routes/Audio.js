const express =  require('express');
const {GetAudio} = require('../controllers/AudioController');
const router = express.Router();

router.get('/', GetAudio);

module.exports = router
