var express = require('express');
var router = express.Router();

router.get('/generate', (req, res) => {
    // Load the model
    const model = require('./JSModels/testModel');

    // Generate a string
    const string = model.predict(tf.oneHot('Hello, world!'.split(''), 8));

    // Send the string to the client
    res.send(string);
});

module.exports = router;