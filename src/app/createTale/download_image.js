const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:1234' // Replace with your frontend's origin
}));

const downloadImageSync = (imageUrl, outputPath) => {
    const file = fs.createWriteStream(outputPath);
    const dir = path.dirname(outputPath);

    // Ensure the directory exists
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const download = () => {
        const req = https.get(imageUrl, (res) => {
            if (res.statusCode !== 200) {
                throw new Error(`Failed to download image: ${res.statusCode}`);
            }

            res.pipe(file);
            file.on('finish', () => {
                file.close();
            });
        });

        req.on('error', (err) => {
            fs.unlinkSync(outputPath);
            throw new Error(`Error downloading the image: ${err.message}`);
        });
    };

    // Perform the synchronous download
    download();
};

app.post('/api/download-image', (req, res) => {
    const { imageUrl, outputPath = path.join(__dirname, '../../public/downloaded_image.png') } = req.body;
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (!imageUrl) {
        return res.status(400).json({ error: 'Please provide an image URL.' });
    }

    try {
        downloadImageSync(imageUrl, outputPath);
        res.json({ message: `Image downloaded to ${outputPath}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
