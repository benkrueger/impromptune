export async function onRequestPost(context) {
    try {
        const { prompt, key, timeSignature } = await context.request.json();

        const aiResponse = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${context.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-2-7b-chat-int8`,
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
                            content: "You are a music composer assistant. Generate ABC notation format music. Always include the header with X, T, M, K, and L fields. Make the music match the requested style and constraints."
                        },
                        {
                            role: "user",
                            content: `Create a melody in ABC notation format with the following constraints: Key: ${key || 'C'}, Time Signature: ${timeSignature || '4/4'}. Style description: ${prompt}`
                        }
                    ]
                })
            }
        );

        const result = await aiResponse.json();
        
        if (!result.result || !result.result.response) {
            throw new Error('Invalid AI response format');
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
