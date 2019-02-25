class Ship extends Entity {
    constructor(sprite, shadowSprite) {
        super();
        this.position = new Vector(0, 0, 90);
        this.velocity = new Vector(40,20,-1);
        this.acceleration = new Vector();
        this.elapsedTime = 0;
        this.direction = 0;
        this.sprite = sprite;
        this.bounce = 0;
        this.spin = 0.09;
        this.landed = false;
        this.stopped = false;
        this.shadowSprite = shadowSprite;
        this.timer = 0;
        this.particles;
        this.imgData;
        this.i = 0;
        this.damage = 100000;
    }

    smoke() {
        var dist = 16;
        var angle = 2.6;
        var pos = this.position.clone();
        var dir = new Vector(Math.cos(this.direction+angle)*dist, Math.sin(this.direction+angle)*dist+6, 9);
        var p = new Particles(pos.add(dir), this.velocity.clone());
        p.count = Math.random()*5;
        p.alpha = .75;
        p.force = .25;
        p.bright = 0;
        p.time = 10;
        p.timeP = Math.random()*4+2;
        p.glow = true;
        p.gravity -= .125;
        p.init();    
    }

    checkCollisions() {
        var hit = game.tree.retrieve(this.position.x, this.position.y, 64, this.velocity.x, this.velocity.y, Math.PI*2);
        for (var h of hit) {
            if (h.takeDamage != undefined && !(h instanceof Player)) {
                h.takeDamage(this);
            }
        }
    }

    update(dt) {
        super.update();

        this.direction += this.spin;

        this.smoke();

        switch(game.state) {
            case "falling":
                if (this.position.z <= 0) game.state = "impact";
                break;
            case "impact":
                this.velocity.div(1.05);
                this.spin /= 1.05;
                this.checkCollisions();
                if (this.spin < 0.001) {
                    game.state = "landed";
                    this.timer = 10;
                    this.spin = 0;
                    this.velocity.subtract(this.velocity);
                }
                if (this.spin > 0.025) {
                    var pos = new Vector(this.position.x, this.position.y-3, 3);
                    var dist = 25+Math.random()*5;
                    var angle = 1.5+Math.random()*-.5;
                    var angle2 = .8+Math.random()*.6-.3;
                    var dir = new Vector(Math.cos(this.direction+angle-angle2)*dist, Math.sin(this.direction+angle-angle2)*dist, 3);
                    var dir2 = new Vector(Math.cos(this.direction+angle)*dist, Math.sin(this.direction+angle)*dist, -Math.random()*10-10).mult(this.spin*6);
                    var p = new Particles(pos.add(dir), dir2);
                    p.preset("ground");
                    p.count =  this.spin*this.spin*10000;
                    p.rate = 1;//this.spin/8;
                    p.timeP = 20;
                    p.force = this.velocity.magnitude()/3;
                    p.init();
                }
                break;
            case "landed":
                this.timer -= 1;
                if (this.timer <= 0) {
                    game.player = new Player(new Vector(this.position.x+17, this.position.y-12), assetMgr.getSprite("scientist"));
                    game.player.gun = new Weapon(game.player.position.clone());
                    game.player.gun.preset("railgun");
                    game.addEntity(game.player);
                    game.addEntity(game.player.gun);
                    game.cameraTarget = game.player;
                    game.cameraOffset.x = 0;
                    game.cameraOffset.y = 0;
                    game.state = "playing";
                }
                break;
            case "playing":
                break;  
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
        this.sprite.drawSprite(ctx, this.elapsedTime, this.position.x, this.position.y, this.position.z, this.direction, this.bounce);   
    }
}