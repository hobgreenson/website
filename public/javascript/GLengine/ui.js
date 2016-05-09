
var ui = {

    prev_x = 0,
    prev_y = 0,
    curr_x = 0,
    curr_y = 0,
    dx = 0,
    dy = 0,
    z_axis = Vec3(0, 0, -1),
    mouse_is_down = false,
    mouse_vec = Vec3(0, 0, 0)
    
    // touch events
    //canvas.addEventListener("touchstart", this.handle_touches_start, false);
    //canvas.addEventListener("touchend", this.handle_touches_end, false);
    //canvas.addEventListener("touchcancel", this.handle_touches_cancel, false);
    //canvas.addEventListener("touchmove", this.handle_tocuhes_move, false);
    //this.ongoingTouches = new Array();
}

function mouse_down(e) {
    ui.mouse_is_down = true;
    ui.prev_x = e.clientX;
    ui.prev_y = e.clientY;
    ui.mouse_vec.set_x(0);
    ui.mouse_vec.set_y(0);
}

function mouse_up(e) {
    ui.mouse_is_down = false;
}    

function mouse_move(e) {
    if (!ui.mouse_is_down) {
        return;
    }
    ui.curr_x = e.clientX;
    ui.curr_y = e.clientY;
    ui.dx = ui.curr_x - ui.prev_x;
    ui.dy = ui.prev_y - ui.curr_y; // flips y-axis 
    ui.prev_x = ui.curr_x;
    ui.prev_y = ui.curr_y;
    ui.mouse_vec.set_x(ui.dx);
    ui.mouse_vec.set_y(ui.dy);
    var ax = cross(ui.mouse_vec,ui.z_axis);
    var W = Quat(1, ax.x(), ax.y(), ax.z());
    for (var i = 0; i < scene.entity_buffer.length; i++) {
        scene.entity_buffer[i].quat = QuatMult(W, scene.entity_buffer[i].quat);
    }
}
