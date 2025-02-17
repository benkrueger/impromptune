//import ABCJS from 'abcjs';

document.getElementById('music-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const prompt = document.getElementById('prompt').value;
    const key = document.getElementById('key').value;
    const timeSignature = document.getElementById('time-signature').value;

    document.getElementById('loading-indicator').style.display = 'block';
    document.getElementById('music-form').querySelector('button').disabled = true;

    try {
        const abcNotation = await generateMusicWithLLM(prompt, key, timeSignature);

        document.getElementById('music-sheet').innerHTML = '';
        document.getElementById('audio-controls').innerHTML = '';

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

            document.getElementById('download-png').style.display = 'block';
            document.getElementById('download-png').onclick = function() {
                const svg = document.querySelector('#music-sheet svg');
                svg.style.marginBottom = "0";
                downloadSvgAsPng(svg);
            };
        } else {
            document.querySelector("#audio-controls").innerHTML =
                "<div class='audio-error'>Audio is not supported in this browser.</div>";
        }

        document.getElementById('music-sheet').style.display = 'block';
        document.getElementById('audio-controls').style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
    } finally {
        document.getElementById('loading-indicator').style.display = 'none';
        document.getElementById('music-form').querySelector('button').disabled = false;
    }
});

async function generateMusicWithLLM(prompt, key, timeSignature) {
    try {
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

function downloadSvgAsPng(svgElement) {
    const data = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
    const DOMURL = window.URL || window.webkitURL || window;
    const url = DOMURL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = svgElement.clientWidth;
        canvas.height = svgElement.clientHeight;
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);
        const png = canvas.toDataURL('image/png');

        const downloadLink = document.createElement('a');
        downloadLink.href = png;
        downloadLink.download = 'music-sheet.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        DOMURL.revokeObjectURL(url);
    };
    img.src = url;
}
