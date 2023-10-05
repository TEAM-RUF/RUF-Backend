var express = require('express');
const multer = require('multer');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const { PythonShell } = require("python-shell");
const crypto = require('crypto');

function generateRandomToken() {
    const randomBytes = crypto.randomBytes(10);
    return randomBytes.toString('hex');
}

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", (req, res) => {
    const filePath = path.join(__dirname, '/imageProc/benchRight.py');

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

router.post("/procSingle", upload.single("image"), (req, res) => {
    const imageToken = generateRandomToken();
    const bufferPath = path.join(__dirname, '/imageBuffer/', imageToken + '.jpg');

    let count = req.body.count;
    let stage = req.body.stage;
    const imageBuffer = req.file.buffer

    // console.log(imageToken + '.jpg');

    fs.writeFileSync(bufferPath, imageBuffer);

    const filePath = path.join(__dirname, '/imageProc/benchRightProc.py');
    const options = {
        mode: 'text',
        pythonPath: '',
        pythonOptions: ['-u'],
        scriptPath: '',
        args: [count.toString(), stage, bufferPath]
    };

    const pythonShell = new PythonShell(filePath, options);
    let pythonResponse;
    pythonShell.on('message', (message) => {
        pythonResponse = JSON.parse(message);
    });

    pythonShell.end(async (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('An error occurred while running Python script.');
        } else {
            // console.log('Python script executed successfully.');

            // console.log(pythonResponse);

            resCount = pythonResponse.res_count;
            resStage = pythonResponse.res_stage;
            const processedImageBase64 = pythonResponse.processed_image;

            console.log(resCount + " " + resStage);
            res.json({ resCount, resStage, processedImageBase64 });

            fs.unlinkSync(bufferPath);
        }
    });
});

module.exports = router;