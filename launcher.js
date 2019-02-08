var game;
var assetMgr = new AssetManager();
var terrain = new Terrain();
var controls = new Controls();
var size = 400;
var viewSize = 400;
// Encapsulate these

assetMgr.queueDownload("./sprites/practice.png");
assetMgr.queueDownload("./sprites/dudeRed.png");
assetMgr.queueDownload("./sprites/dudeGreen.png");
assetMgr.queueDownload("./sprites/dudeGreenWalk.png");
assetMgr.queueDownload("./sprites/dudeBlue.png");
assetMgr.queueDownload("./sprites/chicken.png");
assetMgr.queueDownload("./sprites/bush.png");
assetMgr.queueDownload("./sprites/tree.png");
assetMgr.queueDownload("./sprites/rock.png");
assetMgr.queueDownload("./sprites/scientist.png");
assetMgr.queueDownload("./sprites/chest.png");
assetMgr.queueDownload("./sprites/grass.png");
assetMgr.queueDownload("./sprites/meat.png");
assetMgr.queueDownload("./sprites/water.png");
assetMgr.queueDownload("./sprites/ship.png");
assetMgr.queueDownload("./sprites/shipShadow.png");
assetMgr.queueDownload("./sprites/particle.png");
assetMgr.queueDownload("./sprites/shadow.png");
assetMgr.queueDownload("./sprites/dna.png");

// guns
assetMgr.queueDownload("./sprites/railgun.png");
assetMgr.queueDownload("./sprites/laserPistol.png");
assetMgr.queueDownload("./sprites/flamethrower.png");
assetMgr.queueDownload("./sprites/plasmaPistol.png");


assetMgr.downloadAll(function() {
    console.log("Done loading image assets");
    createSprites();
});

function createSprites() {
    var frameduration = 0.15;
    assetMgr.createSprite("practice", 16, 16, 16, frameduration, 8, true, 1, 1, 8, 8);
    assetMgr.createSprite3D("dudeRed", 16, 16, 18, frameduration, 1, true);
    assetMgr.createSprite3D("dudeGreen", 16, 16, 21, frameduration, 1, true);
    assetMgr.createSprite3D("dudeGreenWalk", 16, 16, 21, frameduration, 5, true);
    assetMgr.createSprite3D("dudeBlue", 16, 16, 18, frameduration, 1, true);
    assetMgr.createSprite3D("chicken", 16, 16, 11, frameduration*2, 3, true);
    assetMgr.createSprite3D("bush", 16, 16, 6, frameduration, 1, true);
    assetMgr.createSprite3D("tree", 16, 16, 24, frameduration, 1, true);
    assetMgr.createSprite3D("rock", 16, 16, 9, frameduration, 4, true);
    assetMgr.createSprite3D("scientist", 16, 16, 21, frameduration, 6, true);
    assetMgr.createSprite3D("chest", 16, 16, 21, frameduration, 9, false);
    assetMgr.createSprite3D("grass", 16, 16, 21, frameduration, 1, true);
    assetMgr.createSprite3D("meat", 16, 16, 7, frameduration, 1, true);
    assetMgr.createSprite3D("water", 16, 16, 8, frameduration, 1, true);
    assetMgr.createSprite3D("ship", 64, 64, 12, frameduration, 1, true);
    assetMgr.createSprite3D("dna", 16, 16, 16, frameduration, 1, true);

    // guns
    assetMgr.createSprite3D("railgun", 32, 8, 4, frameduration*.5, 8, true);
    assetMgr.createSprite3D("laserPistol", 16, 8, 4, frameduration*.5, 1, true);
    assetMgr.createSprite3D("flamethrower", 32, 8, 6, frameduration*.5, 3, true);
    assetMgr.createSprite3D("plasmaPistol", 16, 8, 6, frameduration*.5, 5, true);


    console.log("Done creating sprites")
    start();
}

//document.addEventListener("DOMContentLoaded", start);

function start() {
    var canvas = document.getElementById("canvas");
    canvas.width = viewSize;
    canvas.height = viewSize;
    canvas.style.background = '#559061';
    // canvas.style.transform = 'scale(2)';
    var ctx = canvas.getContext('2d', { alpha: false });
    ctx.canvas.style["cursor"] = "url(./sprites/crosshairWhite.png) 8 8, crosshair";
    ctx.imageSmoothingEnabled = false;  
    game = new GameEngine(ctx, size, size);
    game.init();
    controls.init();
    game.pause();
}



