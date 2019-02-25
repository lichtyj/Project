class Object extends Entity {
    constructor(position, type, rotation) {
        super(position, assetMgr.getSprite(type));
        this.rotation = rotation;
        this.elapsedTime = 0;
        this.type = type;
    }

    takeDamage(other) {
        switch(this.type) {
            case "rock":
                var item;
                for (var i = 0; i < Math.random()*3; i++) {
                    item = new Resource(this.position.clone(), "ingot", Math.random()*Math.PI*2);
                    item.velocity = Vector.random(1);
                    item.velocity.z = -Math.random()*2;
                    game.addEntity(item);
                    console.log(item);
                }
                var vel = Vector.up().mult(3);
                vel.average(other.velocity.clone(), 2);
                vel.mult(2);
                var p = new Particles(this.position.clone(), vel);
                p.preset("collect");
                p.count *= 3;
                p.force *= 10;
                p.hue = 256;
                p.init();
                p.glow = true;
                p.shadow = true;
                p.resistanceP = 1.1;
                game.remove(this);
                break;
            case "tree":
                if (other.damage > 100) {
                    var vel = Vector.up().mult(5);
                    vel.average(other.velocity.clone(), 2);
                    vel.mult(2);
                    var p = new Particles(this.position.clone(), vel);
                    p.preset("ground");
                    p.count *= 5;
                    p.rate *= 5;
                    p.force *= 2;
                    p.init();
                    p.glow = true;
                    p.shadow = true;
                    p.resistanceP = 1.1;
                    game.remove(this);   
                }
                break;
            case "tree2":
                if (other.damage > 100) {
                    var vel = Vector.up().mult(5);
                    vel.average(other.velocity.clone(), 2);
                    vel.mult(2);
                    var p = new Particles(this.position.clone(), vel);
                    p.preset("ground");
                    p.count *= 5;
                    p.rate *= 5;
                    p.force *= 2;
                    p.init();
                    p.glow = true;
                    p.shadow = true;
                    p.resistanceP = 1.1;
                    game.remove(this);   
                }
                break;
            case "bush":
                if (other.damage > 50) {
                    var vel = Vector.up().mult(2);
                    vel.average(other.velocity.clone(), 2);
                    vel.mult(2);
                    var p = new Particles(this.position.clone(), vel);
                    p.preset("ground");
                    p.count *= 2;
                    p.rate *= 2;
                    p.force *= 1;
                    p.init();
                    p.glow = true;
                    p.shadow = true;
                    p.resistanceP = 1.1;
                    game.remove(this);   
                }
                break;
        }
    }



    draw(ctx, dt) {
        //TODO bake this?
        this.elapsedTime += dt;
        if (this.sprite instanceof Sprite3D) {
            this.sprite.drawSprite(ctx, this.elapsedTime, this.position.x, this.position.y, 0/*this.position.z*/, this.rotation, 0.25, true);   
        }
    }
}