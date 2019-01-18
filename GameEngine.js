class GameEngine {
    constructor(ctx) {
        this.entities = [];
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
    }
    init() {
        console.log("Initialized");
        this.startInput();
        window.requestAnimationFrame(game.gameLoop);
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

        this.ctx.canvas.addEventListener("mousedown", function (e) {
            var v = getXandY(e);
            if (that.player == undefined) {
                that.player = new Player(v, new Vector(), assetMgr.getSprite("dudeGreen"), that.bounds);
                that.addEntity(that.player);
            }
            that.click = v;
            that.player.moveTo = v;
        }, false);

        this.ctx.canvas.addEventListener("mouseup", function (e) {
            var v = getXandY(e);
            that.click = v;
            that.player.moveTo = v;
        }, false);

        
        /*  AVOID IF POSSIBLE*///////////////////////////////////////
        // this.ctx.canvas.addEventListener("mousemove", function (e) {
        //     that.examine.rotation = that.examine.position.angleTo(getXandY(e));
        // }, false);
        /* AVOID IF POSSIBLE *///////////////////////////////////////

        document.addEventListener("keydown", function(e) {
            //TODO pull this out into another class
            console.log(e.code + " " + e.keyCode);
            Controls.keyDown(e.keyCode);
        });
        console.log('Input initiated');
    }

    update() {
        var entitiesCount = this.entities.length;
        for (var i = entitiesCount-1; i >= 0; i--) {
            this.entities[i].update();    
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
        this.entities.sort(function(a,b) {return a.position.y-b.position.y})
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

    remove(entity) {
        this.entities.splice(this.entities.indexOf(entity),1);
    }
}