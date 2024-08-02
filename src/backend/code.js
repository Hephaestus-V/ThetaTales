const axios = require('axios');
const fs = require('fs');
const path = require('path');

const downloadImage = async (imageUrl, outputPath) => {
    try {
        const response = await axios({
            url: imageUrl,
            method: 'GET',
            responseType: 'stream',
        });

        // Ensure the directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const writer = fs.createWriteStream(outputPath);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Error downloading the image: ${error.message}`);
        throw error;
    }
};

const imageUrl = process.argv[2];
const outputPath = process.argv[3] || 'img.png';

if (!imageUrl) {
    console.error('Please provide an image URL as the first argument.');
    process.exit(1);
}

downloadImage(imageUrl, outputPath)
    .then(() => console.log(`Image downloaded to ${outputPath}`))
    .catch((error) => console.error(`Error: ${error.message}`));
