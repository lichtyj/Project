var scale = 8;
var frameWidth = 16;
var frameHeight = 16;
var ax = frameWidth/2;
var ay = frameHeight/2;
var layer = [];
var ctx = [];
var cur = 0;
var prev;
var prev2;
var prev3;
var dt = 0;
var speed = .01;
var color = "black"
var background = "#424242";
var rotation;
var position;

document.addEventListener("DOMContentLoaded", start);

function start() {
    addLayer();
    var preview = document.getElementById("preview");
    var rotate = document.getElementById("preview_rotate");
    var actual = document.getElementById("preview_actual");
    position = document.getElementById("position");
    rotation = document.getElementById("rotation");
    rotation.min = 0;
    rotation.step = Math.PI/25;
    rotation.max = Math.PI*2 + Math.PI/25;

    position.style.marginRight = frameWidth * scale * 2; 
    preview.width = frameWidth * scale * 2;
    preview.height = frameHeight * scale * 4;
    rotate.width = frameWidth * scale * 2;
    rotate.height = frameHeight * scale * 4;
    actual.width = frameWidth * 2;
    actual.height = frameHeight * 4;

    prev = preview.getContext("2d");
    prev2 = rotate.getContext("2d");
    prev3 = actual.getContext("2d");
    window.requestAnimationFrame(update);  
}

update = function() {
    dt += speed;
    drawFrame(prev, dt, scale);
    drawFrame(prev2, rotation.value, scale);
    drawFrame(prev3, rotation.value, 1);
    window.requestAnimationFrame(update);
}

function exportImg() {
    var can = document.createElement('canvas');
    can.width = frameWidth * layer.length;
    can.height = frameHeight;
    var canctx = can.getContext("2d");
    for (let index = 0; index < layer.length; index++) {
        canctx.drawImage(layer[index], index * frameWidth, 0, frameWidth, frameHeight);
    }
    var data = can.toDataURL('image/png', 1.0);
    var img = new Image();
    img.src = data;
    document.getElementById('exportFrame').appendChild(img);
}

function addLayer() {
    var l = document.createElement('canvas');
    var c = l.getContext("2d");
    c.imageSmoothingEnabled = false;
    l.style.border = "1px solid #000";
    l.width = frameWidth * scale;
    l.height = frameHeight * scale;
    document.getElementById('layers').appendChild(l);
    l.addEventListener("mousemove", function(e) {
        var btns;
        if (e.buttons == 1) {
            btns = 0;
        } else if (e.buttons == 2) {
            btns = 2;
        }
        draw( {x:pixelate(e.clientX - l.offsetLeft), 
               y:pixelate(e.clientY - l.offsetTop)}, btns)
    }, false);
    l.addEventListener("mousedown", function(e) {
        draw( {x:pixelate(e.clientX - l.offsetLeft), 
               y:pixelate(e.clientY - l.offsetTop)}, e.button)
    }, false);
    l.addEventListener("contextmenu", event => event.preventDefault());
    layer.push(l);
    ctx.push(c);
    layerUp();
}

function updateColor(newColor) {
    color = newColor;
}

function setBackground() {
    background = color;
}

function layerUp() {
    
    if (cur < layer.length-1) {
        layer[cur].style.border = "1px solid #000";
        cur++;
    }
    layer[cur].style.border = "2px solid #FFF";
    updateLayerLabel();
}

function layerDown() {
    if (cur > 0) {
        layer[cur].style.border = "1px solid #000";
        cur--;
    }
    layer[cur].style.border = "2px solid #FFF";
    updateLayerLabel();
}

function updateLayerLabel() {
    var l = document.getElementById('current')
    l.innerText = "Layer: " + cur;
}

function pixelate(val) {
    return Math.floor(val/scale)*scale;
}

function draw(mouse, btn) {
    position.innerText = "(" + mouse.x/scale + ", " + mouse.y/scale + ")";
    if (btn == 0) {
        ctx[cur].strokeStyle = color;
        ctx[cur].beginPath();
        ctx[cur].moveTo(mouse.x+scale/2, mouse.y);
        ctx[cur].lineTo(mouse.x+scale/2, mouse.y+scale);
        ctx[cur].lineWidth = scale;
        ctx[cur].stroke();
        ctx[cur].closePath();
    } else if (btn == 2) {
        ctx[cur].lineWidth = 1;
        ctx[cur].clearRect(mouse.x, mouse.y, scale, scale);
    }
}

function drawFrame(canv, r, sc) {
    canv.setTransform(1,0,0,1, 0, 0);
    canv.fillStyle = background;
    var parent = canv.canvas;
    canv.fillRect(0,0, parent.width,parent.height);
    for (let index = 0; index < layer.length; index++) {
        canv.setTransform(1,0,0,1, parent.width/2, parent.height-parent.width/2-index*sc/2);  
        canv.rotate(r);
        canv.drawImage(layer[index], -frameWidth*sc/2, -frameHeight*sc/2, frameWidth*sc, frameHeight*sc);
    }
}