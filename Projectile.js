class Projectile extends Entity {
    constructor(position, sprite, velocity, rate, force, hue, time) {
        super(position, sprite);
        this.acceleration = new Vector();
        this.rate = rate;
        this.hue = hue;
        this.velocity = velocity;
        this.time = time;
    }

    hit(mode, other) {
        // var explosion = new Effect(this.position, assetMgr.getSprite("mushroom"));
        // game.addEntity(explosion);
        var tempPos = this.position.clone();
        tempPos.x -= 8;
        tempPos.y -= 8;
        if (other != undefined) {
            tempPos.average(other.position, 2);
        }
        var that = this;
        mode.forEach( function(i) {
            var p = new Particles(tempPos, new Vector(that.velocity.x, that.velocity.y, -that.velocity.z));
            switch (i) {
                case "blood":
                    p.velocity.div(3);
                    // p.velocity.z *= .125;
                    p.force = 1;
                    p.count = 30;
                    p.rate = 10;
                    p.mode = "normal";
                    p.brightR = -64;
                    p.gravity = .25;
                    p.time = 10;
                    p.timeP = 30;
                    p.glow = false;
                    p.shadow = true;
                    break;
                case "feathers":
                    p.velocity.div(2);
                    p.velocity.z *= 2;
                    p.force = 1;
                    p.count = 30;
                    p.rate = 1;
                    p.mode = "normal";
                    p.bright = 255;
                    p.brightR = -16;
                    p.gravity = .0125;
                    p.time = 15;
                    p.timeP = 30;
                    p.glow = false;
                    p.shadow = true;
                    break;
                case "fire":
                    p.force = 40;
                    p.rate = 1;
                    p.mode = "screen";
                    p.hue = 0;
                    p.hueV = 40;
                    p.hueR = 10;
                    p.timeP = 3;
                    p.brightT = 0;
                    p.glow = true;
                    break;
                default:
                    p.velocity.div(3);
                    p.velocity.z *= -10;
                    p.gravity = .5;
                    p.force = .5;
                    p.count = 40;
                    p.rate = 40;
                    p.mode = "normal";
                    p.hue = 140;
                    p.brightV = 128;
                    p.bright = 192;
                    p.brightT = -128;
                    p.timeP = 3;
                    p.glow = true;
                    p.shadow = true;
                    break;
            }
            p.init();
            game.addEntity(p);
        });
        game.remove(this);
    }

    update(dt) {
        this.elapsedTime += dt;
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.div(1.01);
        this.acceleration.subtract(this.acceleration);
        this.acceleration.z -= .125;

        if (this.position.z < 0) {
            this.hit(["ground"]);
        }

        // if (this.elapsed < this.time) {
        //     this.elapsed++;
        //     for (var i = 0; i < this.rate*(1-this.elapsed/this.time); i++) {
        //         this.particles.push( { "position":this.position.clone(), "velocity":this.velocity.clone().mult(Math.random()).add(Vector.random(this.force*(1-this.elapsed/this.time))), "acceleration":Vector.random(this.force*(1-this.elapsed/this.time)), "time":10*Math.random() } );
        //     }
        // }
    }

    draw(ctx) {
        ctx.globalAlpha = 1;
        ctx.setTransform(1,0,0,1,0,0);
        ctx.strokeStyle = "#03b3ff";
        ctx.lineWidth = this.position.z/16+1;
        ctx.beginPath();
        ctx.moveTo(this.position.x - this.velocity.x*this.position.z/6, this.position.y - this.velocity.y*this.position.z/6 - this.position.z);
        ctx.lineTo(this.position.x, this.position.y-this.position.z);
        ctx.stroke();


        ctx.globalAlpha = .5;
        ctx.strokeStyle = "#333";
        ctx.lineWidth = this.position.z/12;
        ctx.beginPath();
        ctx.moveTo(this.position.x - this.velocity.x, this.position.y - this.velocity.y);
        ctx.lineTo(this.position.x, this.position.y);
        ctx.stroke();
        // ctx.drawImage(this.sprite, this.hue*2,
        //      0, 2, 2, 
        //      this.position.x, this.position.y-this.position.z,2,2);
    }

}