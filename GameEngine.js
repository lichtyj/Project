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
        this.state = "falling";
        this.stateTimer = 0;
    }

    init() {
        console.log("Initialized");
        this.tree = new Quadtree(1, 0, 0, this.bounds.x, this.bounds.y, null);
        this.tree.init();
        
        var ship = new Ship(assetMgr.getSprite("ship"), assetMgr.getAsset("shipShadow"));
        this.addEntity(ship);
        this.cameraOffset.x = 17;
        this.cameraOffset.y = -12;
        this.cameraTarget = ship;

        terrain.generateObjects(50);

        var chicken;
        for (var i = 0; i < 10; i++) {
            chicken = new Npc(Vector.randomPositive(worldSize), assetMgr.getSprite("chicken"));
            chicken.init();
        }

        
        terrain.generateFood(10);
        window.requestAnimationFrame(game.gameLoop);

        this.ctx.setTransform(1,0,0,1,0,0);
        this.ctx.globalAlpha = .5;
        this.ctx.fillStyle = "#333";
        this.ctx.fillRect(0,0, this.viewWidth, this.viewHeight);
        this.drawMessage("CLICK TO BEGIN", "#FFF");
    }

    gameLoop() {
        if (!game.paused) { 
            var current = performance.now();
            game.dt += Math.min(.02, (current - game.lastFrame) / 1000);   // duration capped at 20ms
            while(game.dt > game.step) {
                game.dt -= game.step;
                game.update(game.step);
                game.draw(game.step);
            }
            game.lastFrame = current;
            window.requestAnimationFrame(game.gameLoop);
        }
    }

    update(dt) {
        if (game.state == "playing") {
            controls.actions();
            terrain.update();
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
        if (this.player != null) this.drawInventory();
        if (game.state == "dead") {
            this.ctx.fillStyle = "#000";
            this.ctx.globalAlpha = 1;
            this.ctx.fillRect(0,0, this.viewWidth, this.viewHeight);
            this.drawMessage("YOU DIED", "#F00");
            this.stateTimer++;
            if (this.stateTimer = 180) {
                // location.reload(true);
            }
        }
        if (game.state != "playing" && this.fade > 0) {
            this.ctx.fillStyle = "#FFF";
            this.ctx.globalAlpha = (this.fade--/50);
            this.ctx.fillRect(0,0, this.viewWidth, this.viewHeight);
        }
    }

    drawInventory() {
        var size = 32;
        var border = 2;
        var boxes = 4;
        var left = (this.viewWidth - size*boxes)/2;
        var top = this.viewHeight-size;
        this.ctx.globalAlpha = .75;
        this.ctx.fillStyle = "#888";
        // this.ctx.fillRect(left + size * , top, size, size);
        this.ctx.fillStyle = "#333";
        for (var i = 0; i < boxes; i++) {
            this.ctx.fillRect(left+border+(size)*i, top + border, size-border*2, size - border*2);
        }
    }

    drawMessage(msg, color, offset) {
        if (offset == undefined) offset = 0;
        this.ctx.fillStyle = color;
        var text = msg;
        var twidth = this.ctx.measureText(text);
        this.ctx.fillText(text, (this.viewWidth - twidth.width)*.5 | 0, (this.viewHeight)*.33 + offset);
    }

    updateView() {
        this.view.x = (this.cameraTarget.position.x + this.cameraOffset.x - this.viewWidth*.5);
        this.view.y = (this.cameraTarget.position.y + this.cameraOffset.y - this.cameraOffset.z - this.viewHeight*.5);
        var vx = -this.view.x;
        var vy = -this.view.y;
        if (vx < 0) vx += worldSize;
        if (vy < 0) vy += worldSize;
        this.ctx.canvas.style.backgroundPosition = vx + "px " + vy + "px";
    }

    pause() {
        if (this.state != "dead") {
            this.paused = true;
            this.ctx.setTransform(1,0,0,1,0,0);
            this.ctx.globalAlpha = .5;
            this.ctx.fillStyle = "#333";
            this.ctx.fillRect(0,0, this.viewWidth+1, this.viewHeight+1);
            this.drawMessage("PAUSED", "#FFF");
            this.drawMessage("- click to continue -","#FFF", 15);
        }
    }

    resume() {
        if (this.paused){
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