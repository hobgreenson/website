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
    
    // keyboard and mouse event handling
    document.onkeydown = function(e) {
    };
    
    var mouse_down = false,
        prev_x = 0,
        prev_y = 0,
        curr_x = 0,
        curr_y = 0,
        dx = 0,
        dy = 0,
        mouse_vec = Vec3(0, 0, 0),
        z_axis = Vec3(0, 0, -1),
        W = new Quat(0, 0, 1, 0);
       
    canvas.onmousedown = function (e) {
        mouse_down = true;
        prev_x = e.clientX;
        prev_y = e.clientY;
        mouse_vec.set_x(0);
        mouse_vec.set_y(0);
    };
    
    document.onmouseup = function (e) {
        mouse_down = false;
    };
    
    document.onmousemove = function (e) {
        if (!mouse_down) {
            return;
        }
        curr_x = e.clientX;
        curr_y = e.clientY;
        dx = curr_x - prev_x;
        dy = prev_y - curr_y; // flips y-axis 
        prev_x = curr_x;
        prev_y = curr_y;
        mouse_vec.set_x(dx);
        mouse_vec.set_y(dy);
        var ax = cross(mouse_vec, z_axis);
        var W = Quat(1, ax.x(), ax.y(), ax.z());
        player1.quat = QuatMult(W, player1.quat);
    };

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

