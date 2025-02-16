import { renderAbc } from 'https://cdn.jsdelivr.net/npm/abcjs@6.4.4/dist/abcjs-basic.min.js';

document.getElementById('music-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const prompt = document.getElementById('prompt').value;
    const key = document.getElementById('key').value;
    const timeSignature = document.getElementById('time-signature').value;

    const abcNotation = await generateMusicWithLLM(prompt, key, timeSignature);

    ABCJS.renderAbc('music-sheet', abcNotation);
});

async function generateMusicWithLLM(prompt, key, timeSignature) {
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