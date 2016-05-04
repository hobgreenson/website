/***************** Texture loading ****************/
function Texture() {
    this.texture_buffer = {};
}

Texture.prototype = {
    
    image_handler: function(texture) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture.tex_id);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); 
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    },

    add_texture: function(name, src) {
        var texture = {
            tex_id: gl.createTexture(),
            image: new Image() 
        };
        var h = this.image_handler;
        texture.image.onload = function() {
            h(texture);
        };
        texture.image.src = src;
        this.texture_buffer[name] = texture;
    }
}
