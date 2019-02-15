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
        this.healthBar = assetMgr.getAsset("particle");
        this.vision = Math.random()*100+100;
        this.visionCone = Math.PI*(1+Math.random());
        this.separation = Math.random()*50+10;
        this.sprint = Math.random()+1;
        this.topSpeed = Math.random()*2+1;
        this.stalkSpeed = .5;
        this.speed;
        this.foodSprint = Math.random()*this.vision;
        this.life = 100;
        this.maxLife = 100;
        this.energy = 10000;
        this.hunt = false;
        this.bounce = 0;
        this.elapsedTime = 0;
        this.facing = new Vector();
        this.onFire = 0;
    }

    perceptionCheck() {
        return game.tree.retrieve(this.position.x, this.position.y, this.vision, this.velocity.x, this.velocity.y, this.visionCone)
    }

    update() {
        if (this.life <= 0) this.die();
        
        super.update();
        this.flock(this.perceptionCheck());
        this.facing.set(this.velocity);

        if (this.energy <= 0) {
            this.life -= 1;
        } else {
            this.energy -= this.velocity.magnitude();
        }

        if (this.onFire) {
            if (Math.random()*2 | 0) {
                var p = new Particles(new Vector(this.position.x, this.position.y - (Math.random()*4+2), 0), new Vector(this.velocity.x, this.velocity.y, 0));
                p.preset("fire");
                p.rate = 1;
                p.init();
            }
            this.onFire -= .01;
            if (this.onFire < 0) this.onFire = 0;
            this.life -= this.onFire/100;
        }        
    }

    die() {
        if (this.onFire > 0) {
            game.addEntity(new Resource(this.position, assetMgr.getSprite("cookedMeat"), Math.random()*Math.PI*2));
        } else {
            game.addEntity(new Resource(this.position, assetMgr.getSprite("meat"), Math.random()*Math.PI*2));
        }
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
                if (other instanceof Projectile || other instanceof Particles) {
                    this.life -= other.damage;
                    if (other instanceof Projectile) {
                        if (other.size >= 0)
                            other.hit(["feathers", "blood"], this.position.clone());
                        if (other.type == "fire" || other.type == "plasma") {
                            this.onFire += Math.random()*5;
                        }
                    }
                }
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
            this.sprite.drawSprite(ctx, this.elapsedTime, this.position.x, this.position.y, this.position.z, this.facing.angle(), this.bounce, 8);   
        } else { 
            this.sprite.drawSubImage(0, ctx, this.position.x, this.position.y, this.facing.angle());       
        }
        ctx.setTransform(1,0,0,1,0,0);
        if (this.life < this.maxLife) {
            ctx.drawImage(this.healthBar, 0,
                128, 1, 1,
                this.position.x + 5 - (1-this.life/this.maxLife)*10, 
                this.position.y + 8,
                (1-this.life/this.maxLife)*10, 2);
            ctx.drawImage(this.healthBar, 80,
                128, 1, 1,
                this.position.x - 5, 
                this.position.y + 8,
                (this.life/this.maxLife)*10, 2);
        }
    }
}