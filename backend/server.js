const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const configuration = new Configuration({
  apiKey: process.env.GEMINI_API_KEY
});
const openai = new OpenAIApi(configuration);

app.post('/processImage', async (req, res) => {
  try {
    const imageData = req.body.imageData; 

    // Prepare the prompt for the Gemini API
    const prompt = `Analyze the following image and provide a concise description: ${imageData}`; 

    const response = await openai.createImage({
      prompt: prompt,
      n: 1, // Number of images to generate
      size: "256x256", // Size of the generated image
    });

    const imageDescription = response.data.data[0].text;

    res.send(`<p>${imageDescription}</p>`); 
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).send("Error processing image.");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});