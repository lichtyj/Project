class Projectile {
    constructor(position, velocity, rate, force, color, time) {
        this.rate = rate;
        this.color = color;
        this.position = position;
        this.velocity = velocity;
        this.time = time;
        this.elapsed = 0;
        this.sprite;
        this.spriteShadow;
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.div(1.1);

        if (this.elapsed < this.time) {
            this.elapsed++;
            for (var i = 0; i < this.rate*(1-this.elapsed/this.time); i++) {
                this.particles.push( { "position":this.position.clone(), "velocity":this.velocity.clone().mult(Math.random()).add(Vector3D.random(this.force*(1-this.elapsed/this.time))), "acceleration":Vector3D.random(this.force*(1-this.elapsed/this.time)), "time":10*Math.random() } );
            }
        }

}