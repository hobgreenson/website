function main() {
    
    // init WebGL context
    var canvas = document.getElementById('glcanvas');
    var gl = initWebGL(canvas);
    if (!gl) {
        console.log('Failed to initialize OpenGL context!');
    } 
     
    // init shaders 
    var shader = new Shader();
    //shader.add_program('background', background_vert, background_frag);
    shader.add_program('simple', simple_vert, simple_frag);

    // init texture
    var texture = new Texture(); 
    //texture.add_texture('hubble_space', '/resources/hubble_friday.jpg');

    // init geometry
    var geometry = new Geometry();
    //geometry.add_mesh('background', function(mesh) {
    //    return unit_square(mesh); 
    //});
    geometry.add_mesh('cube', function(mesh) {
        return unit_cube(mesh); 
    });
    
    // init background
    /*
    var background = new Entity();
    background.program_name = 'background';
    background.mesh_name = 'background';
    background.texture_name = 'hubble_space';
    */

    // init player1
    var player1 = new Entity();
    player1.program_name = 'simple';
    player1.mesh_name = 'cube';
    player1.u_T = Translate4(0, 0, -2); 
    
    // init player2
    var player2 = new Entity();
    player2.program_name = 'simple';
    player2.mesh_name = 'cube';
    player2.u_T = Translate4(0, -3, -6);
    
    // init player3
    var player3 = new Entity();
    player3.program_name = 'simple';
    player3.mesh_name = 'cube';
    player3.u_T = Translate4(0, 3, -6);

    // init player4
    var player4 = new Entity();
    player4.program_name = 'simple';
    player4.mesh_name = 'cube';
    player4.u_T = Translate4(-3, 0, -6);
    
    // init player5
    var player5 = new Entity();
    player5.program_name = 'simple';
    player5.mesh_name = 'cube';
    player5.u_T = Translate4(3, 0, -6);

    // init scene
    var scene = new Scene(canvas, shader, texture, geometry);
    //scene.add_entity(background);
    scene.add_entity(player1);
    scene.add_entity(player2); 
    scene.add_entity(player3);
    scene.add_entity(player4); 
    scene.add_entity(player5);

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
        var ax = cross(ui.vel, ui.z_axis)
        ax.normalize();
        var W = Quat(Math.sqrt(ui.vel.norm2()), ax.x(), ax.y(), ax.z());
        for (var i = 0; i < scene.entity_buffer.length; i++) {
            scene.entity_buffer[i].quat = QuatMult(W, scene.entity_buffer[i].quat);
        }
    }, false);
    
    // touch events
    canvas.addEventListener("touchstart", function(e) {
        e.preventDefault();
        ui.is_touching = true;
        ui.prev_x = e.touches[0].clientX;
        ui.prev_y = e.touches[0].clientY;
        ui.vel.set_x(0);
        ui.vel.set_y(0); 
    }, false);
    
    canvas.addEventListener("touchend", function(e) {a
        e.preventDefault();
        ui.is_touching = false;
    }, false);

    canvas.addEventListener("touchmove", function(e) {
        e.preventDefault();
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
        var ax = cross(ui.vel, ui.z_axis)
        ax.normalize();
        var W = Quat(Math.sqrt(ui.vel.norm2()), ax.x(), ax.y(), ax.z());
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
   
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
    //scene.draw_all(canvas); 
    
    // draw loop
    var tick = function() {
        t_curr = Date.now();
        dt = t_curr - t_prev;
        t_prev = t_curr;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        scene.draw_all(canvas);
        requestAnimationFrame(tick, canvas);
    }
    tick();
}

