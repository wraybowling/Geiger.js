/**
 * @author wraybowling http://rgbk.org
 */

function Geiger(targetFPS) {
	'use strict';
	targetFPS = targetFPS || 30.0;
	var startTime = Date.now(), prevTime = startTime;
	var ms = 0, msMin = Infinity, msMax = 0;
	var fps = 0, fpsMin = Infinity, fpsMax = 0;
	var frames = 0, mode = 0;

	var webaudio, amp;
	var ampAttack = 0.002; // seconds
	var ampRelease = 0.002; // seconds

	this.begin = function(){
		startTime = Date.now();
		return startTime;
	};

	this.end = function(){
		var time = Date.now();

		ms = time - startTime;
		msMin = Math.min( msMin, ms );
		msMax = Math.max( msMax, ms );

		frames ++;
		if ( time > prevTime + 1000 / targetFPS ) {
			fps = Math.round( ( frames * 1000 ) / ( time - prevTime ) );

			if(fps < targetFPS){
				this.click();
			}

			prevTime = time;
			frames = 0;
		}

		return time;
	};

	window.addEventListener('load', init, false);
	function init() {
		try {
			// Fix up for prefixing
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			webaudio = new AudioContext();

			// oscillator
			var osc = webaudio.createOscillator();
			osc.frequency.value = 440 * Math.PI * 2.0;
			osc.start(0);

			// amp
			amp = webaudio.createGain();
			amp.gain.value = 0;

			// patch
			osc.connect(amp);
			amp.connect(webaudio.destination);
		}
		catch(e) {
			console.error('Web Audio API is not supported in this browser.');
		}
	}

	this.click = function(){
		var now = webaudio.currentTime;
		amp.gain.cancelScheduledValues( now );
		amp.gain.setValueAtTime(0, now);
		amp.gain.linearRampToValueAtTime(0.2 , now + ampAttack);
		amp.gain.linearRampToValueAtTime(0 , now + ampAttack + ampRelease);
	};
}