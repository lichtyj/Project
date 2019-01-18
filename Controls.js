class Controls {
    constructor() {
        this.keys = []; // Make a map of functions.  Don't use like below.
    }

    static keyDown(key) {
        switch(key) {
            case 87: // W
                game.player.sprite = assetMgr.getSprite("scientist");
                break;
            case 65: // A
                game.player.sprite = assetMgr.getSprite("dudeRed");
                break;
            case 83: // S
                game.player.sprite = assetMgr.getSprite("dudeGreen");
                break;
            case 68: // D
                game.player.sprite = assetMgr.getSprite("dudeBlue");
                break;
            case 70: // F
                terrain.generateChickens(25)
                break;
            case 71: // G
                terrain.generateObjects(25);
                break;
            case 72: // H
                terrain.generateFood(25);
                break;
        }
    }
}