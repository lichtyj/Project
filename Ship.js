class Ship {
    constructor(sprite, shadowSprite) {
        this.position = new Vector(0, 0, 200);
        this.velocity = new Vector(10,10,-1);
        this.acceleration = new Vector();
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
        this.particles;
        this.imgData;
        this.i = 0;
    }

    update(dt) {

        //this.sendMessage("draw", this.i++);

        this.direction += this.spin;
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.div(1.1);
        this.acceleration.subtract(this.acceleration);

        var pos = new Vector(this.position.x, this.position.y, 3);
        var dist = Math.random()*30+5;
        var v = Vector.fromAngle(this.directions+1.5);

        var p = new Particles(pos.offset(Vector.fromAngle(this.direction), Vector.fromAngle(this.direction)), v);
        p.count = Math.random()*6+6;
        p.alpha = .75;
        p.force = .125;
        p.bright = 0;
        p.time = 6;
        p.timeP = Math.random()*4+2;
        p.glow = true;
        p.gravity -= .125;
        p.init();

        if (game.player == undefined) { /// TODO pull this out into an animation method and increment a 'stages' variable instead of all these bools
            if (!this.stopped) {
                if (this.position.z < 0) {
                    console.log("Landed");
                    this.position.z = 0;
                    this.landed = true;
                    if (this.spin > 0.007) {
                        var pos = new Vector(this.position.x, this.position.y, 3);
                        var dist = Math.random()*30+15;
                        var angle = 3.3+Math.random()*.28;
                        var dir = new Vector(Math.cos(this.direction+angle)*dist, Math.sin(this.direction+angle)*dist, 0);
                        var dir2 = new Vector(Math.cos(this.direction+angle+1.8)*dist, Math.sin(this.direction+angle+1.8)*dist, -Math.random()*10).mult(this.spin*6);
                        
                        var p = new Particles(pos.add(dir), dir2);
                        p.rate = this.spin;
                        p.force = this.velocity.magnitude()/8;
                        p.hue = 30;
                        p.time = 6;
                        p.init();
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
                        game.player.gun = new Weapon(game.player.position.clone());
                        game.player.gun.preset("railgun");
                        game.addEntity(game.player);
                        game.addEntity(game.player.gun);
                }
            }
        }

        if (Math.floor(Math.random()*100) == 0) {
            var pos = new Vector(this.position.x, this.position.y, this.position.z-10);
            var dist = Math.random()*20+20;
            var angle = 2.9+Math.random()*.5;
            var dir = new Vector(Math.cos(this.direction+angle)*dist, Math.sin(this.direction+angle)*dist, 0);
            var dir2 = new Vector(Math.cos(this.direction+angle)*dist, Math.sin(this.direction+angle)*dist, 0).mult(.25);
            // TODO var p = new Particles(pos.add(dir), new Vector(dir2.x, dir2.y, Math.random()*10+20), Math.random()*10, 2+Math.random()*4, 3+Math.random()*2, Math.random()*10);
            //p.init();
            //game.addParticles(p);
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