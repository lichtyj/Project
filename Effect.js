class Effect extends Entity{
    constructor(position, sprite) {
        super(position, sprite);
    }

    update() {
        if (this.elapsedTime > this.sprite.frameDuration * this.sprite.frames) {
            game.remove(this);
        }
    }
}