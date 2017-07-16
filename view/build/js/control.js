var IMG = null;

function q(id){
	return document.getElementById(id);
}

function qs(id){
	return document.querySelector(id);
}

function toggleFullScreen() {
	if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
		if (document.documentElement.requestFullScreen) {  
			document.documentElement.requestFullScreen();  
		} else if (document.documentElement.mozRequestFullScreen) {  
			document.documentElement.mozRequestFullScreen();  
		} else if (document.documentElement.webkitRequestFullScreen) {  
			document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
		}  
	} else {  
		if (document.cancelFullScreen) {  
			document.cancelFullScreen();  
		} else if (document.mozCancelFullScreen) {  
			document.mozCancelFullScreen();  
		} else if (document.webkitCancelFullScreen) {  
			document.webkitCancelFullScreen();  
		}  
	}  
}

function ScaleImage(srcwidth, srcheight, targetwidth, targetheight, fLetterBox) {
    var result = { width: 0, height: 0, fScaleToTargetWidth: true };

    if ((srcwidth <= 0) || (srcheight <= 0) || (targetwidth <= 0) || (targetheight <= 0)) {
        return result;
    }

    // scale to the target width
    var scaleX1 = targetwidth;
    var scaleY1 = (srcheight * targetwidth) / srcwidth;

    // scale to the target height
    var scaleX2 = (srcwidth * targetheight) / srcheight;
    var scaleY2 = targetheight;

    // now figure out which one we should use
    var fScaleOnWidth = (scaleX2 > targetwidth);
    if (fScaleOnWidth) {
        fScaleOnWidth = fLetterBox;
    }
    else {
       fScaleOnWidth = !fLetterBox;
    }

    if (fScaleOnWidth) {
        result.width = Math.floor(scaleX1);
        result.height = Math.floor(scaleY1);
        result.fScaleToTargetWidth = true;
    }
    else {
        result.width = Math.floor(scaleX2);
        result.height = Math.floor(scaleY2);
        result.fScaleToTargetWidth = false;
    }
    result.targetleft = Math.floor((targetwidth - result.width) / 2);
    result.targettop = Math.floor((targetheight - result.height) / 2);

    return result;
}

function resize(){
	var pad = q("pad");
	
	var btn = {
		start: qs("#pad .start"),
		left: qs("#pad .left"),
		right: qs("#pad .right")
	}
	var wind_size = {
		h: window.innerHeight,
		w: window.innerWidth
	}

	pad.style.height = window.innerHeight+"px";

	if(IMG){
   		var calc = ScaleImage(IMG.width, IMG.height, window.innerWidth, window.innerHeight, true);
   		
   		// start button
   		btn.start.style.height = (0.084226646 * calc.height) + "px";
		btn.start.style.top = (calc.targettop + (0.156202144  * calc.height)) + "px";

		btn.start.style.width = (0.095878136 * calc.width) + "px";
		btn.start.style.left = (calc.targetleft + (0.669354839  * calc.width)) + "px";


		// left controller
		btn.left.style.height = (0.324655436 * calc.height) + "px";
		btn.left.style.top = (calc.targettop + (0.278713629  * calc.height)) + "px";

		btn.left.style.width = (0.1890681 * calc.width) + "px";
		btn.left.style.left = (calc.targetleft + (0.123655914  * calc.width)) + "px";

		// right controller
		btn.right.style.height = (0.329249617 * calc.height) + "px";
		btn.right.style.top = (calc.targettop + (0.287901991  * calc.height)) + "px";

		btn.right.style.width = (0.295698925 * calc.width) + "px";
		btn.right.style.left = (calc.targetleft + (0.636200717  * calc.width)) + "px";
	}
}

// control

window.onresize = resize;

IMG = new Image();
IMG.src = '../img/pad.png';

IMG.onload = function(){
	resize();
};

var socket = io("/", { query: "play="+document.location.pathname.match(/\/play\/(.*)/)[1] });

var btns = [
	// left
	{ q: ".left .t", k: "up" },
	{ q: ".left .l", k: "left" },
	{ q: ".left .r", k: "right" },
	{ q: ".left .d", k: "down" },

	// right
	{ q: ".right .a", k: "a" },
	{ q: ".right .b", k: "b" },
	{ q: ".right .c", k: "c" },

	// start
	{ q: ".start", k: "start" }
]

function setListener(btns){
	qs("#pad "+btns.q).ontouchstart = function(){
		socket.emit("key", "d:"+btns.k);
	}
	qs("#pad "+btns.q).ontouchend = function(){
		socket.emit("key", "u:"+btns.k);
	}
}
	
for(var i=0;i<btns.length;i++){
	setListener(btns[i]);
}