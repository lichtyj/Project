class GUI {
    constructor(ctx) {
        this.ctx = ctx;

        this.invSize = 32;
        this.invBorder = 2;
        this.invBoxes = 4;

        this.rotation = 0;
        this.bounce = 0;

        this.drawRed = 0;
        this.textFade = 0;
        this.msg = "";
        this.msgColor = "#FFF";
    }

    draw() {
        this.ctx.setTransform(1,0,0,1,0,0);
        if (this.drawRed > 0) {
            this.ctx.fillStyle = "#F00";
            if (this.drawRed > 50) this.drawRed = 50;
            this.ctx.globalAlpha = (this.drawRed--/100);
            this.ctx.fillRect(0,0, game.viewWidth, game.viewHeight);
        }
    }

    inventoryMessage(msg, color, fade) {
        if (color == undefined) color = "#FFF";
        if (fade == undefined) fade =  100;
        this.color = color;
        this.msg = msg;
        this.textFade = fade;
    }

    drawInventoryMessage() {
        this.ctx.fillStyle = this.color;
        var twidth = this.ctx.measureText(this.msg).width;
        this.ctx.globalAlpha = this.textFade--/100;
        if (this.ctx.globalAlpha > 1) this.ctx.globalAlpha = 1;
        this.ctx.fillText(this.msg, (game.viewWidth - twidth)*.5 | 0, game.viewHeight-this.invSize - 4);
    }
    
    drawMessage(msg, color, offset) {
        if (offset == undefined) offset = 0;
        this.ctx.fillStyle = color;
        var text = msg;
        var twidth = this.ctx.measureText(text).width;
        this.ctx.fillText(text, (game.viewWidth - twidth)*.5 | 0, (game.viewHeight)*.25 + offset);
    }

    drawInventory() {
        if (this.textFade > 0) {
            this.drawInventoryMessage();
        }
        var left = (game.viewWidth - this.invSize*this.invBoxes)/2;
        var top = game.viewHeight-this.invSize;
        this.ctx.globalAlpha = .5;
        this.ctx.setTransform(1,0,0,1,0,0);
        for (var i = 0; i < this.invBoxes; i++) {
            if (i == game.player.current && game.player.inventory.length > 0) {
                this.ctx.fillStyle = "#888";
            } else {
                this.ctx.fillStyle = "#333";
            }
            this.ctx.fillRect(left+this.invBorder+(this.invSize)*i, top + this.invBorder, this.invSize-this.invBorder*2, this.invSize - this.invBorder*2);
        }
        for (var i = 0; i < this.invBoxes; i++) {
            if (i == game.player.current && game.player.inventory.length > 0) {
                this.ctx.fillStyle = "#FFF";
            } else {
                this.ctx.fillStyle = "#888";
            }
            if (game.player.inventory[i] != undefined) {
                this.drawResource(game.player.inventory[i].name,left+this.invBorder+(this.invSize)*(i+1/3), top+this.invBorder+this.invSize/3);
                this.ctx.setTransform(1,0,0,1,0,0);
                var text = game.player.inventory[i].count;
                var twidth = this.ctx.measureText(text).width;
                this.ctx.fillText(text, left+this.invBorder+(this.invSize)*(i+.75)-twidth, top+this.invBorder+this.invSize*(3/4))
            }
        }
    }

    drawResource(sprite, x,y) {
        this.rotation += 0.01;
        assetMgr.getSprite(sprite).drawFrame(0, this.ctx, x, y, 0, this.rotation, this.bounce += .075);
    }
}