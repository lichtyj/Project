class Ship extends Entity {
    constructor(sprite, shadowSprite) {
        super();
        this.position = new Vector(150, 300, 0);
        this.velocity = new Vector();
        this.acceleration = new Vector();
        this.elapsedTime = 0;
        this.direction = 5.25;
        this.sprite = sprite;
        this.bounce = 0;
        this.spin = 0;
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

    fire() {
        var dist = 16;
        var angle = 2.6;
        var pos = this.position.clone();
        var dir = new Vector(Math.cos(this.direction+angle)*dist, Math.sin(this.direction+angle)*dist+6, 9);
        var p = new Particles(pos.add(dir), Vector.fromAngle(this.direction+Math.PI*.6).mult(5));
        p.preset("energy");
        p.count = Math.random()*5;
        p.hueR = 40;
        p.rate = 5;
        p.alpha = .75;
        p.brightR = 64;
        p.force = .75;
        p.time = 10;
        p.timeP = Math.random()*4+2;
        p.glow = true;
        p.gravity = 0;
        p.resistanceP = 1.01;
        p.init(); 
    }

    explode() {
        var dist = 16;
        var angle = 2.6;
        var pos = this.position.clone();
        var dir = new Vector(Math.cos(this.direction+angle)*dist, Math.sin(this.direction+angle)*dist+6, 9);
        var p = new Particles(pos.add(dir), Vector.fromAngle(this.direction+Math.PI*.6).mult(10));
        p.preset("fire");
        p.count = 60;
        p.hueR = 40;
        p.rate = 30;
        p.alpha = .75;
        p.brightR = 64;
        p.force = 1;
        p.time = 5;
        p.timeP = 30;
        p.glow = true;
        p.gravity = 0;
        p.resistanceP = 1.01;
        p.init(); 
    }

    checkCollisions() {
        var hit = game.tree.retrieve(this.position.x, this.position.y, 32, this.velocity.x, this.velocity.y, Math.PI*2);
        for (var h of hit) {
            if (h.takeDamage != undefined && !(h instanceof Player)) {
                h.takeDamage(this);
            }
        }
    }

    update(dt) {
        super.update();

        // console.log(this.position);

        this.direction += this.spin;

        switch(game.state) {
            case "ready":
                break;
            case "flying":
                this.position.z = Math.sin(this.elapsedTime*4)*5;
                this.gravity = 0;
                break;
            case "mayday":
                if (this.spin == 0) {
                    this.explode();
                }
                this.acceleration.add(Vector.fromAngle(this.direction-Math.PI/2).mult(0.1));
                game.ui.drawRed += 1.33;
                this.spin = 0.04;
                this.fire();
                break;
            case "falling":
                if (this.gravity == 0) {
                    this.gravity = .125;
                    this.position.z = 140;
                    this.spin = 0.09;
                    this.velocity = new Vector(40,20,-1);
                    game.cameraOffset.x = 17;
                    game.cameraOffset.y = -12;
                    game.cameraTarget = this;
                }
                if (this.position.z <= 0) game.state = "impact";
                this.acceleration.x += .25;
                this.acceleration.y += .25;
                this.smoke();
                break;
            case "impact":
                this.smoke();
                this.velocity.div(1.015);
                this.spin /= 1.05;
                game.ui.drawRed += (1+this.spin);
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
                    var dir2 = new Vector(Math.cos(this.direction+angle)*dist, Math.sin(this.direction+angle)*dist, -Math.random()*10-10).mult(this.spin*8);
                    var p = new Particles(pos.add(dir), dir2);
                    p.preset("ground");
                    p.count =  this.spin*this.spin*10000;
                    p.rate = 1;//this.spin/8;
                    p.timeP = 20;
                    p.force = .75;
                    p.resistanceP = 1.05;
                    p.init();
                }
                break;
            case "landed":
                this.smoke();
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
                this.smoke();
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