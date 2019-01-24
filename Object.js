class Object extends Entity {
    constructor(position, sprite, rotation) {
        super(position, sprite);
        this.rotation = rotation;
        this.elapsedTime = 0;
    }

    draw(ctx, dt) {
        //TODO bake this?
        this.elapsedTime += dt;
        if (this.sprite instanceof Sprite3D) {
            this.sprite.drawSprite(ctx, this.elapsedTime, this.position.x, this.position.y, 0/*this.position.z*/, this.rotation, 0.25, true);   
        }
    }
}