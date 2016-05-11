

function Vertex() {
    this.length   = 8;
    this.position = Vec3(0, 0, 0);
    this.normal   = Vec3(0, 0, 0);
    this.texture  = Vec2(0, 0);
}

Vertex.prototype = {

    x: function() {
        return this.position.data[0];
    },
    
    set_x: function(sx) {
        this.position.data[0] = sx;
    },
    
    y: function() {
        return this.position.data[1];
    },
    
    set_y: function(sy) {
        this.position.data[1] = sy;
    },

    z: function() {
        return this.position.data[2];
    },
    
    set_z: function(sz) {
        this.position.data[2] = sz;
    },

    set_xyz: function(sx, sy, sz) {
        this.set_x(sx);
        this.set_y(sy);
        this.set_z(sz);
    },
    
    nx: function() {
        return this.normal.data[0];
    },
    
    set_nx: function(sx) {
        this.normal.data[0] = sx;
    },
    
    ny: function() {
        return this.normal.data[1];
    },
    
    set_ny: function(sy) {
        this.normal.data[1] = sy;
    },

    nz: function() {
        return this.normal.data[2];
    },
    
    set_nz: function(sz) {
        this.normal.data[2] = sz;
    },
    
    set_nxyz: function(sx, sy, sz) {
        this.set_nx(sx);
        this.set_ny(sy);
        this.set_nz(sz);
    },
    
    u: function() {
        return this.texture.data[0];
    },

    v: function() {
        return this.texture.data[1];
    },

    set_u: function(su) {
        this.texture.data[0] = su;
    },

    set_v: function(sv) {
        this.texture.data[1] = sv;
    },

    set_uv: function(su, sv) {
        this.set_u(su);
        this.set_v(sv);
    },
    
    print: function() {
        this.position.print();
        this.normal.print();
    }
}

function Mesh() {
    this.n_vertices       = 0;
    this.n_indices        = 0;
    this.vertex_length    = 0;
    this.vertex_data      = null;
    this.index_data       = null;
    this.FSIZE            = 4;
}

Mesh.prototype = { 

    set_vertex_data: function(data) {
        this.n_vertices = data.length;
        this.vertex_length = data[0].length;
        this.vertex_data = new Float32Array(this.vertex_length * this.n_vertices);
        var j = 0;
        for (var i = 0; i < this.n_vertices; i++) {
            var v = data[i];
            this.vertex_data[j]     = v.x();
            this.vertex_data[j + 1] = v.y();
            this.vertex_data[j + 2] = v.z();
            this.vertex_data[j + 3] = v.nx();
            this.vertex_data[j + 4] = v.ny();
            this.vertex_data[j + 5] = v.nz();
            this.vertex_data[j + 6] = v.u();
            this.vertex_data[j + 7] = v.v();
            j += this.vertex_length;
        }
    },

    set_index_data: function(data) {
        this.n_indices = data.length;
        this.index_data = new Uint8Array(data);
    }
}

function Geometry() {
    /* 
        Geometry is intended to be a singleton that
        keeps track of each mesh that has been sent to 
        the GPU via glBufferData.
    */
    this.mesh_buffer = {};
}

Geometry.prototype = {

    add_mesh: function(mesh_name, mesh_func) {
        /*
            Sends a mesh (vertex and index data) to the GPU. The mesh
            needs a name to refer to it by (mesh_name), and a function 
            that generates the vertex and index data (mesh_func).
        */
        var mesh = new Mesh();
        mesh_func(mesh);

        var i_buffer_id = gl.createBuffer(),
            v_buffer_id = gl.createBuffer();
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, i_buffer_id);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.index_data, gl.STATIC_DRAW);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, v_buffer_id);
        gl.bufferData(gl.ARRAY_BUFFER, mesh.vertex_data, gl.STATIC_DRAW);

        this.mesh_buffer[mesh_name] = {
            index_buffer_id: i_buffer_id,
            vertex_buffer_id: v_buffer_id,
            n_vertices: mesh.n_vertices,
            n_indices: mesh.n_indices,
            vertex_length: mesh.vertex_length,
            FSIZE: mesh.FSIZE
        };
    }
    
    /*
    delete_mesh: function(gl, mesh_name) {
            TO DO: Deletes mesh data from the GPU.
    }
    */
}

function cylinder(mesh, height, radius, theta_step, capped, half, color) {
    /*
        - height, h_step, raidus, in world coordinates
        - h_steps = number of slices along cyclinder axis
        - radius = can be uniform (a single number or
        an array with length = h_steps + 1
    */

    if (typeof radius === 'number') {
        var r = radius,
            radius = [r, r],
            h_steps = 1;
    } else {
        h_steps = radius.length - 1;
    }
    var h_step_size = height / h_steps;
    
    var n_theta_steps = 360.0 / theta_step,
        theta_offset = 0;
    if (half) {
        capped = false;
        n_theta_steps = 180.0 / theta_step; 
        theta_offset = 1;
    } 
    
    var v = [],    idx = []
        v_idx = 0, i_idx = 0,
        x = 0, y = 0, z = 0;
        
    var r = color[0], g = color[1], b = color[2], a = color[3];
    
    // bottom cap
    z = -height / 2
    if (capped) {
        v.push(new Vertex());
        v[v_idx].set_xyz(x, y, z);
        v[v_idx].set_nxyz(0, 0, 1);
        v[v_idx].set_rgba(r, g, b, a);
        v[v_idx].set_uv(0, 0);
        v_idx += 1;
    }
    for (var i = 0; i < n_theta_steps; i++) {
        x = radius[0] * Math.cos(deg2rad(i * theta_step));
        y = radius[0] * Math.sin(deg2rad(i * theta_step));
        v.push(new Vertex());
        v[v_idx].set_xyz(x, y, z);
        v[v_idx].set_nxyz(0, 0, 1);
        v[v_idx].set_rgba(r, g, b, a);
        v[v_idx].set_uv(i / (n_theta_steps - 1), 0);
        
        if (capped) {
            if (half) {
                if (i === n_theta_steps - 1) {
                    break;
                }
            }
            idx.push(0);
            idx.push(v_idx);
            idx.push((v_idx % n_theta_steps) + 1);
            i_idx += 3;
        }
        
        v_idx += 1;
    }
    
    // shaft
    for (var i = 0; i < n_theta_steps; i++) {
        var tr = v_idx + i,
            br = tr - n_theta_steps,
            tl = ((i + 1) % n_theta_steps) + v_idx,
            bl = tl - n_theta_steps;
            if (half) {
                if (i === n_theta_steps - 1) {
                    break;
                }
            }
            // triangle 1
            idx.push(br);
            idx.push(tr);
            idx.push(tl);
            // triangle 2
            idx.push(br);
            idx.push(tl);
            idx.push(bl);
            
            i_idx += 6;
    }
    
    for (var i = 1; i < h_steps; i++) {
        z = i * h_step_size - (height / 2);
        for (var j = 0; j < n_theta_steps; j++) {
            x = radius[i] * Math.cos(deg2rad(j * theta_step));
            y = radius[i] * Math.sin(deg2rad(j * theta_step));
            v.push(new Vertex());
            v[v_idx].set_xyz(x, y, z);
            v[v_idx].set_nxyz(0, 0, 1);
            v[v_idx].set_rgba(r, g, b, a);
            v[v_idx].set_uv(j / (n_theta_steps - 1), i / (h_steps - 1));
            
            v_idx += 1;
        }
        for (var j = 0; j < n_theta_steps; j++) {
            var tr = v_idx + j,
                br = tr - n_theta_steps,
                tl = ((j + 1) % n_theta_steps) + v_idx,
                bl = tl - n_theta_steps;
            if (half) {
                if (i === n_theta_steps - 1) {
                    break;
                }
            }
            // triangle 1
            idx.push(br);
            idx.push(tr);
            idx.push(tl);
            // triangle 2
            idx.push(br);
            idx.push(tl);
            idx.push(bl);
            
            i_idx += 6;
        }
    }
    
    // top cap
    var start_idx = v_idx, 
        top_center_idx = v_idx + n_theta_steps;
    z = h_steps * h_step_size - (height / 2);
    for (var i = 0; i < n_theta_steps; i++) {
        x = radius[h_steps] * Math.cos(deg2rad(i * theta_step));
        y = radius[h_steps] * Math.sin(deg2rad(i * theta_step));
        v.push(new Vertex());
        v[v_idx].set_xyz(x, y, z);
        v[v_idx].set_nxyz(0, 0, -1);
        v[v_idx].set_rgba(r, g, b, a);
        v[v_idx].set_uv(i / (n_theta_steps - 1), 1);
        
        if (capped) {
            if (half) {
                if (i === n_theta_steps - 1) {
                    break;
                }
            }
            idx.push(top_center_idx);
            idx.push(start_idx + ((i + 1) % n_theta_steps));
            idx.push(v_idx);
            i_idx += 3; 
        }
        
        v_idx += 1;
        
    }
    if (capped) {
        v.push(new Vertex());
        v[v_idx].set_xyz(0, 0, z);
        v[v_idx].set_nxyz(0, 0, -1);
        v[v_idx].set_rgba(r, g, b, a);
        v[v_idx].set_uv(1, 0);
    }
    mesh.set_vertex_data(v);
    mesh.set_index_data(idx); 

}

function unit_square(mesh) {
    var v = [];
    for (var i = 0; i < 4; i++) {
        v.push(new Vertex());
    }
    
    v[0].set_xyz(1, 1, 0.99);
    v[0].set_uv(1, 1);

    v[1].set_xyz(1, -1, 0.99);
    v[1].set_uv(1, 0);
    
    v[2].set_xyz(-1, -1, 0.99);
    v[2].set_uv(0, 0);

    v[3].set_xyz(-1, 1, 0.99);
    v[3].set_uv(0, 1);
    
    var idx = [0, 3, 1, 1, 3, 2];

    mesh.set_vertex_data(v);
    mesh.set_index_data(idx);
}

function unit_cube(mesh) {
    /*
        Sets the vertex and index data of the mesh argument
        to represent a unit cube centered at the origin.
    */
    
    var r = 0.5;
    var i = 0, 
        j = 0;
   
    var v = [];
    for (i = 0; i < 24; i++) {
        v.push(new Vertex());
    }
    
    // front
    i = 0;
    v[i    ].set_xyz( r,  r, r);
    v[i + 1].set_xyz(-r,  r, r);
    v[i + 2].set_xyz(-r, -r, r);
    v[i + 3].set_xyz( r, -r, r);
    for (j = i; j < i + 4; j++) {
        v[j].set_nxyz(0, 0, 1);
    }

    // right
    i += 4;
    v[i    ].set_xyz(r,  r, r);
    v[i + 1].set_xyz(r, -r, r);
    v[i + 2].set_xyz(r, -r, -r);
    v[i + 3].set_xyz(r,  r, -r);
    for (j = i; j < i + 4; j++) {
        v[j].set_nxyz(1, 0, 0);
    }
    
    // up
    i += 4;
    v[i    ].set_xyz( r,  r,  r);
    v[i + 1].set_xyz( r,  r, -r);
    v[i + 2].set_xyz(-r,  r, -r);
    v[i + 3].set_xyz(-r,  r,  r);
    for (j = i; j < i + 4; j++) {
        v[j].set_nxyz(0, 1, 0);
    }
   
    // left
    i += 4;
    v[i    ].set_xyz(-r,  r,  r);
    v[i + 1].set_xyz(-r,  r, -r);
    v[i + 2].set_xyz(-r, -r, -r);
    v[i + 3].set_xyz(-r, -r,  r);
    for (j = i; j < i + 4; j++) {
        v[j].set_nxyz(-1, 0, 0);
    }
    
    // down 
    i += 4;
    v[i    ].set_xyz(-r, -r, -r);
    v[i + 1].set_xyz( r, -r, -r);
    v[i + 2].set_xyz( r, -r,  r);
    v[i + 3].set_xyz(-r, -r,  r);
    for (j = i; j < i + 4; j++) {
        v[j].set_nxyz(0, -1, 0);
    }
    
    // back 
    i += 4;
    v[i    ].set_xyz( r, -r, -r);
    v[i + 1].set_xyz(-r, -r, -r);
    v[i + 2].set_xyz(-r,  r, -r);
    v[i + 3].set_xyz( r,  r, -r);
    for (j = i; j < i + 4; j++) {
        v[j].set_nxyz(0, 0, -1);
    }
    
    var idx = [
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9, 10,  8, 10, 11,    // up
        12, 13, 14,  12, 14, 15,    // left
        16, 17, 18,  16, 18, 19,    // down
        20, 21, 22,  20, 22, 23     // back
    ]; 
    
    mesh.set_vertex_data(v);
    mesh.set_index_data(idx);
} 

function unit_circle(mesh) {
    var v = [],
        idx = [],
        z = 0,
        n_triangles = 36;
     
    v.push(new Vertex());
    v[0].set_xyz(0, 0, z);
    for (var i = 1; i <= n_triangles; i++) {
        var x = Math.cos(deg2rad((i - 1) * 10));
        var y = Math.sin(deg2rad((i - 1) * 10));
        v.push(new Vertex());
        v[i].set_xyz(x, y, z);
        v[i].set_nxyz(0, 0, -1);
        v[i].set_uv(0, 0);

        idx.push(0);
        idx.push(i);
        idx.push((i % n_triangles) + 1);
    }

    mesh.set_vertex_data(v);
    mesh.set_index_data(idx);
}
