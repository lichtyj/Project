var game;
var assetMgr = new AssetManager();
var terrain = new Terrain();
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
assetMgr.downloadAll(function() {
    console.log("Done loading image assets");
    createSprites();
});

function createSprites() {
    var scale = 2;
    var frameduration = 0.15;
    assetMgr.createSprite("practice", 16, 16, 128, frameduration, 8, true, 1, 1, 8, 8);
    assetMgr.createSprite3D("dudeRed", 16, 16, 18, scale, frameduration, 1, true);
    assetMgr.createSprite3D("dudeGreen", 16, 16, 21, scale, frameduration, 1, true);
    assetMgr.createSprite3D("dudeGreenWalk", 16, 16, 21, scale, frameduration, 5, true);
    assetMgr.createSprite3D("dudeBlue", 16, 16, 18, scale, frameduration, 1, true);
    assetMgr.createSprite3D("chicken", 16, 16, 10, scale, frameduration, 3, true);
    assetMgr.createSprite3D("bush", 16, 16, 6, scale, frameduration, 1, true);
    assetMgr.createSprite3D("tree", 16, 16, 24, scale, frameduration, 1, true);
    assetMgr.createSprite3D("rock", 16, 16, 9, scale, frameduration, 4, true);
    assetMgr.createSprite3D("scientist", 16, 16, 21, scale, frameduration, 6, true);
    assetMgr.createSprite3D("chest", 16, 16, 21, scale, frameduration, 9, false);
    assetMgr.createSprite3D("grass", 16, 16, 21, scale, frameduration, 1, true);
    assetMgr.createSprite3D("meat", 16, 16, 8, scale, frameduration, 1, true);
    console.log("Done creating sprites")
    start();
}

//document.addEventListener("DOMContentLoaded", start);

function start() {
    var canvas = document.getElementById("canvas");
    canvas.width = 800;
    canvas.height = 800;
    var ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;  
    game = new GameEngine(ctx);
    game.init();
}




