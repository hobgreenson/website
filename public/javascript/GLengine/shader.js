

Shader = {
    
    program_buffer: {},

    add_program: function(name, vshader, fshader) {
        
        var program_object = {};
        program_object.program = Shader.createProgram(vshader(), fshader())

        if (!program_object.program) {
            console.log("Failed to create GLSL program");
        }

        // get attribute locations
        program_object.a_Position = gl.getAttribLocation(program_object.program, "a_Position");
        program_object.a_Normal = gl.getAttribLocation(program_object.program, "a_Normal");
        program_object.a_Texture = gl.getAttribLocation(program_object.program, "a_Texture");
    
        // get uniform locations
        program_object.u_PM = gl.getUniformLocation(program_object.program, 'u_PM');
        program_object.u_Sampler = gl.getUniformLocation(program_object.program, 'u_Sampler');
        program_object.u_DiffuseLight = gl.getUniformLocation(program_object.program, 'u_DiffuseLight');
        program_object.u_LightDirection = gl.getUniformLocation(program_object.program, 'u_LightDirection');
        program_object.u_AmbientLight = gl.getUniformLocation(program_object.program, 'u_AmbientLight');
        
        Shader.program_buffer[name] = program_object;
    },

    createProgram: function(vshader, fshader) {

        var vertex_shader = Shader.load_shader(gl.VERTEX_SHADER, vshader),
            fragment_shader = Shader.load_shader(gl.FRAGMENT_SHADER, fshader);
    
        if (!vertex_shader || !fragment_shader) {
            return null;
        }

        var program = gl.createProgram();
        gl.attachShader(program, vertex_shader);
        gl.attachShader(program, fragment_shader);
        gl.bindAttribLocation(program, 0, "a_Position"); // mega hack!
        gl.linkProgram(program);

        var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linked) {
            var error = gl.getProgramInfoLog(program);
            console.log("Failed to link GLSL program: " + error);
            gl.deleteProgram(program);
            gl.deleteShader(fragment_shader);
            gl.deleteShader(vertex_shader);
            return null;
        }

        return program;
    },

    load_shader: function(type, src) {

        var shader = gl.createShader(type);
        if (shader === null) {
            console.log("unable to create shader");
            return null;
        }

        gl.shaderSource(shader, src);
        gl.compileShader(shader);

        var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            var error = gl.getShaderInfoLog(shader);
            console.log("Failed to compile shader: " + error);
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }
}



