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

        this.vision = Math.random()*50+50;
        this.separation = Math.random()*50+10;
        this.sprint = Math.random()+1;
        this.topSpeed = Math.random()*2+1;
        this.foodSprint = Math.random()*this.vision;
        this.life = 100;
        this.energy = 1000;
        this.hunt = false;
    }

    update() {
        if (this.energy <= 0) {
            this.life -= 1;
        } else {
            this.energy -= this.velocity.magnitude();
        }
        this.flock(game.entities);

        this.position.add(this.velocity);
        this.velocity.add(this.acceleration.limit(this.sprint)).limit(this.topSpeed);
    
        if (this.position.x < 0) this.position.x = this.bounds.x;
        if (this.position.y < 0) this.position.y = this.bounds.y;
        if (this.position.x > this.bounds.x) this.position.x = 0;
        if (this.position.y > this.bounds.y) this.position.y = 0;
        if (this.life <= 0) {
            this.die();
        }
    }

    die() {
        game.remove(this);
        game.addEntity(new Resource(this.position.add(Vector.random(25)), assetMgr.getSprite("meat"), Math.random()*Math.PI*2));
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
                        avgSep.add(sep).mult(2);
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
}

Living.prototype.draw = function (ctx, dt) {
    if (this.sprite instanceof Sprite3D) {
        //this.sprite.drawSprite(ctx, (this.position.x | 0), (this.position.y | 0), this.velocity.angle());   If on OSX
        var bounce = this.velocity.magnitude()/this.topSpeed;
        this.sprite.drawSprite(ctx, dt, this.position.x, this.position.y, this.velocity.angle(), bounce);   
    } else { 
        this.sprite.drawSubImage(0, ctx, this.position.x, this.position.y, this.velocity.angle());       
    }
}