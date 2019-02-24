class Resource extends Object {
    constructor(position, type, rotation, spin) {
        super(position, assetMgr.getSprite(type), rotation);
        this.elapsedTime = 0;
        this.bounce = 0;
        this.spin = spin;
        this.visible = false;
        this.target = false;
        this.type = type;
    }

    update() {
        terrain.setPos(this.position.x, this.position.y, 2, true);
    }

    remove() {
        game.remove(this);
    }

    draw(ctx, dt) {
        this.rotation += 0.01;
        this.elapsedTime += dt;
        if (this.visible) {
            ctx.setTransform(1,0,0,1,0,0);
            if (this.target) {
                ctx.fillStyle = "#0F0";
            } else {
                ctx.fillStyle = "#00F";
            }
            ctx.fillRect(this.position.x-1 - game.view.x, this.position.y  - game.view.y, 2, 10)
            this.visible = false;
            this.target = false;
        }
        if (this.sprite instanceof Sprite3D) {
            this.sprite.drawSprite(ctx, this.elapsedTime, this.position.x, this.position.y, 0/*this.position.z*/, this.rotation, this.bounce += .075, this.spin);
        }
    }
}