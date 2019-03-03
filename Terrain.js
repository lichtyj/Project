class Terrain {ds  
    constructor() {
        this.overworldSize = 400;
        this.map = [this.overworldSize*this.overworldSize];
        this.newMap = [this.overworldSize*this.overworldSize];
        this.growthMap = [this.overworldSize*this.overworldSize];
        this.i = 0;
        this.drawQueued = false;
        this.timer = 0;
        this.building = true;

        // this.birthrule = [1,1,1,1,1,0,1,0,0];
        // this.aliverule = [1,0,1,0,0,0,1,1,0];
        // this.birthrule = [0, 1, 0, 0, 1, 1, 1, 0, 0] // Good outer shape, lots of inner lines
        // this.aliverule = [0, 0, 1, 1, 1, 1, 0, 0, 0] // ""
        // this.birthrule = [0, 1, 1, 1, 0, 1, 1, 0, 1]; // Better shape, just fill in the dots
        // this.aliverule = [0, 0, 0, 1, 1, 1, 1, 1, 0]; 
        // this.birthrule = [0, 1, 1, 1, 0, 0, 1, 0, 0]; // interesting shapes, lots of lakes, lines
        // this.aliverule = [0, 0, 1, 1, 1, 0, 0, 1, 1];
        // this.birthrule = [0, 0, 0, 0, 0, 0, 0, 1, 0]; // Very interesting shapes, very slow
        // this.aliverule = [0, 0, 1, 0, 0, 1, 0, 0, 0];

        this.birthrule = [0, 0, 0, 1, 1, 1, 0, 1, 1];
        this.aliverule = [0, 1, 0, 1, 1, 1, 0, 0, 1]

        this.timer = 0;

        this.colors = [];
        this.maxHeight = -1;
        this.avgHeight = -1;

        this.zoom = 1;
        this.zooming = false;

        this.overworldView = true;
    }

    init() {

        this.colors.push({r:10 , g:40 , b:98});
        this.colors.push({r:22 , g:50 , b:105});
        this.colors.push({r:33 , g:61 , b:115});
        this.colors.push({r:65 , g:110 , b:160});
        this.colors.push({r:80 , g:142 , b:185});
        this.colors.push({r:97 , g:162 , b:209});
        this.colors.push({r:222 , g:212 , b:174});
        this.colors.push({r:117 , g:179 , b:95});
        this.colors.push({r:101 , g:161 , b:96});
        this.colors.push({r:85 , g:144 , b:97});
        this.colors.push({r:83 , g:125 , b:92});
        this.colors.push({r:105 , g:105 , b:105});
        this.colors.push({r:135 , g:135 , b:135});
        this.colors.push({r:195 , g:195 , b:195});
        this.colors.push({r:235 , g:235 , b:245});
        // this.birthrule = [0];
        // this.aliverule = [0];
        // for (var i = 0; i < 8; i++) {
        // this.birthrule.push(Math.round(Math.random()));
        // this.aliverule.push(Math.round(Math.random()));
        // }
        this.make();
        // this.building = false;
        // for (var i = 0; i < this.overworldSize*4.5; i++) {
        //     this.grow(); 
        // }
    }

    reset() {
        this.birthrule = [0];
        this.aliverule = [0];
        for (var i = 0; i < 8; i++) {
        this.birthrule.push(Math.round(Math.random()));
        this.aliverule.push(Math.round(Math.random()));
        }
        this.building = true;
        this.timer = 0;
        this.map = [this.overworldSize*this.overworldSize];
        this.newMap = [this.overworldSize*this.overworldSize];
        this.make();
    }

    restart() {
        this.building = true;
        this.timer = 0;
        this.map = [this.overworldSize*this.overworldSize];
        this.newMap = [this.overworldSize*this.overworldSize];
        this.make();
    }

    make() {
        this.maxHeight = -1;
        for (var i = 0; i < this.overworldSize*this.overworldSize; i++) {
            this.growthMap[i] = 0;
            var mod = this.distToCenter(i);
            mod = mod/40;
            this.map[i] = Math.round(Math.random()-mod-.4);
            if (this.map[i] < 0) this.map[i] = 0;
        }
    }

    load() {
        if (this.building) {
            if (this.timer < 50) { 
                this.buildworld();
                this.timer++;
            } else {
                console.log("Drawing world");
                this.building = false;
                this.biomeworld();
                this.biomeworld();
                this.biomeworld();
                this.blurworld();
                this.blurworld();
                this.blurworld();
                this.blurworld();
                this.blurworld();
                this.getHeights();
                this.draw();
                game.updateView();
                console.log("Done drawing world");
                game.start();
            }
        }
    }

    draw() {
        if (this.overworldView) {
            var total = this.overworldSize*this.overworldSize*4;
            var v = new Uint8ClampedArray(total);
            var j,k,l,m;
            var snowline = (this.maxHeight + this.avgHeight)*.75;
            for (var i = 0; i < total;) {
                j = this.map[i/4];
                k = j/snowline;
                l = (this.distToPoint(i/4, this.overworldSize*.75, this.overworldSize*.25)-10)|0;
                l *= 4;
                m = (this.distToCenter(i/4));
                m *= m;
                if (m > 80) {
                    m = 80-m;
                }
                if (k > 1) k = 1;
                if (k < 0) k = 0;
                k = Math.round(k*(this.colors.length-1));
                if (j == -1 || isNaN(k)) {
                    if (Math.round(Math.random()*500) == 0)
                        m = 255;
                    else
                        m = 0;
                    v[i++] = m;
                    v[i++] = m;
                    v[i++] = m;
                } else {
                    v[i++] = this.colors[k].r - l+m;
                    v[i++] = this.colors[k].g - (l*1.25)+m;
                    v[i++] = this.colors[k].b - (l*1.5)+m;
                }
                v[i++] = 255;
            }
            var can = document.createElement('canvas');
            can.width = this.overworldSize;
            can.height = this.overworldSize;
            var tempCtx = can.getContext('2d');
            tempCtx.putImageData(new ImageData(v, this.overworldSize, this.overworldSize), 0, 0);
            game.ctx.canvas.style.background = "url(" + can.toDataURL('terrain/png', 1.0) + ")";
            // game.ctx.canvas.style.backgroundPosition = "top -200px left -200px";
            game.updateView();
        } else {
            // var snowline = (this.maxHeight + this.avgHeight)*.75;
            // var x = game.cameraTarget.position.x/worldSize*this.overworldSize;
            // var y = game.cameraTarget.position.y/worldSize*this.overworldSize;
            // var k = this.map[(x+y*this.overworldSize)|0]/snowline;
            // k = Math.round(k*(this.colors.length-1));
            // console.log(x + ", " + y);
            // console.log(this.colors[k]);
            // game.ctx.canvas.style.background = "rgb(" + this.colors[k].r + ", " + this.colors[k].g + ", " + this.colors[k].b + ")";
            // game.updateView();
        }
    }

    getHeights() {
        var max = this.overworldSize*this.overworldSize;
        this.maxHeight = -1;
        var count = 0;
        for (var i = 0; i < max; i++) {
            if (this.map[i] > this.maxHeight) this.maxHeight = this.map[i];
            if (this.map[i] > 0) {this.avgHeight += this.map[i]; count++;}
        }
        this.avgHeight /= count;
    }

    biomeworld(x) {
        var neighbors = 0;
        var max = this.overworldSize*this.overworldSize;
        this.newMap = [this.overworldSize*this.overworldSize];
        for (var i = 0; i < max; i++) {
            if (this.map[i] == -1) continue;
            neighbors = this.neighbors(i);
            this.newMap[i] = (this.map[i] + neighbors.average)*(Math.random()*.5+.5);
            var mod = this.distToCenter(i);
            mod = mod/80;
            if (mod > 1) mod = 1;
            this.newMap[i] *= 1-mod;
            if (mod > .75) {
                this.map[i] = -1;
                this.newMap[i] = -1;
            } else if (this.newMap[i] < 1) this.newMap[i] = 1;
        }
        this.map = this.newMap;
    }


    blurworld() {
        var neighbors = 0;
        var max = this.overworldSize*this.overworldSize;
        this.newMap = [this.overworldSize*this.overworldSize];
        for (var i = 0; i < max; i++) {
            if (this.map[i] == -1) continue;
            neighbors = this.neighbors(i);
            this.newMap[i] = neighbors.average;
            var mod = this.distToCenter(i);
            mod = mod/40;
            if (mod > 1) mod = 1;
            this.newMap[i] *= 1-mod;
            if (mod > .75) {
                this.map[i] = -1;
                this.newMap[i] = -1;
            } else if (this.newMap[i] < 1) this.newMap[i] = 1;
        }
        this.map = this.newMap;
    }

    buildworld() {  
        var neighbors = 0;
        var max = this.overworldSize*this.overworldSize;
        for (var i = 0; i < max; i++) {
            if (this.map[i] == -1) continue;
            neighbors = this.neighbors(i);
            if (this.map[i]-this.growthMap[i] == 0) {
                this.newMap[i] = this.birthrule[neighbors.count];
                if (this.newMap[i] == 0) this.growthMap[i] = neighbors.average;
            } else if (this.map[i] < 32) {
                this.newMap[i] = this.aliverule[neighbors.count]*this.growthMap[i];
                this.growthMap[i] += neighbors.average-.125;
            } else if (this.map[i] < 128) {
                this.newMap[i] += neighbors.average*this.aliverule[neighbors.count]
                this.growthMap[i] += neighbors.average-4;
            } else if (this.map[i] >= 128) {
                this.newMap[i] = this.map[i];
                // this.growthMap[i]--;
            }
            if (this.newMap[i] < 0) this.newMap[i] = 0;
            var mod = this.distToCenter(i);
            mod = mod/40;
            if (mod > 1) mod = 1;
            this.newMap[i] *= 1-mod;
            if (mod > .75) {
                this.map[i] = -1;
                this.newMap[i] = -1;
            }
        }
        this.map = this.newMap;
    }

    distToCenter(i) {
        return this.distToPoint(i, this.overworldSize*.5, this.overworldSize*.5);
    }

    distToPoint(i, px, py) {
        var y = (i / this.overworldSize)|0;
        var x = i % this.overworldSize;
        return (Math.pow(x - px, 2) + Math.pow(y - py, 2))/1000;
    }

    neighbors(i) {
        var neighbors = 0;
        var count = 0;
        var ti = i;
        for (var j = -1; j < 2; j++) {
            for (var k = -1; k < 2; k++) {
                if (j != 0 || k != 0) {
                    ti = (i + k + j*this.overworldSize) % (this.overworldSize*this.overworldSize);
                    if (ti < 0) ti += this.overworldSize*this.overworldSize;
                    if (this.map[ti] > this.map[i]/2)neighbors += this.map[ti];
                    if (this.map[ti] != 0) count++;
                }
            }
        }
        return {count:count, average:neighbors/8};
    }

    countNeighbors(i) {
        var neighbors = 0;
        var ti = i;
        for (var j = -1; j < 2; j++) {
            for (var k = -1; k < 2; k++) {
                if (j != 0 || k != 0) {
                    ti = (i + k + j*this.overworldSize) % (this.overworldSize*this.overworldSize);
                    if (ti < 0) ti += this.overworldSize*this.overworldSize;
                    // neighbors += this.map[ti];
                    if (this.map[ti] != 0) neighbors++;
                }
            }
        }
        return neighbors;
    }

    populate() {
        terrain.generateObjects(250);        
        terrain.generateFood(10);
        terrain.generateChickens(10);
    }

    update() {
        // this.grow();
    }

    zoomIn() {
        this.zoom *= 1.02;
        if (this.zoom > 25) game.state = "mayday";
        if (this.zoom > 400) {
            game.state = "falling";
            game.fade  = 60;
            game.ctx.canvas.style.background = '#559061';
            this.overworldView = false;
            this.populate();
        }
        game.ctx.canvas.style.backgroundSize = (100+this.zoom)+"%";
        game.updateView();
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
                    type = "rawMeat";
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
        var chicken;
        for (var i = 0; i < count; i++) {
            chicken = new Npc(Vector.randomPositive(worldSize), assetMgr.getSprite("chicken"));
            chicken.init();
        };
    }
}


    // grow() {
    //     var neighbors = 0;
    //     var max = this.i + worldSize;
    //     for (var i = this.i; i < max; i++) {
    //         neighbors = 0;
    //         for(var n of this.getNeighbors(i)) {
    //             neighbors += this.map[n];
    //         }
    //         if (this.map[i] != 0) {
    //             if (neighbors < 6) {
    //                 this.newMap[i] = 0;
    //             } else if (neighbors > 6) {
    //                 this.newMap[i] = 2;
    //             } else {
    //                 this.newMap[i] = 1;
    //             }
    //         } else {
    //             if (neighbors > 1 && neighbors < 5) {
    //                 this.newMap[i] = 1;
    //             } else {
    //                 this.newMap[i] = 0;
    //             }
    //         }
    //     }
    //     this.i += worldSize;
    //     if (this.i > worldSize*worldSize) {
    //         this.i = 0;
    //         this.map = this.newMap;
    //         this.newMap = [worldSize, worldSize];
    //         this.draw();
    //     }
    // }

    // life() {
    //     var neighbors = 0;
    //     var newMap = [worldSize*worldSize];

    //     for (var i = 0; i < worldSize*worldSize; i++) {
    //         neighbors = 0;
    //         for(var n of this.getNeighbors(i)) {
    //             neighbors += this.map[n];
    //         }
    //         if (this.map[i] != 0) {
    //             if (neighbors < 2 || neighbors > 3) {
    //                 newMap[i] = 0;
    //             } else {
    //                 newMap[i] = 1;
    //             }
    //         } else {
    //             if (neighbors == 3) {
    //                 newMap[i] = 1;
    //             } else {
    //                 newMap[i] = 0;
    //             }
    //         }
    //     }
    //     this.map = newMap;
    //     this.draw();
    // }

    // getNeighbors(i) {
    //     var neighbors = [];
    //     var ti = i;
    //     for (var j = -1; j < 2; j++) {
    //         for (var k = -1; k < 2; k++) {
    //             if (j != 0 || k != 0) {
    //                 ti = (i + k + j*worldSize) % (worldSize*worldSize);
    //                 if (ti < 0) ti += worldSize*worldSize;
    //                 neighbors.push(ti);
    //             }
    //         }
    //     }
    //     return neighbors;
    // }

    // setPos(x,y, state, now) {
    //     x = x|0;
    //     y = y|0;
    //     var i = x + y*worldSize;
    //     for(var n of this.getNeighbors(i)) {
    //         this.map[n] = state;
    //         this.newMap[n] = state;
    //     }
    //     this.map[i] = state;
    //     this.newMap[i] = state;
    //     if (now) this.drawQueued = true;
    // }