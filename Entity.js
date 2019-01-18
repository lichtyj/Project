class Entity {
    constructor(position, sprite) {
        if (position instanceof Vector) {
            this.position = position;
        } else {
            console.error("Invalid argument")
            this.position = new Vector(window.innerWidth/2, window.innerHeight/2);
        }
        this.acceleration = new Vector();
        this.sprite = sprite;
    }

    update() {
        
    }
}

Entity.prototype.draw = function (ctx, dt) {
    if (this.sprite instanceof Sprite3D) {
        this.sprite.drawSprite(ctx, dt, this.position.x, this.position.y, this.position.angleTo(game.mouse), 0);   
    } else { 
        this.sprite.drawSubImage(0, ctx, this.position.x, this.position.y, this.position.angleTo(game.mouse));       
    }
    //this.sprite.drawFrame(ctx, dt, this.position.x, this.position.y);
}