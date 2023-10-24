const express =  require('express');
const {GetLocation} = require('../controllers/LocationController');
const router = express.Router();

router.get('/', GetLocation);

module.exports = router
