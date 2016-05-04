
function Scene(shader, texture, geometry) {
    this.shader = shader;
    this.texture = texture;
    this.geometry = geometry;
    this.entity_buffer = [];
    this.u_PV = Mat4(); // projection * view matrix
}

Scene.prototype = {

    add_entity: function(entity) {
        this.entity_buffer.push(entity);
    },

    draw: function() {

        for (var i = 0; i < this.entity_buffer.length; i++) {
                
            var entity = this.entity_buffer[i],
                program = this.shader.program_buffer[entity.program_name],
                mesh = this.geometry.mesh_buffer[entity.mesh_name]; 

            gl.useProgram(program.program); 
            gl.uniformMatrix4fv(program.u_PV, false, this.u_PV.data);
            gl.uniformMatrix4fv(program.u_M, false, entity.u_M.data); 
            if (program.u_Offset) {
                gl.uniform1f(program.u_Offset, this.tex_offset);
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
                gl.vertexAttribPointer(program.a_normal, 3, gl.FLOAT, 
                                       false, vlen * nbytes, 3 * nbytes)
            }
            if (program.a_Color >= 0) {
                gl.enableVertexAttribArray(program.a_Color);
                gl.vertexAttribPointer(program.a_Color, 4, gl.FLOAT, 
                                       false, vlen * nbytes, 6 * nbytes)
            }
            if (program.a_Texture >= 0) {
                gl.enableVertexAttribArray(program.a_Texture);
                gl.vertexAttribPointer(program.a_Texture, 2, gl.FLOAT, 
                                       false, vlen * nbytes, 10 * nbytes)
            }
            if (entity.texture_name) {
                var tex = this.texture.texture_buffer[entity.texture_name];
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, tex.tex_id);
                gl.uniform1i(program.u_Sampler, 0);
            }
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.index_buffer_id);
                
            gl.drawElements(gl.TRIANGLES, mesh.n_indices, gl.UNSIGNED_BYTE, 0);
        }
    }
}




