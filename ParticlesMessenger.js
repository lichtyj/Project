class Particles {
    constructor(ctx) {
        this.emitters = [];
        this.worker;
        this.ctx = ctx;
    }

    init() {
        this.worker = new Worker("ParticlesWorker.js");
        var that = this;
        this.worker.onmessage = function(e){
            switch(e.data.title) {
                case "init":
                    emitters.push(e.data.msg);
                    break;
                case "draw":
                    that.imgData = e.data.msg;
                    break;
                default:
                    break;
            }
            //console.log(e.data.title);
          };
    }

    sendMessage(title, msg) {
        this.worker.postMessage( {"title": title, "msg":msg} );
    }

    createEmitter(position, velocity, rate, force, hue, time) {
        this.sendMessage( "init", 
        { "position": position,
            "velocity": velocity,
            "rate": rate, 
            "force": force, 
            "hue": hue,
            "time": time} );
    }

    draw() {
        for (var e of emitters)
        this.ctx.putImageData(this.imgData, e.position.x, e.position.y);
    }
}