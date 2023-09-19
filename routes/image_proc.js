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

app.post("/upload", upload.single("image"), (req, res) => {
    const imageBuffer = req.file.buffer
    let count = req.body.count;

    const filePath = path.join(__dirname, '/image_processing/benchRightProc.py');
    const options = {
        mode: 'text',
        pythonPath: '',
        pythonOptions: ['-u'],
        scriptPath: '',
        args: [imageBuffer.toString("base64"), count.toString()]
    };

    PythonShell.run(filePath, options, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('An error occurred while running Python script.');
        } else {
            console.log('Python script executed successfully.');
            const pythonResponse = JSON.parse(result);

            resCount = pythonResponse.res_count;

            const processedImageBase64 = pythonResponse.processed_image;

            res.json({ resCount, processedImageBase64 });
        }
    });
});

module.exports = router;