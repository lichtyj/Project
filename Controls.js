class Controls {
    constructor() {
        this.keys = [];
        this.lmb = 0;
    }

    init() {
        var that = this;
        game.ctx.canvas.addEventListener("keydown", function(e) {
            that.keyDown(e.keyCode)});
        game.ctx.canvas.addEventListener("keyup", function(e) {
            that.keyUp(e.keyCode)});
        game.ctx.canvas.addEventListener("focus", function() {
            that.focus()});
        game.ctx.canvas.addEventListener("blur", function() {
            that.blur()});
        game.ctx.canvas.addEventListener("mouseup", function() {
            that.mouseButton(false) });
        game.ctx.canvas.addEventListener("mousedown", function() {
            that.mouseButton(true) });
    }

    focus() {
        game.resume();
    }

    blur() {
        game.pause();
    }

    keyUp(num) {
        switch(num) {
            case 16: // LeftShift
                game.player.setState("normal");
                game.ctx.canvas.style["cursor"] = "url(./sprites/crosshairWhite.png) 8 8, crosshair";
                // game.ctx.canvas.removeEventListener("mousemove", this.mouseMove);
                break;    
        }

        delete this.keys.splice(this.keys.indexOf(num),1);
    }

    keyDown(num) {
        if (this.keys.indexOf(num) == -1) {
            // console.log(num);
            this.keys.push(num);
        }
    }

    mouseMove(e) {
        var x = e.clientX - game.ctx.canvas.getBoundingClientRect().left + game.view.x - 200;
        var y = e.clientY - game.ctx.canvas.getBoundingClientRect().top + game.view.y - 200;

        game.ctx.fillStyle = "#0F0";
        game.ctx.fillRect(x,y,2,2);
        game.player.setTarget(x, y);
    }

    mouseButton(pressed) {
        if (pressed) {
            if (this.keys.indexOf("lmb") == -1) {
                this.keys.push("lmb");
            }
        } else {
            if (game.player != null && game.player.gun != null)
                game.player.gun.triggerReleased();
            delete this.keys.splice(this.keys.indexOf("lmb"),1);
        }
    }

    actions() {
        var moving = Vector.zero();
        for (var key of this.keys) {
            switch(key) {
                case "lmb":
                    if (game.player != null && game.player.gun != null)
                        game.player.gun.triggerPressed();
                    break;
                case 16: // LeftShift
                    if (!game.player.aiming) {
                        game.ctx.canvas.style["cursor"] = "url(./sprites/crosshair.png) 8 8, crosshair";
                        game.ctx.canvas.addEventListener("mousemove", this.mouseMove);
                    }
                    game.player.setState("aim");
                    break;
                case 49: // 1
                    game.player.sprite = assetMgr.getSprite("scientist");
                    break;
                case 50: // 2
                    game.player.sprite = assetMgr.getSprite("dudeRed");
                    break;
                case 51: // 3
                    game.player.sprite = assetMgr.getSprite("dudeGreen");
                    for (var c of game.entities) {
                        if (c instanceof Npc) {
                            c.rage = true;
                        }
                    }
                    break;
                case 52: // 4
                    game.player.sprite = assetMgr.getSprite("dudeBlue");
                    break;
                case 53: // 5
                    game.player.gun.preset('railgun');
                    break;
                case 54: // 6
                    game.player.gun.preset('laserPistol');
                    break;
                case 55: // 7
                    game.player.gun.preset('flamethrower');
                    break;
                case 56: // 8
                    game.player.gun.preset('plasmaPistol');
                    break;
                case 87: // W
                    moving.add(Vector.forward());
                    break;
                case 65: // A
                    moving.add(Vector.left());
                    break;
                case 69: // E
                    if (game.player != null) {
                        game.player.interact();
                    }
                case 83: // S
                    moving.add(Vector.back());
                    break;
                case 68: // D
                    moving.add(Vector.right());
                    break;
                case 70: // F
                    terrain.generateChickens(1);
                    this.keyUp(70);
                    break;
                case 71: // G
                    terrain.generateObjects(25);
                    this.keyUp(71);
                    break;
                case 72: // H
                    terrain.generateFood(25);
                    this.keyUp(72);
                    break;
            }
        }

        if (!(moving.equals(Vector.zero()) || (game.player == undefined))) {
            game.player.move(moving.limit(game.player.moveSpeed));
        }
    }
}