class Particles extends Entity{
    constructor(position, velocity) {
        super(position);
        this.position.x += 8;
        this.position.y += 8;
        this.velocity = velocity;
        this.acceleration = new Vector();
        this.elapsed = 0;
        this.particles = [];
        this.sprite;
        this.maxV = velocity.magnitude();

        this.force = 0;
        this.time = 1; // Emitter life
        this.timeP = 1; // Particle max life
        this.count = 10; // Initial burst
        this.rate = 0; // Particles per tick * % of life left
        
        this.hue = 0;
        this.hueR = 0; // Random
        this.hueV = 0; // hue + (V / maxV) * hueV
        this.hueT = 0; // End of life hue

        this.bright = 128;
        this.brightR = 0; // Random 
        this.brightV = 0; // brightness + (V / maxV) * brightV
        this.brightT = 0; // End of life brightness

        this.glow = false;
        this.shadow = false;

        this.mode = "normal";
        this.gravity = 0;
    }

    init() {
        if (this.velocity.z < 0) {
            this.velocity.z *= -1;
        }
        this.sprite = assetMgr.getAsset("particle");
        this.addParticles(this.count);
    }

    addParticles(amount) {
        for (var i = 0; i < amount; i++) {
            this.particles.push( { "position":this.position.clone(), 
                "velocity":this.velocity.clone().mult(Math.random()).add(Vector.random(this.force*(1-this.elapsed/this.time))),
                "acceleration":Vector.random(this.force*(1-this.elapsed/this.time)), 
                "time":this.timeP*Math.random(),
                "hue":(this.hue+Math.random()*this.hueR),
                "bright":(this.bright+Math.random()*this.brightR)} );
        }
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.div(1.1);

        if (this.elapsed < this.time) {
            this.elapsed++;
            this.addParticles(this.rate*(1-this.elapsed/this.time));
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
        ctx.globalCompositeOperation = this.mode;
        for (var i = 0; i < this.count; i++) {
            if (this.shadow) this.drawParticle(1, .125, ctx, i, true);
            this.drawParticle(1, 1, ctx, i, false);
            if (this.glow) {
                this.drawParticle(2, .2, ctx, i, false);
                this.drawParticle(7, .01, ctx, i, false);
            }
        }
    }

    drawParticle(size, alpha, ctx, i, shadow) {
        ctx.globalAlpha = alpha;
        var modV = (this.particles[i].velocity.magnitude() / this.maxV);
        var modT = 1-(this.particles[i].time / this.timeP);

        if (shadow) {
            ctx.drawImage(this.sprite, 0,
                0, 1, 1,
                this.particles[i].position.x-1-(size/2), 
                this.particles[i].position.y-1-(size/2),
                size, size);
        } else {
            ctx.drawImage(this.sprite, this.particles[i].hue + this.hueT*modT + this.hueV*modV,
                this.particles[i].bright + this.brightT*modT + this.brightV*modV, 1, 1,
                this.particles[i].position.x-1-(size/2), 
                this.particles[i].position.y-this.particles[i].position.z-1-(size/2),
                size, size);
        }
    }
} 