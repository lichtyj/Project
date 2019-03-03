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

        this.health = 100;
        this.maxhealth = 100;
        this.gun;

        this.canInteract = false;
        this.current = 0;
        this.inventory = [];
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
        this.acceleration.z = 0;
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
        console.log(other);
        if (typeof other == "number") other = {position:this.position, damage:other};
        this.health -= other.damage;
        var p = new Particles(this.position.clone(), Vector.up().mult(5));
        p.preset("blood");
        p.init();
        game.ui.drawRed += other.damage*4;
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
        if (other.timer < 0) {
            var type = other.type;
            other.emit();
            var i = this.checkInv(type);
            if (i != -1) {
                this.inventory[i].count++;
            } else {
                this.inventory.push({name:type, count:1});
            }
            other.remove();
        }
    }

    checkInv(type) {
        var ret = -1;
        for (var i = 0; i < this.inventory.length; i++) {
            if (this.inventory[i] != undefined && this.inventory[i].name == type) {
                ret = i;
                break;
            } 
        }
        return ret;
    }

    use() {
        if (this.inventory[this.current] != undefined && this.inventory[this.current].count > 0) {
            var type = this.inventory[this.current].name;
            switch(type) {
                case "rawMeat":
                    this.takeDamage(10);
                    this.inventory[this.current].count--;
                    break;
                case "cookedMeat":
                    if (this.health < this.maxhealth) {
                        this.heal(25);
                        this.inventory[this.current].count--;
                    } else {
                        game.ui.inventoryMessage("Not hungry", "#F00");
                    }
                    break;
                case "ingot":
                    console.error("Implement build menu");
                    break;
            }
            if (this.inventory[this.current].count == 0) {
                this.inventory.splice(this.current--,1);
            }
        }        
    }

    drop() {
        if (this.inventory[this.current] != undefined && this.inventory[this.current].count > 0) {
            var type = this.inventory[this.current].name;
            this.inventory[this.current].count--;
            var item = new Resource(this.position.clone(), type, Math.random()*Math.PI,0);
            item.velocity.set(Vector.random(2));
            item.timer = 180;
            game.addEntity(item);
            if (this.inventory[this.current].count == 0) {
                this.inventory.splice(this.current--,1);
            }
        }
    }

    inventoryScroll(dir) {
        this.current += dir;
        if (this.current >= this.inventory.length) this.current -= this.inventory.length;
        if (this.current < 0) this.current += this.inventory.length;
        if (this.current > -1) game.ui.inventoryMessage(this.inventory[this.current].name);
    }

    draw(ctx, dt) {
        super.draw(ctx, dt);
        super.drawHealth(ctx);
    }

}