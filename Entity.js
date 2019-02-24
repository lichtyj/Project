class Entity {
    constructor(position, sprite) {
        this.position = position;
        this.velocity = new Vector();
        this.direction = new Vector();
        this.acceleration = new Vector();
        this.sprite = sprite;
        this.rotation = 0;
        this.elapsedTime = 0;
    }

    update() {
        this.position.add(this.velocity);
        this.acceleration.limit(this.sprint);
        if (this.acceleration.magnitude() > .1)
            this.velocity.add(this.acceleration);
        this.velocity.limit(this.topSpeed);
        this.velocity.mult(.95);
        this.acceleration.mult(0);


        if (this.position.x < 0) this.position.x = game.bounds.x;
        if (this.position.y < 0) this.position.y = game.bounds.y;
        if (this.position.z < 0) this.position.z = 0;
        if (this.position.x > game.bounds.x) this.position.x = 0;
        if (this.position.y > game.bounds.y) this.position.y = 0;

    }
}

// Entity.prototype.draw = function (ctx, dt) {
//     this.elapsedTime += dt;
//     if (this.sprite instanceof Sprite3D) {
//         this.sprite.drawSprite(ctx, this.elapsedTime, this.position.x, this.position.y, 0/*this.position.z*/, this.direction,0);   
//     } else { 
//         this.sprite.drawSubImage(0, ctx, this.position.x, this.position.y, this.direction);       
//     }
//     //this.sprite.drawFrame(ctx, dt, this.position.x, this.position.y);
// }