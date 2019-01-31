class Controls {
    constructor() {
        this.keys = [];
    }

    keyUp(num) {
        switch(num) {
            case 16: // LeftShift
                game.player.aiming = false;
                game.ctx.canvas.style["cursor"] = "none";
                game.ctx.canvas.removeEventListener("mousemove", this.captureMouse);
                game.ctx.canvas.removeEventListener("mousedown", this.mousePress);
                break;    
        }

        delete this.keys.splice(this.keys.indexOf(num),1);
    }

    keyDown(num) {
        if (this.keys.indexOf(num) == -1) {
            this.keys.push(num);
        }
    }

    mouseMove(e) {
        var x = e.clientX - game.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - game.ctx.canvas.getBoundingClientRect().top;

        game.ctx.fillStyle = "#0F0";
        game.ctx.fillRect(x,y,2,2);
        game.player.target(x, y);
    }

    mousePress(e) {
        game.player.shoot();
    }

    actions() {
        var moving = Vector.zero();
        for (var key of this.keys) {
            switch(key) {
                case 16: // LeftShift
                    if (!game.player.aiming) {
                        game.ctx.canvas.style["cursor"] = "url(./sprites/crosshair.png) 8 8, crosshair";
                        game.ctx.canvas.addEventListener("mousemove", this.mouseMove);
                        game.ctx.canvas.addEventListener("mousedown", this.mousePress);
                    }
                    game.player.aiming = true;

                    break;
                case 49: // 1
                    game.player.sprite = assetMgr.getSprite("scientist");
                    break;
                case 50: // 2
                    game.player.sprite = assetMgr.getSprite("dudeRed");
                    break;
                case 51: // 3
                    game.player.sprite = assetMgr.getSprite("dudeGreen");
                    break;
                case 52: // 4
                    game.player.sprite = assetMgr.getSprite("dudeBlue");
                    break;
                case 87: // W
                    moving.add(Vector.up());
                    break;
                case 65: // A
                    moving.add(Vector.left());
                    break;
                case 83: // S
                    moving.add(Vector.down());
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