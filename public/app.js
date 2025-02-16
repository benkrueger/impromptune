import ABCJS from 'abcjs';

document.getElementById('music-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const prompt = document.getElementById('prompt').value;
    const key = document.getElementById('key').value;
    const timeSignature = document.getElementById('time-signature').value;
    
    // Call your Cloudflare Worker here to get the ABC notation from the LLM
    const abcNotation = await generateMusicWithLLM(prompt, key, timeSignature);
    
    // Render the music with ABCJS
    ABCJS.renderAbc('music-sheet', abcNotation);
});

async function generateMusicWithLLM(prompt, key, timeSignature) {
    // Return a dummy ABC notation string
    const abcNotation = `
        X: 1
        T: Dummy Tune
        M: ${timeSignature || '4/4'}
        K: ${key || 'C'}
        L: 1/4
        C D E F | G A B c ||
    `;
    return abcNotation;
}
