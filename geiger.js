/**
 * @author wraybowling http://rgbk.org
 */

function Geiger(targetFPS) {
	'use strict';
	this.targetFPS = targetFPS || 30.0;
	this.startTime = Date.now();
	this.prevTime = this.startTime;
	this.fps = 0;
	this.frames = 0;
	this.audioReady = false;

	window.addEventListener('load', this.initAudio(this), false);
}

Geiger.prototype.begin = function(){
	startTime = Date.now();
};

Geiger.prototype.end = function(){
	var time = Date.now();

	frames ++;
	if ( time > this.prevTime + 1000 / this.targetFPS ) {
		this.fps = Math.round( ( this.frames * 1000 ) / ( time - this.prevTime ) );

		if(this.audioReady && this.fps < this.targetFPS){
			this.click();
		}

		this.prevTime = time;
		this.frames = 0;
	}

	return time;
};

Geiger.prototype.initAudio = function(geiger){
	try {
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		geiger.audioReady = true;
	}catch(e) {
		console.error('Web Audio API is not supported in this browser.');
	}

	geiger.webaudio = new AudioContext();

	// oscillator
	var osc = geiger.webaudio.createOscillator();
	osc.frequency.value = 440 * Math.PI * 2.0;
	osc.start(0);

	// amp
	geiger.amp = geiger.webaudio.createGain();
	geiger.amp.gain.value = 0;

	// patch
	osc.connect(geiger.amp);
	geiger.amp.connect(geiger.webaudio.destination);

	geiger.audioReady = true;
};

Geiger.prototype.click = function(){
	var now = this.webaudio.currentTime;
	this.amp.gain.cancelScheduledValues( now );
	this.amp.gain.setValueAtTime(0, now);
	this.amp.gain.linearRampToValueAtTime(0.2 , now + 0.003);
	this.amp.gain.linearRampToValueAtTime(0 , now + 0.006);
};
