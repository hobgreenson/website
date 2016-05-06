
function Entity() {
    this.program_name = null;
    this.mesh_name    = null;
    this.texture_name = null;
    this.u_M = Mat4()
    this.quat = Quat(1, 0, 0, 0);
}

Entity.prototype = { 

    scale_xyz: function(x, y, z) {
        var S = Scale4(x, y, z);
        this.u_M = mmult(this.u_M, S);
    },

    translate_xyz: function(x, y, z) {
        var T = Translate4(x, y, z);
        this.u_M = mmult(this.u_M, T);
    },
    
    set_quat: function(theta, x, y, z) {
        this.quat.set_angle_axis(theta, x, y, z);
    },

    set_quat_axis: function(x, y, z) {
        this.quat.set_axis(x, y, z);
    },

    set_quat_angle: function(theta) {
        this.quat.set_angle(theta);
    },

    quat_rotate: function() {
        this.u_M = MatMult(this.u_M, this.quat.to_matrix());
    }
}
