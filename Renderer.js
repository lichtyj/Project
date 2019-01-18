// class Sprite3D {
//     constructor(spriteSheet, frameWidth, frameHeight, layers, scale,
//                  frameDuration, frames, loop) {
//         this.spriteSheet = spriteSheet;
//         this.frameWidth = frameWidth;
//         this.frameHeight = frameHeight;
//         this.layers = layers;
//         this.sc = scale;
//         this.frameDuration = frameDuration;
//         this.frames = frames;
//         this.totalTime = frameDuration * frames;
//         this.loop = loop;
//         this.elapsedTime = 0;
//         this.ax = frameWidth/2;
//         this.ay = frameHeight/2;
//         this.bounce = Math.random()*10;
//     }

//     currentFrame() {
//         return Math.floor(this.elapsedTime / this.frameDuration) % this.frames;
//     }

//     isDone() {
//         return (this.elapsedTime >= this.totalTime);
//     }

//     drawSprite(ctx, dt, x, y, r, bounce) {
//         this.elapsedTime += dt;
//         if (this.isDone()) {
//             if (this.loop) this.elapsedTime = 0;    
//         }
//         this.drawFrame(this.currentFrame(), ctx, x, y, r, bounce);
//     }

//     drawFrame(frame, ctx, x, y, r, bounce) {
//         this.bounce += bounce/6;
//         this.bounce %= Math.PI*2;
//         var b = (Math.cos(this.bounce)-1)/32+1;
//         for (let index = 0; index < this.layers; index++) {
//             ctx.setTransform(this.sc,0,0,this.sc,x,y-index*game.viewAngle*b*this.sc);  
//             ctx.rotate(r);
//             ctx.drawImage(this.spriteSheet, index * this.frameWidth, 
//                 frame * this.frameHeight ,this.frameWidth, this.frameHeight, -this.ax, -this.ay, this.frameWidth, 
//                 this.frameHeight);
//         }
//         this.bounce /= 1.01;
//     }
// }

// var spr = [];



onmessage = function(e) {
    console.log("Renderer: message recieved: " + e.data);
    switch (e.data.name) {
        case "Add Sprite": 
            console.log("Renderer: Added entity: " + e.data.content);
            break;

    }
    // tempCanvas = createElement('canvas');
    // tempCanvas.width = this.canvas.width;
    // tempCanvas.height = this.canvas.height;
    // tempCtx = tempCanvas.getContext('2d');
    // tempCtx.fillStyle = "#559061";
    // tempCtx.fillRect(0, 0, tempCtx.canvas.width, tempCtx.canvas.height);
    // tempCtx.save();
    // this.entities.sort(function(a,b) {return a.position.y-b.position.y})
    // for (var i = 0; i < this.entities.length; i++) {
    //     this.entities[i].draw(tempCtx, dt);
    // }
    // tempCtx.restore();
    // this.ctx.drawImage(tempCtx, 0,0);
    // tempCanvas.remove();

    postMessage(e.data.content);

}