class Particles extends Entity{
    constructor(position, velocity, rate, force, hue, hueV, mode, time, timeP, gravity) {
        super(position);
        this.rate = rate;
        this.force = force/2;
        this.position.x += 8;
        this.position.y += 8;
        this.velocity = velocity;
        this.acceleration = new Vector();
        this.time = time;
        this.timeP = timeP;
        this.elapsed = 0;
        this.particles = [];
        this.sprite;
        this.spriteShadow;
        this.count = 10;
        this.hue = hue;
        this.hueV = hueV;
        this.mode = mode;
        this.gravity = gravity;
    }

    init() {
        if (this.velocity.z < 0) {
            this.velocity.z *= -1;
        }
        this.sprite = assetMgr.getAsset("particle");
        this.spriteShadow = assetMgr.getAsset("particleShadow");
        for (var i = 0; i < this.count; i++) {
            this.particles.push( { "position":this.position.clone(),
                                   "velocity":this.velocity.clone().mult(Math.random()).add(Vector.random(this.force)),
                                   "acceleration":Vector.random(this.force/20), 
                                   "time":this.timeP*Math.random(),
                                   "hue":(this.hue+Math.random()*this.hueV)} );
        }
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.div(1.1);

        if (this.elapsed < this.time) {
            this.elapsed++;
            for (var i = 0; i < this.rate*(1-this.elapsed/this.time); i++) {
                this.particles.push( { "position":this.position.clone(), 
                                       "velocity":this.velocity.clone().mult(Math.random()).add(Vector.random(this.force*(1-this.elapsed/this.time))),
                                       "acceleration":Vector.random(this.force*(1-this.elapsed/this.time)), 
                                       "time":this.timeP*Math.random(),
                                       "hue":(this.hue+Math.random()*this.hueV)} );
            }
        }

        this.count = this.particles.length
        for (var i = this.count-1; i >= 0; i--) {
            this.particles[i].acceleration.z -= this.gravity;
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
                this.particles[i].position = new Vector(0, 0, 0);
                this.particles.splice(i, 1);
                this.count--;
            }
        }
        if (this.count == 0) {
            game.remove(this);
        }

    }

    draw(ctx) {
        ctx.setTransform(1,0,0,1,0,0);
        ctx.globalAlpha = 1;
        for (var i = 0; i < this.count; i++) {
            ctx.globalCompositeOperation = this.mode;
            
            var mod = this.particles[i].velocity.magnitude();
            mod /= 5;
            ctx.globalAlpha = 1;
            ctx.drawImage(this.sprite, this.particles[i].hue + mod, 0, 1, 1, this.particles[i].position.x-1, this.particles[i].position.y-this.particles[i].position.z/2-1,1,1);
            ctx.globalAlpha = .3;
            ctx.drawImage(this.sprite, this.particles[i].hue + mod, 0, 1, 1, this.particles[i].position.x-2, this.particles[i].position.y-this.particles[i].position.z/2-2,3,3);
            ctx.globalAlpha = .05;
            ctx.drawImage(this.sprite, this.particles[i].hue + mod, 0, 1, 1, this.particles[i].position.x-5, this.particles[i].position.y-this.particles[i].position.z/2-5,8,8);
        }
    }
} 