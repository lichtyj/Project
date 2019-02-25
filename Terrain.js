class Terrain {
    constructor() {
        this.map = [worldSize*worldSize];
        this.newMap = [worldSize*worldSize];
        this.i = 0;
        this.drawQueued = false;
        this.timer = 0;
    }

    init() {
        for (var i = 0; i < worldSize * worldSize; i++) {
            this.map[i] = Math.round(Math.random()+.1);
        }
        for (var i = 0; i < worldSize*4.5; i++) {
            this.grow(); 
        }
        this.draw();
    }

    update() {
        this.grow();
    }

    grow() {
        var neighbors = 0;
        var max = this.i + worldSize;
        for (var i = this.i; i < max; i++) {
            neighbors = 0;
            for(var n of this.getNeighbors(i)) {
                neighbors += this.map[n];
            }
            if (this.map[i] != 0) {
                if (neighbors < 6) {
                    this.newMap[i] = 0;
                } else if (neighbors > 6) {
                    this.newMap[i] = 2;
                } else {
                    this.newMap[i] = 1;
                }
            } else {
                if (neighbors > 1 && neighbors < 5) {
                    this.newMap[i] = 1;
                } else {
                    this.newMap[i] = 0;
                }
            }
        }
        this.i += worldSize;
        if (this.i > worldSize*worldSize) {
            this.i = 0;
            this.map = this.newMap;
            this.newMap = [worldSize, worldSize];
            this.draw();
        }
    }

    life() {
        var neighbors = 0;
        var newMap = [worldSize*worldSize];

        for (var i = 0; i < worldSize*worldSize; i++) {
            neighbors = 0;
            for(var n of this.getNeighbors(i)) {
                neighbors += this.map[n];
            }
            if (this.map[i] != 0) {
                if (neighbors < 2 || neighbors > 3) {
                    newMap[i] = 0;
                } else {
                    newMap[i] = 1;
                }
            } else {
                if (neighbors == 3) {
                    newMap[i] = 1;
                } else {
                    newMap[i] = 0;
                }
            }
        }
        this.map = newMap;
        this.draw();
    }

    getNeighbors(i) {
        var neighbors = [];
        var ti = i;
        for (var j = -1; j < 2; j++) {
            for (var k = -1; k < 2; k++) {
                if (j != 0 || k != 0) {
                    ti = (i + k + j*worldSize) % (worldSize*worldSize);
                    if (ti < 0) ti += worldSize*worldSize;
                    neighbors.push(ti);
                }
            }
        }
        return neighbors;
    }

    draw() {
        var total = 4*worldSize*worldSize;
        var v = new Uint8ClampedArray(total);
        for (var i = 0; i < total;) {
            if (this.map[(i/4)] == 2) {
                v[i++] = 45;
                v[i++] = 117;
                v[i++] = 59;
                v[i++] = 255;
            } else {
                v[i++] = 85;
                v[i++] = 144;
                v[i++] = 97;
                v[i++] = 255;
            }
        }
        var can = document.createElement('canvas');
        can.width = worldSize;
        can.height = worldSize;
        var tempCtx = can.getContext('2d');
        tempCtx.putImageData(new ImageData(v, worldSize, worldSize), 0, 0);
        game.ctx.canvas.style.background = "url(" + can.toDataURL('terrain/png', 1.0) + ")";
        game.updateView();
    }

    setPos(x,y, state, now) {
        x = x|0;
        y = y|0;
        var i = x + y*worldSize;
        for(var n of this.getNeighbors(i)) {
            this.map[n] = state;
            this.newMap[n] = state;
        }
        this.map[i] = state;
        this.newMap[i] = state;
        if (now) this.drawQueued = true;
    }

    olddraw() {
        var total = 4*viewSize*viewSize;
        var v = new Uint8ClampedArray(total);
        this.start = ((game.view.x | 0) + (game.view.y | 0)*worldSize);
        this.end = (worldSize*viewSize*4)+this.start;
        var k = 0;
        for (var i = this.start; i < this.end; i += worldSize) {
            for (var j = 0; j < viewSize*4; j += 4) {
                if (this.map[(i+j/4)] == 2) {
                    v[k++] = 45;
                    v[k++] = 117;
                    v[k++] = 59;
                    v[k++] = 255;
                } else {
                    v[k++] = 85;
                    v[k++] = 144;
                    v[k++] = 97;
                    v[k++] = 255;
                }
            }
        }
        // for (i; i < total; i+= 4) {
        //     j = (i % (size*4))/(size*4);
        //     k = ((i / (size*4)) | 0)/(size);
        //     v[i] = j*255;
        //     v[i+1] = k*255;
        //     v[i+2] = 0;
        //     v[i+3] = 255;
        // }
        var can = document.createElement('canvas');
        var tempCtx = can.getContext('2d');
        tempCtx.putImageData(new ImageData(v, viewSize, viewSize), 0, 0);
        game.ctx.canvas.style.background = "url(" + can.toDataURL('terrain/png', 1.0) + ")";   
    }

    generateObjects(count) {
        var type;
        for (var i = 0; i < count; i++) {
            switch (Math.floor(Math.random()*4)) {
                case 0:
                    type = "bush";
                    break;
                case 1: 
                    type = "tree";
                    break;
                case 2: 
                    type = "tree2";
                    break;
                case 3: 
                    type = "rock";
                    break;
            }
            game.addEntity(new Object(new Vector(Math.floor(Math.random()*worldSize), 
                            Math.floor(Math.random()*worldSize)), 
                            type, Math.random()*Math.PI*2));
        }
    }

    generateFood(count) {
        var type;
        var spin;
        for (var i = 0; i < count; i++) {
            switch (Math.floor(Math.random()*2)) {
                case 0:
                    type = "meat";
                    break;
                case 1: 
                    type = "ingot";
                    break;
                case 2: 
                    type = "dna";
                    break;
            }
            game.addEntity(new Resource(new Vector(Math.floor(Math.random()*worldSize), 
                            Math.floor(Math.random()*worldSize)), 
                            type, Math.random()*Math.PI*2, spin));
        }
    }

    generateChickens(count) {
        var spr = assetMgr.getSprite("chicken");
        var chicken;
        for (var i = 0; i < count; i++) {
            chicken = new Npc(new Vector(Math.random()*game.viewWidth, 
                Math.random()*game.viewHeight), spr);
            chicken.init();
            game.addEntity(chicken);
        };
    }
}