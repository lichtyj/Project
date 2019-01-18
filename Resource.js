class Resource extends Object {
    constructor(position, sprite, rotation) {
        super(position, sprite, rotation);
        
    }

    remove() {
        game.remove(this);
    }

    draw(ctx, dt) {
        this.rotation += 0.01;
        if (this.sprite instanceof Sprite3D) {
            this.sprite.drawSprite(ctx, dt, this.position.x, this.position.y, this.rotation, 0.25, true);   
        }
    }
}