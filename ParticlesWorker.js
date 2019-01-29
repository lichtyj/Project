class Vector3D {
    constructor(x, y, z) {
        if (arguments.length == 0) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        } else {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
        return this;
    }

    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        this.z -= vector.z;
        return this;
    }

    div(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;
        return this;
    }

    mult(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }

    limit(max) {
        var mag = this.magnitude();
        if (mag > max) this.div(mag/max);
        return this;
    }

    // angle() {
    //     var a = Math.atan(this.y/this.x);
    //     if (this.x < 0) a += Math.PI;
    //     return a;
    // }
    
    // angleTo(vector) {
    //     if (vector instanceof Vector) {
    //         var a = Math.atan((vector.y - this.y)/(vector.x - this.x));
    //         if (vector.x < this.x) a += Math.PI;
    //         return a;
    //     }
    // }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    MagnitudeSqrd() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    equals(other) {
        if (!(other instanceof Vector3D)) return false;
        return (this.x == other && this.y == other.y && this.z == other.z);
    }

    clone() {
        return new Vector3D(this.x, this.y, this.z);
    }

    static random(max) {
        if (max == undefined) max = 1;
        var v = new Vector3D((Math.random()*2-1)*max, (Math.random()*2-1)*max, (Math.random()*2-1)*max);
        return v.limit(max);
    }
    
    static zero() {
        return new Vector3D(0, 0, 0);
    }

    static distance(me, other) {
        return Math.sqrt(Math.pow(me.x - other.x, 2) + Math.pow(me.y - other.y, 2) + Math.pow(me.z - other.z, 2));
    }

    static distanceSqrd(me, other) {
        return Math.pow(me.x - other.x, 2) + Math.pow(me.y - other.y, 2) + Math.pow(me.z - other.z, 2);
    }
}

onmessage = function(e) {
    switch(e.data.title) {
        case "init":
            postMessage(init(e.data.msg));
            break;
        case "update":
            update(e.data.msg);
            break;
        case "draw":
            draw(e.data.msg);
            break;
    }
}


init = function(msg) {
    var emitter = {
        "position": msg.position,
        "velocity": msg.velocity,
        "acceleration": new Vector3D(),
        "rate": msg.rate,
        "force": msg.force,
        "hue": msg.hue,
        "time": msg.time,
        "elapsed": 0,
        "particles": [],
        "count": 10
    }

    if (emitter.velocity.z < 0) {
        emitter.velocity.z *= -1;
    }

    for (var i = 0; i < emitter.count; i++) {
        emitter.particles.push( { "position": emitter.position.clone(), 
                          "velocity": emitter.velocity.clone().mult(Math.random()).add(Vector3D.random(emitter.force)), 
                          "acceleration":Vector3D.random(emitter.force/20), 
                          "time":10*Math.random() } );
    }

    return emitter;
}

update = function(emitter) {
    emitter.position.add(emitter.velocity);
    emitter.velocity.add(emitter.acceleration);
    emitter.velocity.div(1.1);

    if (emitter.elapsed < emitter.time) {
        emitter.elapsed++;
        for (var i = 0; i < emitter.rate*(1-emitter.elapsed/emitter.time); i++) {
            emitter.particles.push( { 
                "position":emitter.position.clone(), 
                "velocity":emitter.velocity.clone().mult(Math.random()).add(Vector3D.random(emitter.force*(1-emitter.elapsed/emitter.time))), 
                "acceleration":Vector3D.random(emitter.force*(1-emitter.elapsed/emitter.time)), 
                "time":10*Math.random() } );
        }
    }

    emitter.count = emitter.particles.length
    for (var i = emitter.count-1; i >= 0; i--) {
        emitter.particles[i].acceleration.z -= 1;
        emitter.particles[i].velocity.add(emitter.particles[i].acceleration);
        emitter.particles[i].position.add(emitter.particles[i].velocity);
        emitter.particles[i].velocity.div(1.1);
        if (emitter.particles[i].position.z < 0) {
            emitter.particles[i].position.z = 0;
            if (emitter.particles[i].velocity.z < 0) {
                emitter.particles[i].velocity.z *= -.8;
            }
        }
        emitter.particles[i].acceleration.mult(0);
        emitter.particles[i].time -= .1;
        if (emitter.particles[i].time <= 0) {
            emitter.particles[i].position = new Vector3D(0, 0, 0);
            emitter.particles.splice(i, 1);
            emitter.count--;
        }
    }
    if (emitter.count == 0) {
        game.removeParticles(emitter);
    }

}

draw = function(dat) {
    var v = new Uint8ClampedArray(40000);
    var i = 0;
    for (i; i < 40000; i+= 4) {
        v[i] = dat;
        v[i+1] = dat;
        v[i+2] = dat;
        v[i+3] = 255;
        sendMessage("draw", new ImageData(v, 100));
    }
    
}

sendMessage = function(title, msg) {
    postMessage( { "title": title, "msg": msg} );
}

/*
    

    draw(ctx) {
        ctx.globalAlpha = .25;
        for (var i = 0; i < this.count; i++) {
            if (this.particles[i].position.z > 1) {
                ctx.globalCompositeOperation = "multiply";
                ctx.drawImage(this.spriteShadow, this.particles[i].position.x-1, this.particles[i].position.y-1);
            }
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "normal";
        for (var i = 0; i < this.count; i++) {
            //ctx.globalCompositeOperation = "screen";
            ctx.drawImage(this.sprite, this.hue*2, 0, 2, 2, this.particles[i].position.x-1, this.particles[i].position.y-this.particles[i].position.z/2-1,2,2);
        }
    }
}*/