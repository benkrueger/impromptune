//import ABCJS from 'abcjs';

document.getElementById('music-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const prompt = document.getElementById('prompt').value;
    const key = document.getElementById('key').value;
    const timeSignature = document.getElementById('time-signature').value;
    
    // Show loading indicator and disable form
    document.getElementById('loading-indicator').style.display = 'block';
    document.getElementById('music-form').querySelector('button').disabled = true;
    
    try {
        // Call your Cloudflare Worker here to get the ABC notation from the LLM
        const abcNotation = await generateMusicWithLLM(prompt, key, timeSignature);
        
        // Clear any existing content
        document.getElementById('music-sheet').innerHTML = '';
        document.getElementById('audio-controls').innerHTML = '';
        
        // Render music with better audio player
        if (ABCJS.synth.supportsAudio()) {
            const visualObj = ABCJS.renderAbc('music-sheet', abcNotation, {
                responsive: "resize",
                format: {
                    titlefont: '"itim-music,Itim" 24',
                    gchordfont: '"itim-music,Itim" 20',
                }
            })[0];

            const synthControl = new ABCJS.synth.SynthController();
            synthControl.load("#audio-controls", null, {
                displayRestart: true,
                displayPlay: true,
                displayProgress: true,
                displayWarp: true,
                displayLoop: true
            });
            synthControl.setTune(visualObj, false);
        } else {
            document.querySelector("#audio-controls").innerHTML = 
                "<div class='audio-error'>Audio is not supported in this browser.</div>";
        }
        
        // Show the containers
        document.getElementById('music-sheet').style.display = 'block';
        document.getElementById('audio-controls').style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Hide loading indicator and re-enable form
        document.getElementById('loading-indicator').style.display = 'none';
        document.getElementById('music-form').querySelector('button').disabled = false;
    }
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
