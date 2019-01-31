class GameEngine {
    constructor(ctx, worldWidth, worldHeight) {
        this.entities = [];
        this.ctx = ctx;
        this.lastFrame = 0;
        this.dt = 0;
        this.step = 1/60;
        this.surfaceWidth = ctx.canvas.width;
        this.surfaceHeight = ctx.canvas.height;
        this.player;
        this.viewAngle = 1;
        this.bounds = new Vector(worldWidth, worldHeight);
        this.tree;
        this.toRemove = [];
    }
    init() {
        console.log("Initialized");
        this.startInput();
        this.tree = new Quadtree(1, 0, 0, this.bounds.x, this.bounds.y, null);
        this.tree.init();
        this.player = new Player(new Vector(200,200), new Vector(), assetMgr.getSprite('scientist'), this.bounds);
        this.addEntity(this.player);
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

    update(dt) {
        controls.actions();
        this.tree.clear();
        var entitiesCount = this.entities.length;
        for (var i = entitiesCount-1; i >= 0; i--) {
            this.tree.insert(this.entities[i]);
        }
        for (var i = entitiesCount-1; i >= 0; i--) {
            this.entities[i].update(dt);    
        }
        while (this.toRemove.length > 0) {
            this.entities.splice(this.entities.indexOf(this.toRemove.pop()),1);
        }
    }

    draw(dt) {
        this.ctx.canvas.width = this.ctx.canvas.width;
        this.entities.sort(function(a,b) {return a.position.y-b.position.y});
        for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].draw(this.ctx, dt);
        }
    }
 
    addEntity(entity) {
        console.log('added entity');
        this.entities.push(entity);
    }

    remove(entity) {
        this.toRemove.push(entity);
    }
}