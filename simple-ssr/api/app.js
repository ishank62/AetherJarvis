// jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')
const {Configuration, OpenAIApi} = require("openai");
require("dotenv").config();
const axios =  require('axios');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
const port =3001

app.use(cors());
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post('/get-prompt-result', async (req, res) => {
  // Get the prompt from the request body
  const {prompt, model = 'gpt'} = req.body;

  // Check if prompt is present in the request
  if (!prompt) {
      // Send a 400 status code and a message indicating that the prompt is missing
      return res.status(400).send({error: 'Prompt is missing in the request'});
  }

  try {
      // Use the OpenAI SDK to create a completion
      // with the given prompt, model and maximum tokens
      if (model === 'image') {
        const result = await openai.createImage({
            prompt,
            response_format: 'url',
            size: '512x512'
        });
        return res.send(result.data.data[0].url);
      }
      else if(model === 'gpt'){
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo", // model name
            messages: [{
                role: 'system',
                content: 'You are a helpful assistant.',
              },
              {
                role: 'user',
                content: prompt
              }],
            max_tokens: 4000
          });
        return res.send(completion.data.choices[0].message.content);
      }
      else {
        const completion = await openai.createCompletion({
            model: "text-davinci-003", // model name
            prompt: `Please reply below question in markdown format.\n ${prompt}`, // input prompt
            max_tokens: 4000 // Use max 8000 tokens for codex model
        });
        // Send the generated text as the response
        return res.send(completion.data.choices[0].text);
      }
  } catch (error) {
      const errorMsg = error.response ? error.response.data.error : `${error}`;
      console.error(errorMsg);
      // Send a 500 status code and the error message as the response
      return res.status(500).send(errorMsg);
  }
});

app.listen(port, () => console.log(`Backend listening on port ${port}!`))

module.exports = app