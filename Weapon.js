class Weapon extends Entity {
    constructor(position, sprite, barrel, grip) {
        super(position, sprite);
        this.facing = new Vector();
        this.target = new Vector();
        this.bounce = 0;
        this.barrel = new Vector(28, 0, 3);
        this.grip = new Vector(8, -2, 0);
    }

    // setTarget(x, y) {
    //     this.target.x = x;
    //     this.target.y = y;
    // }

    // update() {
    //     this.facing.x = (this.facing.x + this.target.x - this.position.x)*.5;
    //     this.facing.y = (this.facing.y + this.target.y - this.position.y)*.5;
    // }

    shoot() {
        var temp = this.facing.clone().limit(1);
        temp.mult(10);
        temp.x += Math.random()*2-1;
        temp.y += Math.random()*2-1;
        var shot = new Projectile(this.position.offset(this.facing, this.barrel), assetMgr.getAsset("particle"), new Vector(temp.x, temp.y, .5), 0, 0, 1, 0);
        game.addEntity(shot);
    }

    carry(hand, facing) {
        this.position.set(hand.offset(this.facing, this.grip));
        this.facing.set(facing);
    }

    draw(ctx, dt) {
        this.elapsedTime += dt;
        if (this.sprite instanceof Sprite3D) {
            var b = this.velocity.magnitude();
            this.bounce += b/6;
            this.bounce %= Math.PI*2;
            if (b < 0.1) {
                if (this.bounce > Math.PI) {
                    this.bounce *= 1.05;
                } else {
                    this.bounce /= 1.05;
                }
            }
            this.sprite.drawSprite(ctx, this.elapsedTime, this.position.x, this.position.y - this.position.z, 0/*this.position.z*/, this.facing.angle(), this.bounce, 8);   
        } else { 
            this.sprite.drawSubImage(0, ctx, this.position.x, this.position.y, this.facing.angle());       
        }
    }
}