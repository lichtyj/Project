class Player extends Entity {
    constructor(position, sprite) {
        super(position, sprite);
        this.separation = 15;
        this.moveTo = new Vector();
        this.moveSpeed = 2;
        this.stalkSpeed = 1
        this.topSpeed = this.moveSpeed;
        this.aiming = false;
        this.target = new Vector();
        this.hand = new Vector(2,-3, 9);
        this.state = "default";
        this.separation = 15;

        this.facing = new Vector();
        this.bounce = 0;
        this.elapsedTime = 0;
        this.drawRed = 0;
        this.healthBar = assetMgr.getAsset("particle");

        this.health = 100;
        this.maxhealth = 100;
        this.inventory = [];
        this.gun;
    }

    move(direction) {
        this.acceleration.add(direction).limit(1);
        var avgSep = new Vector();
        for (var other of game.entities) {
             if (!(other instanceof Projectile || other instanceof Weapon || other instanceof Particles)) {
                var d = Vector.distance(this.position,other.position);
                if (other instanceof Resource && d < this.separation) {
                    this.collect(other);
                } else if (other != this && d < this.separation) {
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
        var p = new Particles(this.position.clone(), Vector.up().mult(5));
        p.preset("blood");
        p.init();
        this.drawRed += other.damage*2;
        if (this.health <= 0 && game.state == "playing") {
            game.state = "dead";
            game.fade = 50;
        }
    }

    heal(amount) {
        this.health += amount;
        if (this.health > this.maxhealth) this.health = this.maxhealth;
    }

    update() {
        super.update();
        if (this.aiming) {
            this.facing.x = (this.facing.x + this.target.x - this.position.x)*.5;
            this.facing.y = (this.facing.y + this.target.y - this.position.y)*.5;
        }
        this.gun.carry(this.position.offset(this.facing, this.hand), this.facing);
    }

    collect(other) {
        var type = other.type;
        var canStore = false;
        other.remove();
        var p = new Particles(other.position.clone(), Vector.up().mult(3));
        p.preset("collect");
        switch(type) {
            case "meat":
                p.hue = 60;
                this.takeDamage({damage:10});
                break;
            case "cookedMeat":
                p.hue = 0;
                p.bright = 192;
                this.heal(10);
                break;
            case "ingot":
                p.hue = 43;
                canStore = true;
                break;
            case "dna":
                p.hue = 180;
                canStore = true;
                break;
        }
        p.init();
        if (canStore) {
            if (this.inventory[type] == undefined) {
                this.inventory[type] = 1;
            } else {
                this.inventory[type]++;
            }
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
        this.sprite.drawSprite(ctx, this.elapsedTime, this.position.x, this.position.y, this.position.z, this.facing.angle(), this.bounce, 8);   
        ctx.setTransform(1,0,0,1,0,0);
        if (this.drawRed > 0) {
            ctx.fillStyle = "#F00";
            if (this.drawRed > 25) this.drawRed = 25;
            ctx.globalAlpha = (this.drawRed--/100);
            ctx.fillRect(0,0, game.viewWidth, game.viewHeight);
        }

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