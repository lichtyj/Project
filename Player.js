class Player extends Living {
    constructor(position, velocity, sprite, bounds) {
        super(position, velocity, sprite, bounds);
        this.separation = 15;
        this.moveTo = new Vector();
        this.moveSpeed = 2;
        this.topSpeed = this.moveSpeed;
        this.aiming = false;
        this.target = new Vector();
        this.hand = new Vector(2,-3, 9);
        this.state = "default";
        this.gun;

        this.health = 100;
        this.maxhealth = 100;
    }

    move(direction) {
        this.acceleration.add(direction).limit(1);
        var avgSep = new Vector();
        for (var other of game.entities) {
             if (!(other instanceof Projectile || other instanceof Weapon || other instanceof Particles)) {
                var d = Vector.distance(this.position,other.position);
                if (other != this && d < this.separation) {
                    var sep = this.position.clone();
                    sep.subtract(other.position).limit(5);
                    var rate = (this.separation - d)/this.separation;
                    sep.mult(Math.pow(rate,2));
                    avgSep.add(sep);
                }
            }
        }
        if (!this.aiming && this.velocity.magnitude() > .5) this.facing.average(this.velocity, 4);
        this.acceleration.add(avgSep);
        this.acceleration.limit(3);
        this.position.z = 0;
    }

    setState(s) {
        if (s != this.state) {
            switch(this.state) { // Previous state
                case "aim":
                    this.aiming = false;
                    break;
                default:
                    break;
            }

            switch(s) { // New state - set movespeeds here
                case "aim":
                    this.aiming = true;
                    this.topSpeed = this.stalkSpeed;
                    break;
                default:
                    this.topSpeed = this.moveSpeed;
                    break;
            }
        }

        this.state = s;
    }

    setTarget(x, y) {
        this.target.x = x;
        this.target.y = y;
    }

    takeDamage(other) {
        this.health -= other.damage;
        var p = new Particles(this.position, new Vector(other.velocity.x, other.velocity.y, -other.velocity.z));
        p.preset("blood");
        p.init();
        if (this.health <= 0 && game.state == "playing") {
            game.state = "dead";
            game.fade = 100;
        }
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration).limit(this.topSpeed);
        this.velocity.div(1.1);
        this.acceleration.mult(0);

        // terrain.setPos(this.position.x, this.position.y, 0, true); // Too slow, update to only render the changed spots

        if (this.aiming) {
            this.facing.x = (this.facing.x + this.target.x - this.position.x)*.5;
            this.facing.y = (this.facing.y + this.target.y - this.position.y)*.5;
        }
        
        this.position.z = 0;
        this.gun.carry(this.position.offset(this.facing, this.hand), this.facing);

        if (this.position.x < 0) this.position.x = this.bounds.x;
        if (this.position.y < 0) this.position.y = this.bounds.y;
        if (this.position.x > this.bounds.x) this.position.x = 0;
        if (this.position.y > this.bounds.y) this.position.y = 0;
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
        this.sprite.drawSprite(ctx, this.elapsedTime, this.position.x, this.position.y, this.position.z, this.facing.angle(), this.bounce, 8);   
        ctx.setTransform(1,0,0,1,0,0);
        if (this.health < this.maxhealth) {
            ctx.drawImage(this.healthBar, 0,
                128, 1, 1,
                this.position.x + 5 - (1-this.health/this.maxhealth)*10 - game.view.x, 
                this.position.y + 8 - game.view.y,
                (1-this.health/this.maxhealth)*10, 2);
            ctx.drawImage(this.healthBar, 80,
                128, 1, 1,
                this.position.x - 5 - game.view.x, 
                this.position.y + 8 - game.view.y,
                (this.health/this.maxhealth)*10, 2);
        }
    }

}