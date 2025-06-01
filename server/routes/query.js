const express = require('express');
const router = express.Router();
const { askQuestion } = require('../controller/querycontroller');

router.post('/ask', askQuestion);

module.exports = router;
