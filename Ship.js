class Ship {
    constructor(sprite, shadowSprite) {
        this.position = new Vector3D(100,100,200);
        this.velocity = new Vector3D(10,10,-1);
        this.acceleration = new Vector3D();
        this.elapsedTime = 0;
        this.direction = 0;
        this.sprite = sprite;
        this.gravity = 1; // TODO move this
        this.bounce = 0;
        this.spin = 0.09;
        this.landed = false;
        this.stopped = false;
        this.shadowSprite = shadowSprite;
        this.timer = 0;
    }

    update(dt) {
        this.direction += this.spin;
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.div(1.1);
        this.acceleration.subtract(this.acceleration);


        if (game.player == undefined) { /// TODO pull this out into an animation method and increment a 'stages' variable instead of all these bools
            if (!this.stopped) {
                if (this.position.z < 0) {
                    console.log("Landed");
                    this.position.z = 0;
                    this.landed = true;
                    if (this.spin > 0.007) {
                        var pos = new Vector3D(this.position.x, this.position.y, 3);
                        var dist = Math.random()*30+25;
                        var angle = 3.3+Math.random()*.28;
                        var dir = new Vector3D(Math.cos(this.direction+angle)*dist, Math.sin(this.direction+angle)*dist, 0);
                        var dir2 = new Vector3D(Math.cos(this.direction+angle+1.5)*dist, Math.sin(this.direction+angle+1.5)*dist, 0).mult(this.spin*20);
                        var p = new Particles(pos.add(dir), new Vector3D(dir2.x, dir2.y, Math.random()*10+20), this.spin, this.velocity.magnitude()*8, 1.5, 1);
                        p.init();
                        game.addParticles(p);
                    }
                }

                if (!this.landed) {
                    this.acceleration.x += this.gravity*.25;
                    this.acceleration.y += this.gravity*.25;
                    this.acceleration.z -= this.gravity*.25;

                } else {
                    this.velocity.div(1.05);
                    this.spin /= 1.05;
                    if (this.spin < 0.001) {
                        this.stopped = true;
                        this.timer = 20;
                        this.spin = 0;
                        this.velocity.subtract(this.velocity);
                    }
                }
            } else {
                this.timer -= 1;
                if (this.timer <= 0) {
                        game.player = new Player(new Vector(this.position.x-30, this.position.y+40), new Vector(), assetMgr.getSprite("scientist"), game.bounds);
                        game.addEntity(game.player);
                }
            }
        }

        if (Math.floor(Math.random()*100) == 0) {
            var pos = new Vector3D(this.position.x, this.position.y, this.position.z-10);
            var dist = Math.random()*20+20;
            var angle = 2.9+Math.random()*.5;
            var dir = new Vector3D(Math.cos(this.direction+angle)*dist, Math.sin(this.direction+angle)*dist, 0);
            var dir2 = new Vector3D(Math.cos(this.direction+angle)*dist, Math.sin(this.direction+angle)*dist, 0).mult(.25);
            var p = new Particles(pos.add(dir), new Vector3D(dir2.x, dir2.y, Math.random()*10+20), Math.random()*10, 2+Math.random()*4, 3+Math.random()*2, Math.random()*10);
            p.init();
            game.addParticles(p);
        }
    }

    draw(ctx, dt) {
        this.elapsedTime += dt;
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
        this.sprite.drawSprite(ctx, this.elapsedTime, this.position.x, this.position.y, this.position.z, this.direction, this.bounce);   
    }
}