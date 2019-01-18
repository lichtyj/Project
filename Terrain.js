class Terrain {
    constructor() {

    }

    generateObjects(count) {
        var spr;
        for (var i = 0; i < count; i++) {
            switch (Math.floor(Math.random()*4)) {
                case 0:
                    spr = assetMgr.getSprite("bush");
                    break;
                case 1: 
                    spr = assetMgr.getSprite("tree");
                    break;
                case 2: 
                    spr = assetMgr.getSprite("rock");
                    break;
                case 3: 
                    spr = assetMgr.getSprite("grass");
                    break;
            }
            game.addEntity(new Object(new Vector(Math.floor(Math.random()*game.surfaceWidth), 
                            Math.floor(Math.random()*game.surfaceHeight)), 
                            spr, Math.random()*Math.PI*2));
        }
    }

    generateObjects(count) {
        var spr = assetMgr.getSprite("meat");
        for (var i = 0; i < count; i++) {
            game.addEntity(new Object(new Vector(Math.floor(Math.random()*game.surfaceWidth), 
                            Math.floor(Math.random()*game.surfaceHeight)), 
                            spr, Math.random()*Math.PI*2));
        }
    }

    generateChickens(count) {
        var spr = assetMgr.getSprite("chicken");
        for (var i = 0; i < count; i++) {
            game.addEntity(new Living(new Vector(Math.random()*game.surfaceWidth, 
                            Math.random()*game.surfaceHeight), Vector.random(3), 
                            spr, game.bounds, 100));
        };
    }
}