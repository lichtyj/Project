class GameEngine {
    constructor(ctx) {
        this.entities = [];
        this.particles = [];
        this.ctx = ctx;
        this.lastFrame = 0;
        this.dt = 0;
        this.step = 1/60;
        this.click = new Vector();
        this.mouse = new Vector();
        this.surfaceWidth = ctx.canvas.width;
        this.surfaceHeight = ctx.canvas.height;
        this.player;
        this.viewAngle = 1;
        this.bounds = new Vector(this.surfaceWidth, this.surfaceHeight);


        this.examine;
    }
    init() {
        console.log("Initialized");
        this.startInput();
        window.requestAnimationFrame(game.gameLoop);
        this.addEntity(new Ship(assetMgr.getSprite("ship"),assetMgr.getAsset("shipShadow")));
    }

    gameLoop() {
        var current = performance.now();
        game.dt += Math.min(1, (current - game.lastFrame) / 1000);   // duration capped at 1 sec
        while(game.dt > game.step) {
            game.dt -= game.step;
            game.update(game.step);
            game.draw(game.step);
        }
        game.draw(game.dt);
        game.lastFrame = current;
        window.requestAnimationFrame(game.gameLoop);
    }

    startInput() {
        console.log('Starting input');

        var getXandY = function (e) {
            return new Vector(e.clientX - that.ctx.canvas.getBoundingClientRect().left,
                              e.clientY - that.ctx.canvas.getBoundingClientRect().top);
        }

        var that = this;
        
        // AVOID IF POSSIBLE*///////////////////////////////////////
        // this.ctx.canvas.addEventListener("mousemove", function (e) {
        //     that.examine.rotation = that.examine.position.angleTo(getXandY(e));
        //     that.mouse = getXandY(e);
        // }, false);
        //AVOID IF POSSIBLE *///////////////////////////////////////

        document.addEventListener("keydown", function(e) {
            console.log(e.code + ": down " + e.keyCode);
            controls.keyDown(e.keyCode); ///////////////////////////////////////////// CONTROLS
        });

        document.addEventListener("keyup", function(e) {
            console.log(e.code + ": up " + e.keyCode);
            controls.keyUp(e.keyCode); ///////////////////////////////////////////// CONTROLS
        });
        console.log('Input initiated');
    }

    update() {
        controls.actions();
        var entitiesCount = this.entities.length;
        for (var i = entitiesCount-1; i >= 0; i--) {
            this.entities[i].update();    
        }
        var particlesCount = this.particles.length;
        for (var i = particlesCount-1; i >= 0; i--) {
            this.particles[i].update();    
        }
    }

    draw(dt) {
        var tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.ctx.canvas.width;
        tempCanvas.height = this.ctx.canvas.height;
        var tempCtx = tempCanvas.getContext('2d');
        tempCtx.fillStyle = "#559061";
        tempCtx.fillRect(0, 0, tempCtx.canvas.width, tempCtx.canvas.height);
        tempCtx.save();
        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].draw(tempCtx, dt);
        }
        tempCtx.restore();
        tempCtx.save();
        this.entities.sort(function(a,b) {return a.position.y-b.position.y})
        // tempCtx.globalCompositeOperation = "multiply";
        // tempCtx.globalAlpha = .25;
        // for (var i = 0; i < this.entities.length; i++) {
        //     tempCtx.drawImage(assetMgr.getAsset("shadow"), this.entities[i].position.x-7, this.entities[i].position.y-7);
        // }
        // tempCtx.globalCompositeOperation = "normal";
        // tempCtx.globalAlpha = 1;
        for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].draw(tempCtx, dt);
        }
        tempCtx.restore();
        this.ctx.drawImage(tempCanvas, 0,0);
        tempCanvas.remove();
    }  
 
    addEntity(entity) {
        console.log('added entity');
        this.entities.push(entity);
    }

    addParticles(particles) {
        console.log('added particles');
        this.particles.push(particles);
    }

    removeParticles(particles) {
        console.log('removed particles');
        this.particles.splice(this.particles.indexOf(particles),1);
    }

    remove(entity) {
        this.entities.splice(this.entities.indexOf(entity),1);
    }
}