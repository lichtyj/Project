class Sprite3D {
    constructor(spriteSheet, frameWidth, frameHeight, layers,
                 frameDuration, frames, loop) {
        this.spriteSheet = spriteSheet;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.layers = layers;
        this.frameDuration = frameDuration;
        this.frames = frames;
        this.totalTime = frameDuration * frames;
        this.loop = loop;
        this.ax = frameWidth/2;
        this.ay = frameHeight/2;
    }

    drawSprite(ctx, elapsedTime, x, y, z, r, bounce, swing) {
        var currentFrame;
        if (this.loop) elapsedTime %= this.totalTime;    
        currentFrame = Math.floor(elapsedTime / this.frameDuration) % this.frames;
        this.drawFrame(currentFrame, ctx, x, y, z, r, bounce, swing);
    }

    drawFrame(frame, ctx, x, y, z, r, bounce, swing) {
        var b = (Math.cos(bounce)-1)/16+1;
        var tempR = Math.sin(bounce)*.75;
        for (let index = 0; index < this.layers; index++) {
            if (index == 0) {
                ctx.globalCompositeOperation = "multiply";
                var alpha = .25-Math.pow(z/250,2);
                if (alpha < 0) alpha = 0;
                ctx.globalAlpha = alpha;
                ctx.setTransform(1,0,0,1,x,y-index*game.viewAngle*b);
            } else {
                ctx.globalAlpha = 1;
                ctx.globalCompositeOperation = "normal";
                ctx.setTransform(1,0,0,1,x,y-z-index*game.viewAngle*b);
            }
            if (typeof swing == "number" && index < swing && index != 0) {
                ctx.rotate(r+tempR*(1-index/swing));
            } else {
                ctx.rotate(r);
            }
            ctx.drawImage(this.spriteSheet, index * this.frameWidth, 
                frame * this.frameHeight ,this.frameWidth, this.frameHeight, -this.ax, -this.ay, this.frameWidth, 
                this.frameHeight);
                // ctx.drawImage(this.spriteSheet, index * this.frameWidth, 
                //     frame * this.frameHeight ,this.frameWidth, this.frameHeight, -this.ax, -this.ay, this.frameWidth*(z/200+1), 
                //     this.frameHeight*(z/200+1));
        }
    }
}