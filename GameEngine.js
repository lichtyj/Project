class GameEngine {
    constructor(ctx, worldWidth, worldHeight) {
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
        this.bounds = new Vector(worldWidth, worldHeight);
        this.view = new Vector();
        this.tree;
        this.toRemove = [];
        this.paused = true;
        this.player;
        this.fade = 50;
        this.state = "loading";
        this.stateTimer = 0;
        this.ui = new GUI(ctx);
    }

    init() {
        console.log("Initialized");
        this.tree = new Quadtree(1, 0, 0, this.bounds.x, this.bounds.y, null);
        this.tree.init();

        this.cameraTarget = {position: new Vector(terrain.overworldSize/2, terrain.overworldSize/2, 0)};

        // terrain.populate();

        this.ctx.setTransform(1,0,0,1,0,0);
        this.ctx.globalAlpha = .5;
        this.ctx.fillStyle = "#333";
        this.ctx.fillRect(0,0, this.viewWidth, this.viewHeight);
        this.ui.drawMessage("BUILDING WORLD...", "#FFF");

        window.requestAnimationFrame(game.gameLoop);
    }

    start() {
        this.ctx.canvas.width = this.ctx.canvas.width;
        this.ctx.setTransform(1,0,0,1,0,0);
        this.ctx.globalAlpha = .5;
        this.ctx.fillStyle = "#333";
        this.ctx.fillRect(0,0, this.viewWidth, this.viewHeight);
        this.ui.drawMessage("CLICK TO BEGIN", "#FFF");
        this.state = "ready";

        var ship = new Ship(assetMgr.getSprite("ship"), assetMgr.getAsset("shipShadow"));
        this.addEntity(ship);
    }

    gameLoop() {
        if (game.state == "loading") {
            terrain.load();
        }
        if (!game.paused) { 
            var current = performance.now();
            game.dt += Math.min(.02, (current - game.lastFrame) / 1000);   // duration capped at 20ms
            while(game.dt > game.step) {
                game.dt -= game.step;
                game.update(game.step);
                game.draw(game.step);
            }
            game.lastFrame = current;
        }
        window.requestAnimationFrame(game.gameLoop);
    }

    update(dt) {
        if (game.state == "playing") {
            controls.actions();
            terrain.update();
        }
        if (game.state == "flying" || game.state == "mayday") {
            terrain.zoomIn();
        }
        this.tree.clear();
        var entitiesCount = this.entities.length;
        for (var i = entitiesCount-1; i >= 0; i--) {
            this.tree.insert(this.entities[i]);
        }
        if (game.state != "dead") {
            this.updateView();
            for (var i = entitiesCount-1; i >= 0; i--) {
                this.entities[i].update(dt);    
            }
            while (this.toRemove.length > 0) {
                this.entities.splice(this.entities.indexOf(this.toRemove.pop()),1);
            }
        }
    }

    draw(dt) {
        this.ctx.canvas.width = this.ctx.canvas.width;
        this.entities.sort(function(a,b) {return a.position.y-b.position.y});
        for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].draw(this.ctx, dt);
        }
        this.ctx.setTransform(1,0,0,1,0,0);
        if (this.player != null) this.ui.drawInventory();
        if (game.state == "dead") {
            this.ctx.fillStyle = "#000";
            this.ctx.globalAlpha = 1;
            this.ctx.fillRect(0,0, this.viewWidth, this.viewHeight);
            this.ui.drawMessage("YOU DIED", "#F00");
            this.stateTimer++;
            if (this.stateTimer = 180) {
                // location.reload(true);
            }
        }
        if (game.state != "playing" && this.fade > 0) {
            this.ctx.fillStyle = "#FFF";
            this.ctx.globalAlpha = (this.fade--/50);
            if (this.ctx.globalAlpha > 1) this.ctx.globalAlpha = 1;
            this.ctx.fillRect(0,0, this.viewWidth, this.viewHeight);
        }
        this.ui.draw();
        if (game.player != undefined && game.state == "playing") {
            // terrain.draw();
            this.ui.drawInventory();
        }
    }

    updateView() {
        this.view.x = (this.cameraTarget.position.x + this.cameraOffset.x - this.viewWidth*.5);
        this.view.y = (this.cameraTarget.position.y + this.cameraOffset.y - this.cameraOffset.z - this.viewHeight*.5);
        var vx = -this.view.x - terrain.zoom*2;
        var vy = -this.view.y - terrain.zoom*2;
        // if (vx < 0) vx += worldSize;
        // if (vy < 0) vy += worldSize;
        this.ctx.canvas.style.backgroundPosition = vx + "px " + vy + "px";
    }

    pause() {
        if (this.state != "dead") {
            this.paused = true;
            this.ctx.setTransform(1,0,0,1,0,0);
            this.ctx.globalAlpha = .5;
            this.ctx.fillStyle = "#333";
            this.ctx.fillRect(0,0, this.viewWidth+1, this.viewHeight+1);
            this.ui.drawMessage("PAUSED", "#FFF");
            this.ui.drawMessage("- click to continue -","#FFF", 15);
        }
    }

    resume() {
        if (this.state == "ready") {
            this.state = "flying";
            terrain.zooming = true;
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