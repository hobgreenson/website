
var UI = {
    
    socket: null,

    prev_x: 0,
    prev_y: 0,
        
    curr_x: 0,
    curr_y: 0,
        
    z_axis: Vec3(0, 0, -1),
      
    touch_or_mouse_down: false,
        
    vel: Vec3(0, 0, 0),
        
    mouse_down: function(e) {
        UI.touch_or_mouse_down = true;
        UI.prev_x = e.clientX;
        UI.prev_y = e.clientY;
        UI.vel.set_x(0);
        UI.vel.set_y(0);
    },

    touch_down: function(e) {
        e.preventDefault();
        UI.touch_or_mouse_down = true;
        UI.prev_x = e.touches[0].clientX;
        UI.prev_y = e.touches[0].clientY;
        UI.vel.set_x(0);
        UI.vel.set_y(0);
    },

    sock_move: function(data) {
        var W = Quat(data.vel, data.x, data.y, data.z);
        for (var i = 1; i < Scene.entity_buffer.length; i++) {
            Scene.entity_buffer[i].quat = QuatMult(W, Scene.entity_buffer[i].quat);
        }  
    },

    move: function(x, y) {
        UI.curr_x = x;
        UI.curr_y = y;
        var dx = UI.curr_x - UI.prev_x;
        var dy = UI.prev_y - UI.curr_y; // flips y-axis 
        UI.prev_x = UI.curr_x;
        UI.prev_y = UI.curr_y;
        UI.vel.set_x(dx);
        UI.vel.set_y(dy);
        var ax = cross(UI.vel, UI.z_axis)
        ax.normalize();
        var v = Math.sqrt(UI.vel.norm2());
        var W = Quat(v, ax.x(), ax.y(), ax.z());
        for (var i = 1; i < Scene.entity_buffer.length; i++) {
            Scene.entity_buffer[i].quat = QuatMult(W, Scene.entity_buffer[i].quat);
        }
        UI.socket.emit('move', {vel: v, x: ax.x(), y: ax.y(), z: ax.z()});
    },

    mouse_move: function(e) {
        if (!UI.touch_or_mouse_down) {
            return;
        }
        UI.move(e.clientX, e.clientY);
    },
        
    touch_move: function(e) {
        if (!UI.touch_or_mouse_down) {
            return;
        }
        e.preventDefault();
        UI.move(e.touches[0].clientX, e.touches[0].clientY);
    },

    touch_or_mouse_up: function(e) {
       UI.touch_or_mouse_down = false;
    }

};


