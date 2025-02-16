document.getElementById('music-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const prompt = document.getElementById('prompt').value;
    const key = document.getElementById('key').value;
    const timeSignature = document.getElementById('time-signature').value;

    const abcNotation = await generateMusicWithLLM(prompt, key, timeSignature);
    ABCJS.renderAbc('music-sheet', abcNotation);
});

async function generateMusicWithLLM(prompt, key, timeSignature) {
    try {
        // Make request to your Worker endpoint instead of directly to Cloudflare AI
        const response = await fetch('/api/generate-music', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt,
                key,
                timeSignature
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate music');
        }

        const abcNotation = await response.text();
        
        // Basic error handling if response isn't valid ABC notation
        if (!abcNotation.includes('X:') || !abcNotation.includes('K:')) {
            return `
                X: 1
                T: AI Generated Tune
                M: ${timeSignature || '4/4'}
                K: ${key || 'C'}
                L: 1/4
                C D E F | G A B c ||
            `;
        }

        return abcNotation;
    } catch (error) {
        console.error('Error generating music:', error);
        // Return fallback notation if there's an error
        return `
            X: 1
            T: Error Fallback Tune
            M: ${timeSignature || '4/4'}
            K: ${key || 'C'}
            L: 1/4
            C D E F | G A B c ||
        `;
    }
}


// ... existing code...