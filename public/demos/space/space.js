function main() {
    
    // init WebGL context
    var canvas = document.getElementById('glcanvas');
    var gl = initWebGL(canvas);
    if (!gl) {
        console.log('Failed to initialize OpenGL context!');
    } 
     
    // init shaders 
    var shader = new Shader();
    shader.add_program('simple', simple_vert, simple_frag);

    // init texture
    var texture = new Texture(); 
    //texture.add_texture('grating', './../../../resources/grating.png');

    // init geometry
    var geometry = new Geometry();
    geometry.add_mesh('player1', function(mesh) {
        return unit_cube(mesh); 
    });

    // init player1
    var player1 = new Entity();
    player1.program_name = 'simple';
    player1.mesh_name = 'player1';
    player1.u_T = Translate4(0, 0, -3); 

    // init scene
    var scene = new Scene(canvas, shader, texture, geometry);
    scene.add_entity(player1);

    // user-interface event handling
    var ui = {
        prev_x: 0,
        prev_y: 0,
        curr_x: 0,
        curr_y: 0,
        dx: 0,
        dy: 0,
        z_axis: Vec3(0, 0, -1),
        mouse_is_down: false,
        vel: Vec3(0, 0, 0),
    };
    
    // mouse events
    canvas.addEventListener("mousedown", function(e) {
        ui.mouse_is_down = true;
        ui.prev_x = e.clientX;
        ui.prev_y = e.clientY;
        ui.vel.set_x(0);
        ui.vel.set_y(0);
    }, false);

    document.addEventListener("mouseup", function(e) {
        ui.mouse_is_down = false;
    }, false);    

    document.addEventListener("mousemove", function(e) {
        if (!ui.mouse_is_down) {
            return;
        }
        ui.curr_x = e.clientX;
        ui.curr_y = e.clientY;
        ui.dx = ui.curr_x - ui.prev_x;
        ui.dy = ui.prev_y - ui.curr_y; // flips y-axis 
        ui.prev_x = ui.curr_x;
        ui.prev_y = ui.curr_y;
        ui.vel.set_x(ui.dx);
        ui.vel.set_y(ui.dy);
        var ax = cross(ui.vel, ui.z_axis);
        var W = Quat(1, ax.x(), ax.y(), ax.z());
        for (var i = 0; i < scene.entity_buffer.length; i++) {
            scene.entity_buffer[i].quat = QuatMult(W, scene.entity_buffer[i].quat);
        }
    }, false);
    
    // touch events
    canvas.addEventListener("touchstart", function(e) {
        ui.is_touching = true;
        ui.prev_x = e.touches[0].clientX;
        ui.prev_y = e.touches[0].clientY;
        ui.vel.set_x(0);
        ui.vel.set_y(0); 
    }, false);
    
    canvas.addEventListener("touchend", function(e) {
        ui.is_touching = false;
    }, false);

    canvas.addEventListener("touchmove", function(e) {
        if (!ui.is_touching) {
            return;
        }
        ui.curr_x = e.touches[0].clientX;
        ui.curr_y = e.touches[0].clientY;
        ui.dx = ui.curr_x - ui.prev_x;
        ui.dy = ui.prev_y - ui.curr_y; // flips y-axis 
        ui.prev_x = ui.curr_x;
        ui.prev_y = ui.curr_y;
        ui.vel.set_x(ui.dx);
        ui.vel.set_y(ui.dy);
        var ax = cross(ui.vel, ui.z_axis);
        var W = Quat(1, ax.x(), ax.y(), ax.z());
        for (var i = 0; i < scene.entity_buffer.length; i++) {
            scene.entity_buffer[i].quat = QuatMult(W, scene.entity_buffer[i].quat);
        } 
    }, false);

    // set some gl state
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    
    // timing variables
    var dt = 0.0,
        frameTime = 0.0,
        t_prev = Date.now(),
        t_curr = Date.now();
    
    // draw loop
    var tick = function() {
        t_curr = Date.now();
        dt = t_curr - t_prev;
        t_prev = t_curr;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        scene.draw(canvas);
        requestAnimationFrame(tick, canvas);
    }
    tick();
}

