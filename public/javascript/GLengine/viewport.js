
// h/t webglfundamentals
//

function resize(gl) {
    var real_to_CSS_pix = window.devicePixelRatio || 1;

    var display_width  = Math.floor(gl.canvas.clientWidth) * real_to_CSS_pix,
        display_height = Math.floor(gl.canvas.clientHeight) * real_to_CSS_pix;

    if (gl.canvas.width != display_width ||
        gl.canvas.height != display_height) {

        gl.canvas.width = display_width;
        gl.canvas.height = display_height;

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }
}

