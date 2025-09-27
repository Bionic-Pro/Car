const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

// GPT4All API configuration
const GPT4ALL_API_URL = 'http://localhost:4891/v1';
const MODEL_NAME = 'nous-hermes-2-mistral-dpo.Q4_0.gguf';

const responseCache = new Map();

// Function to generate a response using GPT4All
async function generateResponse(prompt) {
    try {
        console.log('Sending request to GPT4All API...');
        console.log('API URL:', `${GPT4ALL_API_URL}/completions`);
        console.log('Model:', MODEL_NAME);
        
        const requestBody = {
            model: MODEL_NAME,
            prompt: prompt,
            max_tokens: 500,
            temperature: 0.7,
            stream: false
        };
        
        console.log('Request body:', JSON.stringify(requestBody, null, 2));
        
        const response = await fetch(`${GPT4ALL_API_URL}/completions`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        console.log('Response status:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}\n${errorText}`);
        }

        const data = await response.json();
        console.log('API Response:', JSON.stringify(data, null, 2));
        
        if (!data.choices || !data.choices[0] || !data.choices[0].text) {
            throw new Error('Invalid response format from GPT4All API');
        }
        
        return data.choices[0].text.trim();
    } catch (error) {
        console.error('Error in generateResponse:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            name: error.name
        });
        throw new Error(`Failed to generate response from AI model: ${error.message}`);
    }
}

// API endpoint for getting car recommendations
app.post('/api/recommend', async (req, res) => {
    try {
        const { userPreferences } = req.body;
        
        if (!userPreferences) {
            return res.status(400).json({
                success: false,
                error: 'Missing user preferences'
            });
        }

        // Create a cache key based on user preferences
        const cacheKey = JSON.stringify(userPreferences);
        
        // Check cache first
        if (responseCache.has(cacheKey)) {
            return res.json({
                success: true,
                fromCache: true,
                ...responseCache.get(cacheKey)
            });
        }

        // Create a prompt based on user preferences
        const prompt = `Based on these preferences, recommend a car:
        - Budget: ${userPreferences.budget || 'Not specified'}
        - Body Style: ${userPreferences.bodyStyle || 'Not specified'}
        - Fuel Type: ${userPreferences.fuelType || 'Not specified'}
        - Usage: ${userPreferences.usage || 'Not specified'}
        - Features: ${userPreferences.features || 'None specified'}
        
        Provide a detailed recommendation with make, model, and reasoning.`;
        
        console.log('Generating recommendation...');
        const recommendation = await generateResponse(prompt);
        
        // Cache the response
        const result = {
            recommendation: recommendation,
            model: MODEL_NAME,
            timestamp: new Date().toISOString()
        };
        
        responseCache.set(cacheKey, result);
        
        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Error generating recommendation:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate recommendation',
            details: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        service: 'car-recommendation-api',
        timestamp: new Date().toISOString(),
        endpoints: {
            'POST /api/recommend': 'Get car recommendations',
            'GET /health': 'Check service status',
            'GET /api/test': 'Test the API with a sample query'
        }
    });
});

// Test endpoint
app.get('/api/test', async (req, res) => {
    try {
        const testPrompt = "What's a good family SUV under $40,000?";
        const response = await generateResponse(testPrompt);
        res.json({
            success: true,
            question: testPrompt,
            response: response
        });
    } catch (error) {
        console.error('Test endpoint error:', error);
        res.status(500).json({
            success: false,
            error: 'Test failed',
            details: error.message
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Car Recommendation API server running on http://localhost:${port}`);
    console.log('Endpoints:');
    console.log(`- POST   /api/recommend - Get car recommendations`);
    console.log(`- GET    /health - Check service status`);
    console.log(`- GET    /api/test - Test the API with a sample query`);
    console.log('\nMake sure the GPT4All service is running on http://localhost:4891');
});
