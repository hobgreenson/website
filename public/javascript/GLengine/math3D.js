
/************** Vector object ******************/

function Vector(n) {
    this.type = "vector";
    n = n | 0;
    if (n <= 0) {
        console.log("warning: vector length was set equal to 1");
        n = 1;
    }
    this.n = n; 
    this.data = new Float32Array(n);
}

Vector.prototype = {
    
    constructor: Vector,

    zeros: function() {
        for (var i = 0; i < this.n; i++) {
            this.data[i] = 0;
        }
    },

    ones: function() {
        for (var i = 0; i < this.n; i++) {
            this.data[i] = 1;
        }
    },

    unit_basis: function(k) {
        if (k < this.n) {
            this.zeros();
            this.data[k] = 1;
        } else {
            console.log("cannot create unit basis vector k >= n");
        }
    },

    from_data: function(input_data) {
        if (input_data.length === this.n) {
           for (var i = 0; i < this.n; i++) {
               this.data[i] = input_data[i];
           }
        } else {
            console.log("attempted to use from_data with incompatible vector size");
        }
    },

    copy: function(vec) {
        if (vec.n === this.n) {
            for (var i = 0; i < vec.n; i++) {
                this.data[i] = vec.data[i];
            }
        } else {
            console.log("attempted to copy vector of incompatible length");
        }
    },

    print: function() {
        var v = "";
        for (var i = 0; i < this.n; i++) {
            v += this.data[i] + " ";
        }
        console.log(v);
    },

    norm2: function() {
        var s = 0;
        for (var i = 0; i < this.n; i++) {
            s += this.data[i] * this.data[i];
        }
        return Math.sqrt(s);
    },

    normalize: function() {
        var s = this.norm2();
        if (Math.abs(s) > 0.0001 && Math.abs(s - 1.0) > 0.0001) {
            s = Math.sqrt(s);
            for (i = 0; i < this.n; i++) {
                this.data[i] /= s;
            }
        }
    },

    x: function() {
        return this.data[0];
    },

    y: function() {
        return this.data[1];
    },

    z: function() {
        return this.data[2];
    },

    w: function() {
        return this.data[3];
    },

    set_x: function(sx) {
        this.data[0] = sx;
    },

    set_y: function(sy) {
        this.data[1] = sy;
    },

    set_z: function(sz) {
        this.data[2] = sz;
    },

    set_w: function(sw) {
        this.data[3] = sw;
    },

    set_xyzw: function(sx, sy, sz, sw) {
        this.data[0] = sx;
        this.data[1] = sy;
        this.data[2] = sz;
        this.data[3] = sw;
    }
}

/********* Convenience functions for making common vectors *************/

function Vec3(x, y, z) {
    var v = new Vector(3);
    v.from_data([x, y, z]);
    return v;
}

function Vec4(x, y, z, w) {
    var v = new Vector(4);
    v.from_data([x, y, z, w]);
    return v;
}

/************** Matrix object ******************/

function Matrix(n, m) {
    this.type = "matrix";
    n = n | 0;
    if (n <= 0) {
        console.log("warning: column length set equal to 1");
        n = 1;
    }
    this.n = n;
    m = m | 0;
    if (m <= 0) {
        console.log("warning: row length set equal to 1");
        m = 1;
    }
    this.m = m;
    this.data = new Float32Array(n * m);
}

Matrix.prototype = {
    
    constructor: Matrix,
    
    ix: function(i, j) {
        //return this.m * (i | 0) + (j | 0); // row major
        return (i | 0) + this.n * (j | 0);
    },

    zeros: function() {
        for (var i = 0; i < this.data.length; i++) {
            this.data[i] = 0;
        }
    },

    ones: function() {
        for (var i = 0; i < this.data.length; i++) {
            this.data[i] = 1; 
        }
    },

    eye: function() {
        for (var i = 0; i < this.n; i++) {
            for (var j = 0; j < this.m; j++) {
                this.data[this.ix(i, j)] = (i === j) ? 1 : 0;
            }
        }
    },

    transpose: function() {
        for (var i = 0; i < this.n; i++) {
            for (var j = i+1; j < this.m; j++) {
                var ij = this.ix(i, j),
                    ji = this.ix(j, i);
                var temp = this.data[ij];
                this.data[ij] = this.data[ji];
                this.data[ji] = temp;
            }
        }
    },
    
    T: function() {
        this.transpose();
    },

    from_data: function(input_data) {
        if (input_data.length === this.data.length) {
            for (var i = 0; i < input_data.length; i++) {
                this.data[i] = input_data[i];
            }
        } else {
            console.log("attempted to use from_data but input has wrong length");
        }
    },

    copy: function(X) {
        if (X.type !== "matrix") {
            console.log("copy needs a matrix argument");
            return;
        }
        if (X.m === this.m && X.n === this.n) {
            for (var i = 0; i < X.n; i++) {
                for (var j = 0; j < X.m; j++) {
                    this.data[this.ix(i, j)] = X.data[X.ix(i, j)];
                }
            }
        } else {
            console.log("attempted to copy matrix with incompatible size");
        }
    },

    print: function() {
        for (var i = 0; i < this.n; i++) {
            var row = "";
            for (var j = 0; j < this.m; j++) {
                row += this.data[this.ix(i, j)] + " ";
            }
            console.log(row);
        }
    }
}

/********* Convenience functions for making common matrices ***************/

function Mat3() {
    // Returns a 3x3 identity matrix
    var M = new Matrix(3, 3);
    M.eye();
    return M;
}

function Mat4() {
    // Returns a 4x4 identity matrix
    var M = new Matrix(4, 4);
    M.eye();
    return M;
}

function InvMat4(M) {
    if (M.n !== 4 || M.m !== 4) {
        console.log('argument must be a 4x4 matrix');
        return null;
    }
    
    var I = Mat4(),
        s = M.data,
        inv = I.data;

    inv[0]  =   s[5]*s[10]*s[15] - s[5] *s[11]*s[14] - s[9] *s[6]*s[15]
              + s[9]*s[7] *s[14] + s[13]*s[6] *s[11] - s[13]*s[7]*s[10];
    inv[4]  = - s[4]*s[10]*s[15] + s[4] *s[11]*s[14] + s[8] *s[6]*s[15]
              - s[8]*s[7] *s[14] - s[12]*s[6] *s[11] + s[12]*s[7]*s[10];
    inv[8]  =   s[4]*s[9] *s[15] - s[4] *s[11]*s[13] - s[8] *s[5]*s[15]
              + s[8]*s[7] *s[13] + s[12]*s[5] *s[11] - s[12]*s[7]*s[9];
    inv[12] = - s[4]*s[9] *s[14] + s[4] *s[10]*s[13] + s[8] *s[5]*s[14]
              - s[8]*s[6] *s[13] - s[12]*s[5] *s[10] + s[12]*s[6]*s[9];

    inv[1]  = - s[1]*s[10]*s[15] + s[1] *s[11]*s[14] + s[9] *s[2]*s[15]
              - s[9]*s[3] *s[14] - s[13]*s[2] *s[11] + s[13]*s[3]*s[10];
    inv[5]  =   s[0]*s[10]*s[15] - s[0] *s[11]*s[14] - s[8] *s[2]*s[15]
              + s[8]*s[3] *s[14] + s[12]*s[2] *s[11] - s[12]*s[3]*s[10];
    inv[9]  = - s[0]*s[9] *s[15] + s[0] *s[11]*s[13] + s[8] *s[1]*s[15]
              - s[8]*s[3] *s[13] - s[12]*s[1] *s[11] + s[12]*s[3]*s[9];
    inv[13] =   s[0]*s[9] *s[14] - s[0] *s[10]*s[13] - s[8] *s[1]*s[14]
              + s[8]*s[2] *s[13] + s[12]*s[1] *s[10] - s[12]*s[2]*s[9];

    inv[2]  =   s[1]*s[6]*s[15] - s[1]*s[7]*s[14] - s[5] *s[2]*s[15]
              + s[5]*s[3]*s[14] + s[13]*s[2]*s[7]  - s[13]*s[3]*s[6];
    inv[6]  = - s[0]*s[6]*s[15] + s[0] *s[7]*s[14] + s[4] *s[2]*s[15]
              - s[4]*s[3]*s[14] - s[12]*s[2]*s[7]  + s[12]*s[3]*s[6];
    inv[10] =   s[0]*s[5]*s[15] - s[0] *s[7]*s[13] - s[4] *s[1]*s[15]
              + s[4]*s[3]*s[13] + s[12]*s[1]*s[7]  - s[12]*s[3]*s[5];
    inv[14] = - s[0]*s[5]*s[14] + s[0] *s[6]*s[13] + s[4] *s[1]*s[14]
              - s[4]*s[2]*s[13] - s[12]*s[1]*s[6]  + s[12]*s[2]*s[5];

    inv[3]  = - s[1]*s[6]*s[11] + s[1]*s[7]*s[10] + s[5]*s[2]*s[11]
              - s[5]*s[3]*s[10] - s[9]*s[2]*s[7]  + s[9]*s[3]*s[6];
    inv[7]  =   s[0]*s[6]*s[11] - s[0]*s[7]*s[10] - s[4]*s[2]*s[11]
              + s[4]*s[3]*s[10] + s[8]*s[2]*s[7]  - s[8]*s[3]*s[6];
    inv[11] = - s[0]*s[5]*s[11] + s[0]*s[7]*s[9]  + s[4]*s[1]*s[11]
              - s[4]*s[3]*s[9]  - s[8]*s[1]*s[7]  + s[8]*s[3]*s[5];
    inv[15] =   s[0]*s[5]*s[10] - s[0]*s[6]*s[9]  - s[4]*s[1]*s[10]
              + s[4]*s[2]*s[9]  + s[8]*s[1]*s[6]  - s[8]*s[2]*s[5];

    var det = s[0]*inv[0] + s[1]*inv[4] + s[2]*inv[8] + s[3]*inv[12];
    if (det === 0) {
        console.log('Warning: zero determinant'); 
        I.eye();
    } else {
        det = 1 / det;
        for (i = 0; i < 16; i++) {
            inv[i] = inv[i] * det;
        }
    }

    return I;
}

function Scale4(x, y, z) {
    // Returns a 4x4 scaling matrix
    var S = Mat4()
    S.data[S.ix(0, 0)] = x;
    S.data[S.ix(1, 1)] = y;
    S.data[S.ix(2, 2)] = z;
    return S;
}

function Translate4(x, y, z) {
    var T = Mat4();
    T.data[T.ix(0, 3)] = x;
    T.data[T.ix(1, 3)] = y;
    T.data[T.ix(2, 3)] = z;
    return T;
}

function zRotation(theta) {
    var M = Mat4();
    var sin_theta = Math.sin(deg2rad(theta));
    var cos_theta = Math.cos(deg2rad(theta));
    M.data[0] = cos_theta;
    M.data[1] = sin_theta;
    M.data[4] = -sin_theta;
    M.data[5] = cos_theta;
    return M;
}

function Perspective(fovy, aspect, near, far) {
    var P = new Matrix(4, 4);
    P.zeros();
    fovy = (Math.PI - deg2rad(fovy)) * 0.5;
    var ct = Math.tan(fovy);
    var rd = 1.0 / (near - far);
    P.data[0]  = ct / aspect;
    P.data[5]  = ct;
    P.data[10] = (far + near) * rd;
    P.data[11] = -1;
    P.data[14] = 2 * near * far * rd;
    return P;
}

function setPerspective(P, fovy, aspect, near, far) {
    fovy = (Math.PI - deg2rad(fovy)) * 0.5;
    var ct = Math.tan(fovy);
    var rd = 1.0 / (near - far);
    P.data[0]  = ct / aspect;
    P.data[5]  = ct;
    P.data[10] = (far + near) * rd;
    P.data[11] = -1;
    P.data[14] = 2 * near * far * rd;
}

function LookAt(eye, center, up) {

    L = Mat4();
    L.zeros();
    
    var f = Vec3(0, 0, 0);
    for (var i = 0; i < 3; i++) {
        f.data[i] = center.data[i] - eye.data[i];
    }
    f.normalize(); 
    
    var s = cross(f, up); // r
    s.normalize();
    
    var u = cross(s, f);
    
    L.data[L.ix(0,0)] = s.data[0];
    L.data[L.ix(0,1)] = s.data[1];
    L.data[L.ix(0,2)] = s.data[2];
    L.data[L.ix(0,3)] = -eye.data[0];

    L.data[L.ix(1,0)] = u.data[0];
    L.data[L.ix(1,1)] = u.data[1];
    L.data[L.ix(1,2)] = u.data[2];
    L.data[L.ix(1,3)] = -eye.data[1];

    L.data[L.ix(2,0)] = -f.data[0];
    L.data[L.ix(2,1)] = -f.data[1];
    L.data[L.ix(2,2)] = -f.data[2];
    L.data[L.ix(2,3)] = -eye.data[2];

    L.data[L.ix(3,3)] = 1;
 
    return L;
}

/**************** Quaternion *************************************/
function Quat(theta, x, y, z) {
    var Z = new Quaternion(0, 0, 0, 0);
    Z.set_angle_axis(theta, x, y, z);
    return Z;
}

function Quaternion(a, b, c, d) {
    this.type = "quaternion";
    this.data = Vec4(a, b, c, d);
    this.data.normalize();
}

Quaternion.prototype = {
    set_angle_axis: function(theta, x, y, z) {
        var c = Math.cos(deg2rad(theta) / 2),
            s = Math.sin(deg2rad(theta) / 2);
            d = this.data.data; 
        d[0] = c; 
        d[1] = x * s; 
        d[2] = y * s; 
        d[3] = z * s;
    },

    conjugate: function() {
        return new Quaternion(this.data[0], -this.data[1], 
                             -this.data[2], -this.data[3]); 
    },

    to_matrix: function() {
        
        var w = this.data.x(),
            x = this.data.y(),
            y = this.data.z(),
            z = this.data.w();
        
        var M = Mat4();
        
        // diagonal
        M.data[M.ix(0, 0)] = 1 - 2 * (y * y + z * z);
        M.data[M.ix(1, 1)] = 1 - 2 * (x * x + z * z);
        M.data[M.ix(2, 2)] = 1 - 2 * (x * x + y * y);
        // upper triangle 
        M.data[M.ix(0, 1)] = 2 * (x * y - z * w);
        M.data[M.ix(0, 2)] = 2 * (x * z + y * w);
        M.data[M.ix(1, 2)] = 2 * (y * z - x * w);
        // lower triangle 
        M.data[M.ix(1, 0)] = 2 * (x * y + z * w);
        M.data[M.ix(2, 0)] = 2 * (x * z - y * w);
        M.data[M.ix(2, 1)] = 2 * (y * z + x * w);
       
        return M;
    }
}

function QuatMult(X, Y) {
    var a = X.data.data,
        b = Y.data.data;
    return new Quaternion(a[0]*b[0] - a[1]*b[1] - a[2]*b[2] - a[3]*b[3],
                          a[0]*b[1] + a[1]*b[0] + a[2]*b[3] - a[3]*b[2],
                          a[0]*b[2] - a[1]*b[3] + a[2]*b[0] + a[3]*b[1],
                          a[0]*b[3] + a[1]*b[2] - a[2]*b[1] + a[3]*b[0]);
}

/************** Common operations on Vectors and Matrices ******************/

function MatMult(X, Y) {
    if (X.m !== Y.n) {
        console.log("attempted to use matmult with incompatible argument sizes");
        return null;
    }
    var Z = new Matrix(X.n, Y.m);
    for (var i = 0; i < X.n; i++) {
        for (var j = 0; j < Y.m; j++) {
            var idx = Z.ix(i, j);
            Z.data[idx] = 0;
            for (var k = 0; k < Y.n; k++) {
                Z.data[idx] += X.data[X.ix(i, k)] * Y.data[Y.ix(k, j)];
            }
        }
    }
    return Z;
}

function mmult(X, Y) {
    /*
        Returns a new matrix, vector or scalar Z that is the product of X and Y. Returns
        null on error.
        
        Cases handled:
            1. X and Y both matrices, Z is a matrix;
            2. X a matrix and Y a vector, Y is treated as a column vector, Z is a vector;
            3. X a vector and Y a matrix, X is treated as a row vector, Z is a vector;
            4. X and Y both vectors, Z is a scalar equal to the dot-product
            5. X a scalar and Y a matrix
            6. X a matrix and Y a scalar
            7. X a scalar and Y a vector
            8. X a vector and Y a scalar
            9. X and Y both scalars (this is a bit silly)
    */
    var argtypes = 0;
    if (X.type === "matrix" && Y.type === "matrix") {
        argtypes = 1;
    } else if (X.type === "matrix" && Y.type === "vector") {
        argtypes = 2;
    } else if (X.type === "vector" && Y.type === "matrix") {
        argtypes = 3;
    } else if (X.type === "vector" && Y.type === "vector") {
        argtypes = 4;
    } else if (typeof X === "number" && Y.type === "matrix") {
        argtypes = 5;
    } else if (X.type === "matrix" && typeof Y === "number") {
        argtypes = 6;
    } else if (typeof X === "number" && Y.type === "vector") {
        argtypes = 7;
    } else if (X.type === "vector" && typeof Y === "number") {
        argtypes = 8;
    } else if (typeof X === "number" && typeof Y === "number") {
        return X * Y;
    } else {
        console.log("matmult called with bad argument types");
        return null;
    }

    var Z = null;

    switch (argtypes) {
        
        case 1:
            if (X.m !== Y.n) {
                console.log("attempted to use matmult with incompatible argument sizes");
                break;
            }
            Z = new Matrix(X.n, Y.m);
            for (var i = 0; i < X.n; i++) {
                for (var j = 0; j < Y.m; j++) {
                    var idx = Z.ix(i, j);
                    Z.data[idx] = 0;
                    for (var k = 0; k < Y.n; k++) {
                        Z.data[idx] += X.data[X.ix(i, k)] * Y.data[Y.ix(k, j)];
                    }
                }
            }
            break;
        
        case 2:
            if (X.m !== Y.n) {
                console.log("attempted to use matmult with incompatible argument sizes");
                break;
            }
            Z = new Vector(X.n);
            for (var i = 0; i < X.n; i++) {
                Z.data[i] = 0;
                for (var j = 0; j < X.m; j++) {
                    Z.data[i] += X.data[X.ix(i, j)] * Y.data[j];
                }
            }
            break;
        
        case 3:
            if (X.n !== Y.n) {
                console.log("attempted to use matmult with incompatible argument sizes");
                break;
            }
            Z = new Vector(X.m);
            for (var i = 0; i < X.m; i++) {
                Z.data[i] = 0;
                for (var j = 0; j < X.n; j++) {
                    Z.data[i] += X.data[X.ix(j, i)] * Y.data[j];
                }
            }
            break;

        case 4:
            if (X.n !== Y.n) {
                console.log("attempted to use matmult with incompatible argument sizes");
                break;
            }
            Z = 0;
            for (var i = 0; i < X.n; i++) {
                Z += X.data[i] * Y.data[i];
            }
            break;

        case 5:
            Z = new Matrix(Y.n, Y.m);
            for (var i = 0; i < Y.data.length; i++) {
                Z.data[i] = X * Y.data[i]; 
            }
            break;

        case 6:
            Z = new Matrix(X.n, X.m);
            for (var i = 0; i < X.data.length; i++) {
                Z.data[i] = X.data[i] * Y;
            }
            break;

        case 7:
            Z = new Vector(Y.n);
            for (var i = 0; i < Y.n; i++) {
                Z.data[i] = X * Y.data[i];
            }
            break;
        
        case 8:
            Z = new Vector(X.n);
            for (var i = 0; i < X.n; i++) {
                Z.data[i] = X.data[i] * Y;
            }
            break;

        default:
            console.log("mmult switch-case failed");
            break;
    }

    return Z;
}

function elemmult(X, Y) {
    /*
        Returns a new matrix or vector Z that is the element-wise product of X and Y.
        Returns null on error.

        Cases handled:
            1. X and Y are matrices of the same dimensions, Z is a matrix;
            2. X and Y are vectors of the same dimensions, Z is a vector.
    */
    if (X.type === "matrix" && Y.type === "matrix") {
        var argtypes = 1;
    } else if (X.type === "vector" && Y.type === "vector") {
        var argtypes = 2;
    } else {
        console.log("elemmult called with inappropriate argument types");
        return null;
    }
    
    var Z = null;

    switch (argtypes) {

        case 1:
            if (X.n !== Y.n || X.m !== Y.m) {
                console.log("attempted to use elemmult with incompatible matrix sizes");
                break;
            }
            Z = new Matrix(X.n, X.m);
            for (var i = 0; i < X.n; i++) {
                for (var j = 0; j < X.m; j++) {
                    var idx = Z.index(i, j);
                    Z.data[idx] = X.data[idx] * Y.data[idx];
                }
            }
            break;

        case 2:
            if (X.n !== Y.n) {
                console.log("attempted to use elemmult with incompatible vectors sizes");
                break;
            }
            Z = new Vector(X.n);
            for (var i = 0; i < X.n; i++) {
                Z.data[i] = X.data[i] * Y.data[i];
            }
            break;

        default:
            console.log("elemmult switch-case failed");
            break;
    }

    return Z;
}

function cross(X, Y) {
    /*
        Returns the cross-product of vectors X and Y or null on error.
        Both X and Y must have length 3.
    */
    if (X.type !== "vector" || Y.type !== "vector" || X.n !== 3 || Y.n !== 3) {
        console.log("cross failed: arguments must be vectors of length 3.");
        return null;
    }

    var Z = new Vector(3);
    Z.from_data([X.data[1] * Y.data[2] - X.data[2] * Y.data[1],
                 X.data[2] * Y.data[0] - X.data[0] * Y.data[2],
                 X.data[0] * Y.data[1] - X.data[1] * Y.data[0]]);
    return Z;
}

/************ Common math for GL *****************/

function deg2rad(deg) {
    return Math.PI * (deg / 180.0);
}

function rad2deg(rad) {
    return 180.0 * (rad / Math.PI);
}
