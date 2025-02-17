function onLoad() {
	"use strict";
	var body = document.querySelector('body');

	//
	// Draw music
	//
	var tune = 'X: 1\n' +
		'T: Cooley\'s\n' +
		'M: 4/4\n' +
		'L: 1/8\n' +
		'K: Emin\n' +
		'|:D2|"Em"EBBA B2 EB|\\\n    ~B2 AB dBAG|\\\n    "D"FDAD BDAD|\\\n    FDAD dAFD|\n' +
		'"Em"EBBA B2 EB|\\\n    B2 AB defg|\\\n    "D"afe^c dBAF|\\\n    "Em"DEFD E2:|\n' +
		'|:gf|"Em"eB B2 efge|\\\n    eB B2 gedB|\\\n    "D"A2 FA DAFA|\\\n    A2 FA defg|\n' +
		'"Em"eB B2 eBgB|\\\n    eB B2 defg|\\\n    "D"afe^c dBAF|\\\n    "Em"DEFD E2:|\n';
	document.querySelector('.source').innerHTML = tune;
	var visualObj = window.ABCJS.renderAbc('engraving', tune, {responsive: "resize",
		format: {
			titlefont: '"itim-music,Itim" 24',
			gchordfont: '"itim-music,Itim" 20',
		} })[0];
	if (ABCJS.synth.supportsAudio()) {
		var synthControl = new ABCJS.synth.SynthController();
		synthControl.load("#main-midi", null, {displayRestart: true, displayPlay: true, displayProgress: true});
		synthControl.setTune(visualObj, false);
	} else {
		document.querySelector("#main-midi").innerHTML = "<div class='audio-error'>Audio is not supported in this browser.</div>";
	}

	var whyTune = 'X: 1\n' +
		'M: 6/8\n' +
		'L: 1/8\n' +
		'K: Eb clef=bass\n' +
		'E,,2G,,A,,2^A,,|B,,6|E,,6|]\n'
	;
	window.ABCJS.renderAbc('why-music', whyTune, {responsive: "resize", staffwidth: 250 });

	var basicTune = 'X: 1\n' +
		'%%leftmargin 0\n' +
		'%%rightmargin 0\n' +
		'M: 4/4\n' +
		'L: 1/8\n' +
		'K: A\n' +
		'a2=g2e2g2|edc2A4|\n' +
		'a2=g2e2g2|a8|]\n'
	;
	window.ABCJS.renderAbc('basic-usage', basicTune, {responsive: "resize", staffwidth: 300 });

	//
	// Set email
	//
	var e1 = 'paul';
	var e2 = 'rosen';
	var e3 = '@';

	document.querySelector('.email').setAttribute('href', 'mailto:' + e1+e3+e1+e2+'.net');
}

window.addEventListener("load", onLoad);