class GameEngine {
    constructor(ctx, uiCtx, overlayCtx, worldSize) {
        this.entities = [];
        this.ctx = ctx;
        this.lastFrame = 0;
        this.dt = 0;
        this.step = 1/60;
        this.viewWidth = ctx.canvas.width;
        this.viewHeight = ctx.canvas.height;
        this.cameraTarget = null;
        this.cameraOffset= new Vector();
        this.viewAngle = 1;
        this.bounds = new Vector(worldSize, worldSize);
        this.view = new Vector();
        this.tree;
        this.toRemove = [];
        this.paused = true;
        this.player;
        this.state = "loading";
        this.ui = new GUI(uiCtx, overlayCtx);

        this.ship;
    }

    init() {
        console.log("Initialized");
        this.tree = new Quadtree(1, 0, 0, this.bounds.x, this.bounds.y, null);
        this.tree.init();
        this.cameraTarget = {position: new Vector(terrain.overworldSize/2, terrain.overworldSize/2, 0)};
        this.ui.drawRect(1,"#000");
        this.ctx.canvas.style.background = "#F00";
        this.ui.drawMessage("BUILDING WORLD...", "#FFF");
        console.log("Loading");
        window.setTimeout(this.gameLoop, 10);
    }

    start() {
        this.ui.clearUI();
        this.ui.drawRect(.5,"#333");
        this.ui.drawMessage("CLICK TO BEGIN", "#FFF");
        document.getElementById("viewport").blur();
        this.state = "ready";
    }

    gameLoop() {
        if (!game.paused) { 
            var current = performance.now();
            game.dt += Math.min(.02, (current - game.lastFrame) / 1000);   // duration capped at 20ms
            while(game.dt > game.step) {
                game.dt -= game.step;
                if (game.state != "dead") game.update(game.step);
                game.draw(game.step);
            }
            game.lastFrame = current;
        }
        if (game.state == "loading") {
            terrain.load();
        }
        window.requestAnimationFrame(game.gameLoop);
    }

    update(dt) {
        // Handle collisions;
        this.tree.clear();
        var entitiesCount = this.entities.length;
        for (var i = entitiesCount-1; i >= 0; i--) {
            this.tree.insert(this.entities[i]);
        }

        if (game.state == "playing") controls.actions();

        this.updateView();
        var toUpdate = this.tree.retrieve(this.view.x + (viewSize>>1), this.view.y + (viewSize>>1), viewSize); // TODO find a better solution
        for (var i = toUpdate.length-1; i >= 0; i--) {
            toUpdate[i].update(dt);    
        }
        while (this.toRemove.length > 0) {
            this.entities.splice(this.entities.indexOf(this.toRemove.pop()),1);
        }
    }

    draw(dt) {
        if (game.state != "dead") {
            this.ctx.canvas.width = this.ctx.canvas.width;
            var toDraw = this.tree.retrieve(this.view.x + (viewSize>>1), this.view.y + (viewSize>>1), viewSize*.75);
            toDraw.sort(function(a,b) {return a.position.y-b.position.y});
            for (var i = 0; i < toDraw.length; i++) {
                toDraw[i].draw(this.ctx, dt);
            }
        } else {
            this.ui.clearUI();
            this.ui.drawRect(1,"#000");
            this.ui.drawMessage("YOU DIED", "#F00");
        }
        this.ui.draw();
    }

    updateView() {
        this.view.x = (this.cameraTarget.position.x + this.cameraOffset.x - this.viewWidth*.5);
        this.view.y = (this.cameraTarget.position.y + this.cameraOffset.y - this.cameraOffset.z - this.viewHeight*.5);
        var vx = -this.view.x - (terrain.zoom-100)*2 + (worldSize - this.viewWidth)*.5;
        var vy = -this.view.y - (terrain.zoom-100)*2 + (worldSize - this.viewHeight)*.5;
        this.ctx.canvas.style.backgroundPosition = vx + "px " + vy + "px";
    }

    pause() {
        // if (this.state == "playing") {
            this.paused = true;
            this.ui.drawRect(.5, "#333");
            this.ui.drawMessage("PAUSED", "#FFF");
            this.ui.drawMessage("- click to continue -","#FFF", 15);
        // }
    }

    resume() {
        if (this.state == "ready") {
            this.state = "intro";
            this.ship = new Ship(assetMgr.getSprite("ship"), assetMgr.getAsset("shipShadow"));
            this.ship.position.x = game.view.x + viewSize*.33;
            this.ship.position.y = game.view.y + viewSize*.75;
            this.addEntity(this.ship); 
        }

        if (this.state != "loading" && this.paused){
            this.paused = false;
            this.ctx.globalAlpha = 1;
            window.requestAnimationFrame(game.gameLoop);
        }
    }
 
    addEntity(entity) {
        this.entities.push(entity);
    }

    remove(entity) {
        this.toRemove.push(entity);
    }
}