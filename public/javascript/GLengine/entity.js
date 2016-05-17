
function Entity() {
    this.program_name = null;
    this.mesh_name    = null;
    this.texture_name = null;
    this.u_T = Mat4()
    this.quat = Quat(1, 0, 0, 0);
}

Entity.prototype = { 

    set_quat: function(theta, x, y, z) {
        this.quat.set_angle_axis(theta, x, y, z);
    },

    get_M: function() {
        return MatMult(this.u_T, this.quat.to_matrix());
    }

}
