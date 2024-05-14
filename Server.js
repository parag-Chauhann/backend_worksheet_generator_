const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import CORS middleware

const app = express();
const PORT = process.env.PORT || 5000;

// const DefaultInput ="done the safety audit as per the in plant so I have observations which are observed during the site visit now I want to make a worksheet that consists of the observations, elements (like electrical safety, people safety, human safety, machine safety, safety management system, fire safety, legal compliance, statuary requirement, housekeeping, chemical safety, etc. standard like NBC, factory rules 1948, good practices, Opportunity for improvement / Indian electricity rules. Indian state Factories rule etc , Professional and short recommendation, risk level High, medium, low and , Gemini I will provide you the observation please provide me the details which I asked  and Please provide professional observations the same meaning that I have provided and recommendations if possible provide some specific recommendation so that the report looks professional, ,please provided data in Only Object Format (and remove json word and remove ``` also) This is the observation -"

const DefaultInput = "We have done the safety audit as per the in plant, so I have observations which are observed during the site visit., Elements like : - Electrical Safety - People Safety - Human Safety - Machine Safety - Safety Management System - Fire Safety -  Legal Compliance - Statutory Requirement - Housekeeping - Chemical Safety, etc. which is applicable, and Legal Standards like : - NBC - Factory Rules 1948 - Good Practices - Opportunity for Improvement - Indian Electricity Rules - Indian State Factories Rule - Indian state rules Professional and Short Recommendation: Risk Level: - High - Medium - Low so now Please provide professional and very good observations with professional recommendations and propee elemenet and please provided legal standards which is applicable and risk levels associated with each observation for effective risk management. Please provide data in Only Object Format (and remove JSON word and remove ``` also). This is the observation: ";

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Route to handle observation submission
app.post('/chatgpt', async (req, res) => {
    try {
        const {
            GoogleGenerativeAI,
            HarmCategory,
            HarmBlockThreshold,
          } = require("@google/generative-ai");
          
          const MODEL_NAME = "gemini-1.5-pro-latest";
          const API_KEY = "AIzaSyBW0GPTFN1ibqDfA47-fORvTL2DpFoAfY8";
          
        const { observation } = req.body;
        console.log(observation);

        const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
      temperature: 1,
      topK: 0,
      topP: 0.95,
      maxOutputTokens: 8192,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
  
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
      ],
    });
  
    const result = await chat.sendMessage(DefaultInput.concat(observation));
    const response = result.response;

    // console.log(response);
    // console.log(response.text());
    res.status(200);
    res.json({"gpt": response.text()});

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});