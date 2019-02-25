class GameEngine {
    constructor(ctx) {
        GameEngine.prototype.entities = [];
        GameEngine.prototype.ctx = ctx;
        GameEngine.prototype.lastFrame = 0;
        GameEngine.prototype.dt = 0;
        GameEngine.prototype.step = 1/60;
        GameEngine.prototype.click = new Vector();
        GameEngine.prototype.mouse = new Vector();
        GameEngine.prototype.viewWidth = ctx.canvas.width;
        GameEngine.prototype.viewHeight = ctx.canvas.height;
        GameEngine.prototype.running = true;
        GameEngine.prototype.player;
        GameEngine.prototype.viewAngle = 0;
    }
    
    init() {
        console.log("Initialized");
        GameEngine.prototype.startInput();
        window.requestAnimFrame(GameEngine.prototype.gameLoop);
    }

    startInput() {
        console.log('Starting input');

        var getXandY = function (e) {
            return new Vector(e.clientX - that.ctx.canvas.getBoundingClientRect().left,
                              e.clientY - that.ctx.canvas.getBoundingClientRect().top);
        }

        var that = this;

        this.ctx.canvas.addEventListener("mouseup", function (e) {
            var v = getXandY(e);
            that.click = v;
            if (GameEngine.prototype.player == undefined) {
                GameEngine.prototype.player = new Player(new Vector(400,400), new Vector(0,0), assetMgr.getSprite("dudeGreen"), new Vector(GameEngine.prototype.viewWidth, GameEngine.prototype.viewHeight));
                that.addEntity(GameEngine.prototype.player);
            } else {
                GameEngine.prototype.player.moveTo = v;
            }
        }, false);

        /*  AVOID IF POSSIBLE
        this.ctx.canvas.addEventListener("mousemove", function (e) {
            that.mouse = getXandY(e);
        }, false);
/*        */
        this.ctx.canvas.addEventListener("mousewheel", function (e) {
            that.viewAngle -= e.deltaY/1000;
            if (that.viewAngle < 0) that.viewAngle = 0;
            if (that.viewAngle > 1) that.viewAngle = 1;
        }, false);

        document.addEventListener("keypress", function(e) {
            //TODO pull this out into another class
            console.log(e.code + " " + e.keyCode);
            // W
            if (e.keyCode === 119)  GameEngine.prototype.player.move(new Vector(0,-1));
            // A
            if (e.keyCode === 97) GameEngine.prototype.player.move(new Vector(-1,0));
            // S
            if (e.keyCode === 115) GameEngine.prototype.player.move(new Vector(0,1));
            // D
            if (e.keyCode === 100) GameEngine.prototype.player.move(new Vector(1,0));
            if (e.keyCode === 113) GameEngine.prototype.running = false;
            if (e.keyCode === 102) {
                var spr = assetMgr.getSprite("chicken")
                for (var i = 0; i < 25; i++) {
                    that.addEntity(new Living(new Vector(Math.random()*GameEngine.prototype.viewWidth, Math.random()*GameEngine.prototype.viewHeight), Vector.random(3), spr, new Vector(GameEngine.prototype.viewWidth, GameEngine.prototype.viewHeight), 100));
                }
            }
            if (e.keyCode === 103) {
                var type;
                for (var i = 0; i < 25; i++) {
                    switch (Math.floor(Math.random()*3)) {
                        case 0:
                            type = "bush";
                            break;
                        case 1: 
                            type = "tree";
                            break;
                        case 2: 
                            type = "rock";
                            break;
                    }
                    that.addEntity(new Object(new Vector(Math.floor(Math.random()*GameEngine.prototype.viewWidth), Math.floor(Math.random()*GameEngine.prototype.viewHeight)), type, Math.random()*Math.PI*2));
                }
            }
        })
        console.log('Input initiated');
    }
    
    gameLoop() {
        var current = performance.now();
        GameEngine.prototype.dt += Math.min(1, (current - GameEngine.prototype.lastFrame) / 1000);   // duration capped at 1 sec
        while(GameEngine.prototype.dt > GameEngine.prototype.step) {
            GameEngine.prototype.dt -= GameEngine.prototype.step;
            GameEngine.prototype.update(GameEngine.prototype.step);
            GameEngine.prototype.draw(GameEngine.prototype.step);
        }
        GameEngine.prototype.draw(GameEngine.prototype.dt);
        GameEngine.prototype.lastFrame = current;
        if (GameEngine.prototype.running) window.requestAnimFrame(GameEngine.prototype.gameLoop);
    }

    update() {
        var entitiesCount = this.entities.length;
        for (var i = 0; i < entitiesCount; i++) {
            this.entities[i].update(this.entities);    
        }
    }
    
    draw(dt) {
        //this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = "#559061";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.save();
        this.entities.sort(function(a,b) {return a.position.y-b.position.y})
        for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].draw(this.ctx, dt);
        }
        this.ctx.restore();
    }    
}



GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
}