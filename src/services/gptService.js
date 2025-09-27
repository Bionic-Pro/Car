const API_URL = 'http://localhost:4891/api/recommend';

export const getCarRecommendation = async (userPreferences) => {
    try {
        console.log('Sending request to GPT4All server with preferences:', userPreferences);
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userPreferences }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get recommendation');
        }

        const data = await response.json();
        return data.recommendation;
    } catch (error) {
        console.error('Error getting car recommendation:', error);
        throw new Error(error.message || 'Failed to get recommendation. Please try again later.');
    }
};

export const checkServerStatus = async () => {
    try {
        const response = await fetch('http://localhost:4891/health');
        return await response.json();
    } catch (error) {
        console.error('Error checking server status:', error);
        return { status: 'error', message: 'Server not reachable' };
    }
};
