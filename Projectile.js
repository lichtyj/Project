class Projectile extends Entity {
    constructor(position, velocity) {
        super(position);
        this.acceleration = new Vector();
        this.color = "#333";
        this.velocity = velocity;
        this.type = "";
        this.gravity = 0;
        this.size = 2;
        this.damage = 1;
        this.impact = true;
    }

    hit(mode, other) {
        var tempPos = this.position.clone();
        if (other != undefined) {
            tempPos.average(other, 2);
        }
        if (this.impact) {
            var that = this;
            mode.forEach( function(i) {
                var p = new Particles(tempPos, new Vector(that.velocity.x, that.velocity.y, -that.velocity.z));
                switch (i) {
                    case "blood":
                        p.velocity.div(3);
                        // p.velocity.z *= .125;
                        p.preset("blood");
                        break;
                    case "feathers":
                        p.velocity.div(2);
                        p.velocity.z *= 2;
                        p.preset("feathers");
                        break;
                    case "fire":
                        p.velocity.div(10);
                        p.velocity.z *= 2;
                        p.preset("fire");
                        break;
                    case "energy":
                        p.velocity.div(3);
                        p.velocity.z *= 10;
                        p.preset("energy");
                        break;
                    case "laser":
                        p.preset("laser");
                        break;
                    default:
                        p.velocity.div(2);
                        p.velocity.z *= 5;
                        p.preset("ground");
                        break;
                }
                p.init();
            });
    
        }
        game.remove(this);
    }

    update(dt) {
        this.elapsedTime += dt;
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.div(1.01);
        this.acceleration.subtract(this.acceleration);
        this.acceleration.z -= this.gravity;

        if (this.position.x < 0) this.position.x = game.bounds.x;
        if (this.position.y < 0) this.position.y = game.bounds.y;
        if (this.position.x > game.bounds.x) this.position.x = 0;
        if (this.position.y > game.bounds.y) this.position.y = 0;

        if (this.position.z < 0) {
            if (this.size >= 0) {
                this.hit([this.type, "ground"]);
            } else {
                game.remove(this);
            }
        }
    }

    draw(ctx) {
        if (this.size >= 0) {
            ctx.globalAlpha = 1;
            ctx.setTransform(1,0,0,1,0,0);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.position.z/32+this.size;
            ctx.beginPath();
            ctx.moveTo(this.position.x - this.velocity.x*this.position.z/6 - game.view.x, this.position.y - this.velocity.y*this.position.z/6 - this.position.z - game.view.y);
            ctx.lineTo(this.position.x - game.view.x, this.position.y-this.position.z - game.view.y);
            ctx.stroke();


            ctx.globalAlpha = .75;
            ctx.strokeStyle = "#333";
            ctx.lineWidth = this.position.z/12;
            ctx.beginPath();
            ctx.moveTo(this.position.x - this.velocity.x - game.view.x, this.position.y - this.velocity.y - game.view.y);
            ctx.lineTo(this.position.x - game.view.x, this.position.y - game.view.y);
            ctx.stroke();
        }
    }

}