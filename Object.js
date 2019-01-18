class Object extends Entity {
    constructor(position, sprite, rotation) {
        super(position, sprite);
        this.rotation = rotation;
    }

    draw(ctx, dt) {
        //TODO bake this?
        if (this.sprite instanceof Sprite3D) {
            this.sprite.drawSprite(ctx, dt, this.position.x, this.position.y, this.rotation, 0.25, true);   
        }
    }
}