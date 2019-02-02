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
        "acceleration": new Vector(),
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
                          "velocity": emitter.velocity.clone().mult(Math.random()).add(Vector.random(emitter.force)), 
                          "acceleration":Vector.random(emitter.force/20), 
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
                "velocity":emitter.velocity.clone().mult(Math.random()).add(Vector.random(emitter.force*(1-emitter.elapsed/emitter.time))), 
                "acceleration":Vector.random(emitter.force*(1-emitter.elapsed/emitter.time)), 
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
            emitter.particles[i].position = new Vector(0, 0, 0);
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