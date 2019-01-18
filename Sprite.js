class Sprite {
    constructor(spriteSheet, frameWidth, frameHeight, sheetWidth,
        frameDuration, frames, loop, sx, sy, ax, ay) {
        this.spriteSheet = spriteSheet;
        this.frameWidth = frameWidth;
        this.frameDuration = frameDuration;
        this.frameHeight = frameHeight;
        this.sheetWidth = sheetWidth;
        this.frames = frames;
        this.totalTime = frameDuration * frames;
        this.elapsedTime = 0;
        this.loop = loop;
        this.sx = sx;
        this.sy = sy;
        this.ax = frameWidth/2;
        this.ay = frameHeight/2;
    }

    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    }

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    }

    drawSubImage(index, ctx, x, y, r) {
        var frame = index % this.frames;
        var xindex = frame % this.sheetWidth;
        var yindex = Math.floor(frame / this.sheetWidth);  
        ctx.setTransform(this.sx,0,0,this.sy,x,y);  
        ctx.rotate(r);
        ctx.drawImage(this.spriteSheet, xindex * this.frameWidth, 
            yindex * this.frameHeight,this.frameWidth, 
            this.frameHeight, -this.ax, -this.ay, this.frameWidth, 
            this.frameHeight);
    }
    drawSprite(ctx, dt, x, y, r) {
        this.elapsedTime += dt;
        if (this.isDone()) {
            if (this.loop) this.elapsedTime = 0;    
        }
        this.drawSubImage(this.currentFrame(), ctx, x, y, r);
    }   
}

