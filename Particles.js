class Particles {
    constructor(position, velocity, rate, force, hue, time) {
        this.rate = rate;
        this.force = force/2;
        this.position = position;
        this.position.x += 8;
        this.position.y += 8;
        this.velocity = velocity;
        this.acceleration = new Vector3D();
        this.time = time;
        this.elapsed = 0;
        this.particles = [];
        this.sprite;
        this.spriteShadow;
        this.count = 10;
        this.hue = hue;
    }

    init() {
        if (this.velocity.z < 0) {
            this.velocity.z *= -1;
        }
        this.sprite = assetMgr.getAsset("particle");
        this.spriteShadow = assetMgr.getAsset("particleShadow");
        for (var i = 0; i < this.count; i++) {
            this.particles.push( { "position":this.position.clone(), "velocity":this.velocity.clone().mult(Math.random()).add(Vector3D.random(this.force)), "acceleration":Vector3D.random(this.force/20), "time":10*Math.random() } );
        }
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.div(1.1);

        if (this.elapsed < this.time) {
            this.elapsed++;
            for (var i = 0; i < this.rate*(1-this.elapsed/this.time); i++) {
                this.particles.push( { "position":this.position.clone(), "velocity":this.velocity.clone().mult(Math.random()).add(Vector3D.random(this.force*(1-this.elapsed/this.time))), "acceleration":Vector3D.random(this.force*(1-this.elapsed/this.time)), "time":10*Math.random() } );
            }
        }

        this.count = this.particles.length
        for (var i = this.count-1; i >= 0; i--) {
            this.particles[i].acceleration.z -= 1;
            this.particles[i].velocity.add(this.particles[i].acceleration);
            this.particles[i].position.add(this.particles[i].velocity);
            this.particles[i].velocity.div(1.1);
            if (this.particles[i].position.z < 0) {
                this.particles[i].position.z = 0;
                if (this.particles[i].velocity.z < 0) {
                    this.particles[i].velocity.z *= -.8;
                }
            }
            this.particles[i].acceleration.mult(0);
            this.particles[i].time -= .1;
            if (this.particles[i].time <= 0) {
                this.particles[i].position = new Vector3D(0, 0, 0);
                this.particles.splice(i, 1);
                this.count--;
            }
        }
        if (this.count == 0) {
            game.removeParticles(this);
        }

    }

    draw(ctx) {
        ctx.globalAlpha = .25;
        for (var i = 0; i < this.count; i++) {
            if (this.particles[i].position.z > 1) {
                ctx.globalCompositeOperation = "multiply";
                ctx.drawImage(this.spriteShadow, this.particles[i].position.x-1, this.particles[i].position.y-1);
            }
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "normal";
        for (var i = 0; i < this.count; i++) {
            //ctx.globalCompositeOperation = "screen";
            ctx.drawImage(this.sprite, this.hue*2, 0, 2, 2, this.particles[i].position.x-1, this.particles[i].position.y-this.particles[i].position.z/2-1,2,2);
        }
    }
}