class Weapon extends Entity {
    constructor(position) {
        super(position);
        this.sprite;
        this.facing = new Vector();
        this.target = new Vector();
        this.bounce = 0;
        this.barrel = new Vector(8, 0, 3);
        this.grip = new Vector(8, -2, 0);
        this.gun;
    }

    preset(gun) {
        this.sprite = assetMgr.getSprite(gun);
        this.gun = gun;
        switch(gun) {
            case "railgun":
                this.barrel = new Vector(8, 0, 3);
                this.grip = new Vector(8, -2, 0);
                break;
            case "laserpistol":
                this.barrel = new Vector(3, 0, 1);
                this.grip = new Vector(3, 0, 0);
                break;
        }
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
        temp.mult(15);
        temp.x += Math.random()*2-1;
        temp.y += Math.random()*2-1;

        var tempPos2 = this.position.clone();
        tempPos2.subtract(this.grip);
        tempPos2.x += 8; // TODO fix this
        var tempPos = tempPos2.offset(this.facing, this.barrel).clone()

        var shot = new Projectile(this.position.clone().offset(this.facing, this.barrel), new Vector(temp.x, temp.y, .5));
        var p = new Particles(tempPos.clone(), new Vector(temp.x, temp.y, 0));
        switch(this.gun) {
            case "railgun":
                shot.velocity.mult(.5);
                shot.velocity.z *= 6;
                shot.color = "#03b3ff";
                shot.gravity = 0.125;
                shot.size = 4;
                shot.type = "energy";
                p.velocity.mult(.5);
                p.velocity.z *= 6;
                p.rate = 40;
                p.force = .25;
                p.count = 40;
                p.hue = 140;
                p.mode = "screen";
                p.timeP = 2;
                p.init();
                break;
            case "laserpistol":
                shot.color = "#F00";
                shot.size = 0;
                shot.type = "laser"
                p.rate = 2;
                p.force = .25;
                p.count = 0;
                p.hue = 0;
                p.mode = "normal";
                p.time = 10;
                p.timeP = 2;
                p.init();
                break;
        }

        game.addEntity(shot);
        // var p = new Particles(tempPos.clone(), new Vector(temp.x, temp.y, 0));
        // p.rate = 30;
        // p.force = .25;
        // p.count = 40;
        // p.hue = 0;
        // p.hueR = 10;
        // p.hueV = 50;
        // p.brightV = 64;
        // p.mode = "screen";
        // p.time = 15;
        // p.timeP = 2;
        // p.glow = true;
        // p.gravity = -.125;
        // p.init();
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