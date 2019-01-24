class Resource extends Object {
    constructor(position, sprite, rotation) {
        super(position, sprite, rotation);
        this.elapsedTime = 0;
        this.bounce = 0;
    }

    remove() {
        game.remove(this);
    }

    draw(ctx, dt) {
        this.rotation += 0.01;
        this.elapsedTime += dt;
        if (this.sprite instanceof Sprite3D) {
            this.sprite.drawSprite(ctx, this.elapsedTime, this.position.x, this.position.y, 0/*this.position.z*/, this.rotation, this.bounce += .075);   
        }
    }
}