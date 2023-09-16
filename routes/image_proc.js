var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const { PythonShell } = require("python-shell");

router.get("/", (req, res) => {
    const filePath = path.join(__dirname, '/image_processing/squatRight.py');

    const options = {
        mode: 'text',
        pythonPath: '',
        pythonOptions: ['-u'],
        scriptPath: '',
        args: ['arg1', 'arg2'],
    };

    PythonShell.run(filePath, options, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('An error occurred while running Python script.');
        } else {
            console.log('Python script executed successfully.');
            res.send(result);
        }
    });
});

module.exports = router;