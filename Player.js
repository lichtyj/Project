class Player extends Living {
    constructor(position, velocity, sprite, bounds) {
        super(position, velocity, sprite, bounds);
        this.separation = 15;
        this.moveTo = new Vector();
        this.moveSpeed = 2;
        this.aiming = false;
        this.barrel = new Vector3D(8,-4, 0);
    }

    move(direction) {
        this.acceleration.add(direction).limit(1);
        var avgSep = new Vector();
        for (var other of game.entities) {
             if (!(other instanceof Projectile)) {
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
        this.acceleration.add(avgSep);
        this.acceleration.limit(3);
    }

    target(x, y) {
        this.facing.x = x;
        this.facing.y = y;
        this.facing.subtract(this.position);
    }

    shoot() {
        var temp = this.facing.clone().limit(1);
        temp.mult(20);
        var shot = new Projectile(this.position.offset(this.barrel), assetMgr.getAsset("particle"), new Vector3D(temp.x, temp.y, 0), 0, 0, 1, 0);
        game.addEntity(shot);
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration).limit(this.topSpeed);
        this.velocity.div(1.1);
        this.acceleration.mult(0);
        if (!this.aiming) this.facing.set(this.velocity);
    
        if (this.position.x < 0) this.position.x = this.bounds.x;
        if (this.position.y < 0) this.position.y = this.bounds.y;
        if (this.position.x > this.bounds.x) this.position.x = 0;
        if (this.position.y > this.bounds.y) this.position.y = 0;
    }
}