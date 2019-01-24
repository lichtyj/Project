class Player extends Living {
    constructor(position, velocity, sprite, bounds) {
        super(position, velocity, sprite, bounds);
        this.separation = 15;
        this.moveTo = new Vector();
        this.moveSpeed = 2;
    }

    move(direction) {
        //if (Vector.distance(this.position, this.moveTo) > 50) {
        //    var direction = this.moveTo.clone().subtract(this.position);
            this.acceleration.add(direction).limit(1);
        //}
        var avgSep = new Vector();
        for (var other of game.entities) {
            if (!(other instanceof Particles)) {
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

    update() {
        //this.move();
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration).limit(this.topSpeed);
        this.velocity.div(1.1);
        this.acceleration.mult(0);
    
        if (this.position.x < 0) this.position.x = this.bounds.x;
        if (this.position.y < 0) this.position.y = this.bounds.y;
        if (this.position.x > this.bounds.x) this.position.x = 0;
        if (this.position.y > this.bounds.y) this.position.y = 0;
    }
}