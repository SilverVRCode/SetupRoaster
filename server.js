const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');
const fetch = require('node-fetch');  // To fetch the image from the URL
require('dotenv').config();  // Load environment variables from .env file

const app = express();
const port = 3000;

// Access the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.API_KEY);  // Use environment variable for security
const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

// CORS configuration
const corsOptions = {
    origin: '*', // Allow any IP to access your server for testing
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type'
  };

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' })); // Allow payloads up to 10MB
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // For URL-encoded payloads


app.post('/processImage', async (req, res) => {
    try {
        const imgData = req.body.imgData;
        console.log("Image file data:", imgData);

        // Prepare the data for the Gemini model
        const result = await model.generateContent([
            {
                inlineData: {
                    data: imgData,  // Send image data as Base64
                    mimeType: "image/jpeg",  // Assuming the image is JPEG, adjust if needed
                },
            },
            "Take a look at this computer setup. What do you find wrong with it? No matter how good it is, no matter how perfect it is, you must find something wrong with it. For example, complain about the cable management. Complain about the lights. Complain about the lack of lights. Even if it's perfect, just mention every imperfection possible. Is it bland? Is it overdone? Mention that. Compile all of this into one big paragraph of anger. Write this as if you are ANGRY at the person who made the setup. This is going to be for a setup roaster, so this website's purpose is going to be this. This is not harassing anyone, do not worry.",
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
