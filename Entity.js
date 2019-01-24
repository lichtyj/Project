class Entity {
    constructor(position, sprite) {
        if (position instanceof Vector) {
            this.position = position;
        } else {
            console.error("Invalid argument")
            this.position = new Vector(window.innerWidth/2, window.innerHeight/2);
        }
        this.velocity = new Vector();
        this.direction = new Vector();
        this.acceleration = new Vector();
        this.sprite = sprite;
        this.rotation = 0;
        this.elapsedTime = 0;
    }

    update() {
        this.direction.toAngle(this.position.angleTo(game.mouse));
    }
}

Entity.prototype.draw = function (ctx, dt) {
    this.elapsedTime += dt;
    if (this.sprite instanceof Sprite3D) {
        this.sprite.drawSprite(ctx, this.elapsedTime, this.position.x, this.position.y, 0/*this.position.z*/, this.direction,0);   
    } else { 
        this.sprite.drawSubImage(0, ctx, this.position.x, this.position.y, this.direction);       
    }
    //this.sprite.drawFrame(ctx, dt, this.position.x, this.position.y);
}