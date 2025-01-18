const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('google-generative-ai');  // Import the GoogleGenerativeAI class
const fetch = require('node-fetch');
require('dotenv').config();  // Import the dotenv package to read environment variables

const app = express();
const port = 3000;

// Access the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.API_KEY);  // Use environment variable for security
const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/processImage', async (req, res) => {
    try {
        const imgUrl = req.body.imgUrl;
        console.log("Picture URL:", imgUrl);

        if (!imgUrl.startsWith('http://') && !imgUrl.startsWith('https://')) {
            return res.status(400).send('Invalid URL');
        }

        const imageResp = await fetch(imgUrl);
        if (!imageResp.ok) {
            throw new Error("Failed to fetch image from URL");
        }

        const imageBuffer = await imageResp.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString("base64");

        // Prepare the data for the Gemini model
        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64Image,  // Send image data as Base64
                    mimeType: "image/jpeg",  // Assuming the image is JPEG, adjust if necessary
                },
            },
            'Caption this image.',
        ]);

        res.send(result);
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
