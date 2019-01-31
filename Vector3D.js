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

    offset(offset) {
        return new Vector3D(this.position.x + Math.cos(this.angle()*offset.x), this.position.y + Math.sin(this.angle() * offset.y));
    }

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

    set(vector) {
        this.x = vector.x;
        this.y = vector.y;
        this.z = vector.z;
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