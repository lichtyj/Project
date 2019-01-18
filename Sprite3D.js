class Sprite3D {
    constructor(spriteSheet, frameWidth, frameHeight, layers, scale,
                 frameDuration, frames, loop) {
        this.spriteSheet = spriteSheet;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.layers = layers;
        this.sc = scale;
        this.frameDuration = frameDuration;
        this.frames = frames;
        this.totalTime = frameDuration * frames;
        this.loop = loop;
        this.ax = frameWidth/2;
        this.ay = frameHeight/2;
    }

    drawSprite(ctx, elapsedTime, x, y, r, bounce) {
        var currentFrame;
        if (this.loop) elapsedTime %= this.totalTime;    
        currentFrame = Math.floor(elapsedTime / this.frameDuration) % this.frames;
        this.drawFrame(currentFrame, ctx, x, y, r, bounce);
    }

    drawFrame(frame, ctx, x, y, r, bounce) {
        var b = (Math.cos(bounce)-1)/16+1;
        var tempR = Math.sin(bounce)*.75;
        for (let index = 0; index < this.layers; index++) {
            ctx.setTransform(this.sc,0,0,this.sc,x,y-index*game.viewAngle*b*this.sc);
            if (index < 6) {
                ctx.rotate(r+tempR*(1-index/6));
            } else {
                ctx.rotate(r);
            }
            ctx.drawImage(this.spriteSheet, index * this.frameWidth, 
                frame * this.frameHeight ,this.frameWidth, this.frameHeight, -this.ax, -this.ay, this.frameWidth, 
                this.frameHeight);
        }
    }
}