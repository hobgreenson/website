
function main() {
    
    // init WebGL context
    var gl = initWebGL(document.getElementById('glcanvas'));
    if (!gl) {
        console.log('Failed to initialize OpenGL context!');
    }

    // Set the initial perspective matrix using canvas aspect ratio
    Scene.u_P = Perspective(90, gl.canvas.width / gl.canvas.height, 1, 100); 
    
    // Make some shaders
    Shader.add_program('background', background_vert, background_frag);
    Shader.add_program('simple', simple_vert, simple_frag);

    // Load a texture
    Texture.add_texture('hubble_space', '/resources/hubble_friday.jpg');

    // Make some meshes
    Geometry.add_mesh('background', unit_square);
    Geometry.add_mesh('cube', unit_cube); 
    
    // Make a background entity
    var background = new Entity();
    background.program_name = 'background';
    background.mesh_name = 'background';
    background.texture_name = 'hubble_space';
    Scene.add_entity(background);
    
    // Init players
    for (var i = 0; i < 5; i++) {
        var p = new Entity();
        p.program_name = 'simple';
        p.mesh_name = 'cube';
        Scene.add_entity(p);
    }

    // Translate players into position (sorry this is ugly) 
    Scene.entity_buffer[1].u_T = Translate4(0, 0, -2); 
    Scene.entity_buffer[2].u_T = Translate4(0, -3, -6);
    Scene.entity_buffer[3].u_T = Translate4(0, 3, -6);
    Scene.entity_buffer[4].u_T = Translate4(-3, 0, -6);
    Scene.entity_buffer[5].u_T = Translate4(3, 0, -6);
    
    // Socket.IO event handling
    UI.socket = io();
    UI.socket.on('move', UI.sock_move);

    // Hook-up UI callbacks
    gl.canvas.addEventListener("mousedown", UI.mouse_down, false);
    gl.canvas.addEventListener("touchstart", UI.touch_down, false);
    document.addEventListener("mousemove", UI.mouse_move, false);
    document.addEventListener("touchmove", UI.touch_move, false);
    document.addEventListener("mouseup", UI.touch_or_mouse_up, false);    
    document.addEventListener("touchend", UI.touch_or_mouse_up, false);

    // set some gl state
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    
    // timing variables
    var dt = 0.0,
        t_prev = Date.now(),
        t_curr = Date.now();
   
    // draw loop
    var tick = function() {
        t_curr = Date.now();
        dt = t_curr - t_prev;
        t_prev = t_curr;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        Scene.draw_all();
        requestAnimationFrame(tick, gl.canvas);
    }
    tick();
}

