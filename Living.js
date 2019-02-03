class Living extends Entity {
    constructor(position, velocity, sprite, bounds) {
        super(position, sprite);
        if (velocity instanceof Vector) {
            this.velocity = velocity;
        } else {
            console.error("Invalid argument")
            this.velocity = new Vector();
        }
        this.bounds = bounds;

        this.vision = Math.random()*100+100;
        this.visionCone = Math.PI*(1+Math.random());
        this.separation = Math.random()*50+10;
        this.sprint = Math.random()+1;
        this.topSpeed = Math.random()*2+1;
        this.stalkSpeed = .5;
        this.speed;
        this.foodSprint = Math.random()*this.vision;
        this.life = 100;
        this.energy = 10000;
        this.hunt = false;
        this.bounce = 0;
        this.elapsedTime = 0;
        this.facing = new Vector();
    }

    perceptionCheck() {
        return game.tree.retrieve(this.position.x, this.position.y, this.vision, this.velocity.x, this.velocity.y, this.visionCone)
    }

    update() {
        if (this.energy <= 0) {
            this.life -= 1;
        } else {
            this.energy -= this.velocity.magnitude();
        }

        this.flock(this.perceptionCheck());

        this.position.add(this.velocity);
        this.acceleration.limit(this.sprint);
        if (this.acceleration.magnitude() > .1)
            this.velocity.add(this.acceleration);
        this.velocity.limit(this.topSpeed);
        this.facing.set(this.velocity);
    
        if (this.position.x < 0) this.position.x = this.bounds.x;
        if (this.position.y < 0) this.position.y = this.bounds.y;
        if (this.position.x > this.bounds.x) this.position.x = 0;
        if (this.position.y > this.bounds.y) this.position.y = 0;
        if (this.life <= 0) {
            this.die();
        }
    }

    die() {
        // var p = new Particles(new Vector(this.position.x, this.position.y, 6), new Vector(this.velocity.x, this.velocity.y, Math.random()*10+10), 20, 4, 0, 10);
        // p.init();
        // game.addParticles(p);
        game.addEntity(new Resource(this.position, assetMgr.getSprite("meat"), Math.random()*Math.PI*2));
        game.remove(this);
    }

    eat(food) {
        food.remove();
        this.energy += 100;
        this.hunt = false;
    }

    flock(entities) { // This is messy, fix it.

        var avg = new Vector();
        var avgSep = new Vector();
        var avgPos = new Vector();
        var total = 0;
        for (var other of entities) {
            var d = Vector.distance(this.position,other.position);
            if ((other instanceof Player || other instanceof Projectile) && d < 15) {
                if (other instanceof Projectile || other instanceof Particles) other.hit("blood");
                this.life = 0;
            } 
            if (other instanceof Resource && this.life > 0 && d < this.foodSprint) {
                if (d < 15) {
                    this.eat(other);
                } else {
                    this.hunt = true
                }
            }
            if (other != this && d < this.vision) {
                if (!(other instanceof Object || other instanceof Player)) {
                    avg.add(other.velocity);  // Orientation
                    avgPos.add(other.position); // Cohesion
                    total++;
                }
                if (d < this.separation && !(other instanceof Resource) ) { // Separation
                    var sep = this.position.clone();
                    sep.subtract(other.position).limit(0.5);
                    var rate = (this.separation - d)/this.separation;
                    sep.mult(Math.pow(rate,2));
                    avgSep.add(sep);
                    if (other instanceof Player) {
                        avgSep.add(sep).mult(3);
                    }
                } 
            }
        }
        if (total > 0) {
            avg.add(avgPos.div(total++).subtract(this.position).limit(1)); // Cohesion
            avg.div(total).subtract(this.velocity).limit(0.01); // Orientation
        }
        this.acceleration = avg;
        this.acceleration.add(avgSep); // Separation
        this.acceleration.limit(this.sprint);
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
            this.sprite.drawSprite(ctx, this.elapsedTime, this.position.x, this.position.y, 0/*this.position.z*/, this.facing.angle(), this.bounce, 8);   
        } else { 
            this.sprite.drawSubImage(0, ctx, this.position.x, this.position.y, this.facing.angle());       
        }
    }
}