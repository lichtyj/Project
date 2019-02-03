class Projectile extends Entity {
    constructor(position, sprite, velocity, rate, force, hue, time) {
        super(position, sprite);
        this.acceleration = new Vector();
        this.rate = rate;
        this.hue = hue;
        this.velocity = velocity;
        this.time = time;
    }

    hit(mode) {
        // var explosion = new Effect(this.position, assetMgr.getSprite("mushroom"));
        // game.addEntity(explosion);
        var tempPos = this.position.clone();
        tempPos.x -= 8;
        tempPos.y -= 8;
        var p;
        switch (mode) {
            case "blood":
                p = new Particles(tempPos, new Vector(this.velocity.x, this.velocity.y, -this.velocity.z), 40, 1, 0, 0, "multiply", 0, 3,0);
                break;
            case "fire":
                p = new Particles(tempPos, new Vector(this.velocity.x, this.velocity.y, -this.velocity.z), 40, 1, 0, 3, "normal", 0, 3,0);
                break;
            default:
                p = new Particles(tempPos, new Vector(this.velocity.x/3, this.velocity.y/3, -this.velocity.z*2), 40, 1, 7.7, 0, "screen", 0, 3,0);
                break;
        }
        p.init();
        game.addEntity(p);
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
            this.hit();
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