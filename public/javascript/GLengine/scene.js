
Scene = {

    entity_buffer: [],

    u_P: null,

    add_entity: function(entity) {
        Scene.entity_buffer.push(entity);
    },

    resize: function() {
        
        var real_to_CSS_pix = window.devicePixelRatio || 1;

        var display_width  = Math.floor(gl.canvas.clientWidth) * real_to_CSS_pix,
            display_height = Math.floor(gl.canvas.clientHeight) * real_to_CSS_pix;

        if (gl.canvas.width != display_width ||
            gl.canvas.height != display_height) {

            gl.canvas.width = display_width;
            gl.canvas.height = display_height;

            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        }
    },
    
    draw: function(entity) {
        
        var program = Shader.program_buffer[entity.program_name],
            mesh = Geometry.mesh_buffer[entity.mesh_name];
        
        gl.useProgram(program.program);
            
        if (program.u_PM) {
            gl.uniformMatrix4fv(program.u_PM, false, MatMult(Scene.u_P, entity.get_M()).data);
        }

        var vlen = mesh.vertex_length,
            nbytes = mesh.FSIZE;

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertex_buffer_id);
            
        if (program.a_Position >= 0) {
            gl.enableVertexAttribArray(program.a_Position);
            gl.vertexAttribPointer(program.a_Position, 3, gl.FLOAT, 
                                   false, vlen * nbytes, 0)
        }
        if (program.a_Normal >= 0) {
            gl.enableVertexAttribArray(program.a_Normal);
            gl.vertexAttribPointer(program.a_Normal, 3, gl.FLOAT, 
                                       false, vlen * nbytes, 3 * nbytes)
        }
        if (program.a_Texture >= 0) {
            gl.enableVertexAttribArray(program.a_Texture);
            gl.vertexAttribPointer(program.a_Texture, 2, gl.FLOAT, 
                                   false, vlen * nbytes, 6 * nbytes)
        }
        if (entity.texture_name) {
            var tex = Texture.texture_buffer[entity.texture_name];
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, tex.tex_id);
            gl.uniform1i(program.u_Sampler, 0);
        }
           
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.index_buffer_id);
        gl.drawElements(gl.TRIANGLES, mesh.n_indices, gl.UNSIGNED_BYTE, 0);
    },

    draw_all: function() {
        Scene.resize();
        setPerspective(Scene.u_P, 90, gl.canvas.width / gl.canvas.height, 1, 100)
        for (var i = 0; i < Scene.entity_buffer.length; i++) {
            Scene.draw(Scene.entity_buffer[i]);
        }
    }
}




