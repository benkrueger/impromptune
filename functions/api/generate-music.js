export async function onRequestPost(context) {
    try {
        const { prompt, key, timeSignature } = await context.request.json();

        // First API call to analyze the request and get a descriptive paragraph
        const analysisResponse = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${context.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-70b-instruct`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${context.env.CLOUDFLARE_AUTH_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "system",
                            content: "You are a music composer assistant. Analyze the user request and provide a descriptive paragraph about the song style and nature. Be descriptive about what you want out of the song."
                        },
                        {
                            role: "user",
                            content: `Analyze the following style: ${prompt}`
                        }
                    ]
                })
            }
        );

        const analysisResult = await analysisResponse.json();
        
        if (!analysisResult.result || !analysisResult.result.response) {
            throw new Error('Invalid AI response format during analysis');
        }

        const analysisParagraph = analysisResult.result.response;

        // Second API call to generate the ABCJS notation
        const aiResponse = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${context.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-70b-instruct`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${context.env.CLOUDFLARE_AUTH_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "system",
                            content: "You are a music composer assistant. Generate ABC notation format music. YOUR ONLY OUTPUT SHOULD BE VALID ABCJS. Always include the header with X, T, M, K, and L fields. Make the music match the requested style and constraints."
                        },
                        {
                            role: "user",
                            content: `Create a melody in ABC notation format based on analysis: ${analysisParagraph}. Key: ${key || 'C'}, Time Signature: ${timeSignature || '4/4'}. OUTPUT ONLY ABCJS VALID STRINGS. DO NOT INCLUDE ANY EXPLANATION OR DESCRIPTION OF YOUR RESPONSE.`
                        }
                    ]
                })
            }
        );

        const result = await aiResponse.json();
        
        if (!result.result || !result.result.response) {
            throw new Error('Invalid AI response format during music generation');
        }

        return new Response(result.result.response, {
            headers: { 
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*'
            }
        });

    } catch (error) {
        return new Response('Error generating music', { 
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}