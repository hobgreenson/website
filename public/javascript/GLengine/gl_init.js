
function initWebGL(canvas) {
    gl = null;
    try {
        gl = canvas.getContext("webgl", { alpha: false }) || canvas.getContext("experimental-webgl");;
    }
    catch(e) {}
    if (!gl) {
        console.log("Unable to initialize WebGL. Check browser settings!");
        gl = null;
    }
    return gl;
}
