const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
var cors = require("cors");

const corsOpts = {
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

const app = express();
const PORT = process.env.PORT || 5000;

const API_KEY = "AIzaSyD3lRkIWZohoZiD5VZrrBE-VzfAzEcTMLA"; // Replace with your API key
const MODEL_NAME = "gemini-1.0-pro";

const DefaultInput = 'done the safety audit as per the BIS 14489, in the plant , so I have observations and may be recommdation, now I want to make a worksheet which consists of the observations, elements (like electrical safety, people safety, human safety, machine safety, safety management system, fire safety, legal compliance, statuary requirement, housekeeping, chemical safety, ) Legal standards ( like NBC, factory rules 1948, good practices, Opportunity for improvement / Indian electricity rules. Indian State Factories rule etc.) Professional lengthy recommendation, risk level (High, medium, low) and risk level (if low - 4 , medium , 3, and high 2), AI I will provide you the observation please provide me the all details which I asked and Please provide professional observations (do not include recommdation in the observation section ) and recommendations (not less 100 word), and legal standard with their section number, element and risk rating please provide data in Only Object Format {observation: "string", element: "string", legalStandard_Name: "string", legalStandard_sectionNumber: "string", professionalRecommendation: "string", riskLevel: "string", riskRating: "string"} with key (camelCase) value pair please remove JSON word and remove ```, ** also or any special character. This is the observation: ';

app.use(express.json());
app.use(cors(corsOpts));

app.post('/chatgpt', async (req, res) => {
    try {
        const { observation, recommendation } = req.body; // Extract observation and recommendation from the request body
        console.log('Received observation:', observation);
        console.log('Received recommendation:', recommendation);

        // Concatenate observation and recommendation
        const inputText = DefaultInput.concat(observation, '. ', recommendation);

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = await genAI.getGenerativeModel({ model: MODEL_NAME });

        const generationConfig = {
            temperature: 1,
            topK: 0,
            topP: 0.95,
            maxOutputTokens: 8192,
        };

        const safetySettings = [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ];

        const chat = model.startChat({ generationConfig, safetySettings, history: [] });

        const result = await chat.sendMessage(inputText);
        console.log("Result", result, typeof(result));

        const response = result.response.text();
        console.log("Response", response, typeof(response));

        // Ensure the response is a valid JSON string before sending it to the client
        res.status(200).json({ response });

    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});