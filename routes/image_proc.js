var express = require('express');
const multer = require('multer');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const { PythonShell } = require("python-shell");
const crypto = require('crypto');

function generateRandomToken() {
    const randomBytes = crypto.randomBytes(32);
    return randomBytes.toString('hex');
}

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", (req, res) => {
    const filePath = path.join(__dirname, '/imageProc/squatRight.py');

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

router.post("/upload", upload.single("image"), (req, res) => {
    const imageToken = generateRandomToken();
    const bufferPath = path.join(__dirname, '/imageBuffer/', imageToken, '.jpg');

    let count = req.body.count;
    const imageBuffer = req.file.buffer

    fs.writeFileSync(bufferPath, imageBuffer);

    console.log(bufferPath);
    console.log(count);

    const filePath = path.join(__dirname, '/imageProc/benchRightProc.py');
    const options = {
        mode: 'text',
        pythonPath: '',
        pythonOptions: ['-u'],
        scriptPath: '',
        args: [bufferPath, count.toString()]
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
        fs.unlinkSync(imageFilePath);
    });
});

module.exports = router;