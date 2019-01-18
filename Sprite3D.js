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
        this.elapsedTime = 0;
        this.ax = frameWidth/2;
        this.ay = frameHeight/2;
        this.bounce = Math.random()*10;
    }

    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration) % this.frames;
    }

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    }

    drawSprite(ctx, dt, x, y, r, bounce) {
        this.elapsedTime += dt;
        if (this.isDone()) {
            if (this.loop) this.elapsedTime = 0;    
        }
        this.drawFrame(this.currentFrame(), ctx, x, y, r, bounce);
    }

    drawFrame(frame, ctx, x, y, r, bounce) {
        this.bounce += bounce/6;
        this.bounce %= Math.PI*2;
        var b = (Math.cos(this.bounce)-1)/16+1;
        var tempR = Math.sin(this.bounce)/2;
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
        this.bounce /= 1.01;
    }
}