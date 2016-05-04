function main() {
    
    // init WebGL context
    var canvas = document.getElementById('glcanvas');
    var gl = initWebGL(canvas);
    if (!gl) {
        console.log('Failed to initialize OpenGL context!');
    } 
    var cw = canvas.width,
        ch = canvas.height;
     
    
    // init shaders 
    var shader = new Shader();
    shader.add_program('simple', simple_vert, simple_frag);
    shader.add_program('simple_tex', simple_vert, simple_tex_frag); 
    shader.add_program('simple_tex_conv', simple_vert_conv, simple_tex_frag);

    // init texture
    var texture = new Texture(); 
    texture.add_texture('grating', './../../../resources/grating.png');

    // init geometry
    var geometry = new Geometry();
    geometry.add_mesh('test', unit_square);
    geometry.add_mesh('objective', function(mesh) {
        return cylinder(mesh, 
                        2, // height
                        [0.5, 0.5, 0.5, 0.5, 0.2], // radius
                        10, // theta_steps
                        true, // capped
                        false,// half-cylinder
                        [0.2, 0.2, 0.7, 1]//color 
                       );
    });
    geometry.add_mesh('cylinder', function(mesh) {
        return cylinder(mesh, 
                        0.5, // height
                        1, // radius
                        10, // theta_steps
                        true, // capped
                        false,// half-cylinder
                        [0.7, 0.7, 0.7, 1]//color 
                       );
    });
    geometry.add_mesh('hcylinder', function(mesh) {
        return cylinder(mesh, 
                        1, // height
                        1.05, // radius
                        10, // theta_steps
                        true, // capped
                        true,// half-cylinder
                        [1, 1, 1, 1]//color 
                       );
    }); 
    
    // init entities
    var base = new Entity(),
        scrn = new Entity(),
        objective = new Entity();
    
    base.program_name = 'simple';
    base.mesh_name = 'cylinder';
    
    scrn.program_name = 'simple_tex';
    scrn.mesh_name = 'hcylinder';
    scrn.texture_name = 'grating';
    scrn.translate_xyz(0, 0, -0.25);
    
    objective.program_name = 'simple';
    objective.mesh_name = 'objective';
    objective.translate_xyz(0, 0, -1.5);
    
    // init scene
    var scene = new Scene(shader, texture, geometry);
    scene.add_entity(base);
    scene.add_entity(scrn);
    scene.add_entity(objective);
    
    // Some quats
    var Q = Quat(120, 1, 0, 0);
    var T = Translate4(0, 0, -5);
    
    // set scene PV matrix 
    var P = Perspective(45, cw / ch, 0.1, 100);
    scene.u_PV = mmult(P, mmult(T, Q.to_matrix()));
    
    // stuff for shifting the grating texture
    var tex_offset = 0,
        du = 20.0 / 180.0; 
    scene.tex_offset = tex_offset; 

    // keyboard and mouse event handling
    var shader_toggle = 0;
    document.onkeydown = function(e) {
        if (shader_toggle === 0) {
            scene.entity_buffer[1].program_name = 'simple_tex';
            shader_toggle = 1;
        } else if (shader_toggle === 1) {
            scene.entity_buffer[1].program_name = 'simple_tex';
            shader_toggle = 2;
            du = -du;
        } else {
            scene.entity_buffer[1].program_name = 'simple_tex_conv';
            shader_toggle = 0;
            du = Math.abs(du);
        }
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
        Q = QuatMult(W, Q);
        V = mmult(T, Q.to_matrix()); 
        scene.u_PV = mmult(P, V);  
    };

    // set some gl state
    gl.clearColor(0.5, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    //gl.enable(gl.CULL_FACE);
    
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
        tex_offset += du * dt / 1000.0;
        if (tex_offset > 1) {
            tex_offset -= 1;
        }
        scene.tex_offset = tex_offset;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        scene.draw();
        requestAnimationFrame(tick, canvas);
    }
    tick();
}

