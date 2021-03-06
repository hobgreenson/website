
function simple_vert() {
    var src =
    'attribute vec3 a_Position;\n' +
    'attribute vec3 a_Normal;\n' +
    'attribute vec2 a_Texture;\n' +
    'uniform mat4 u_PM;\n' +
    'varying vec4 v_Color;\n' +
    'varying vec2 v_Texture;\n' +
    'void main() {\n' +
    '   gl_Position =  u_PM * vec4(a_Position, 1.0);\n' +
    '   v_Color = vec4(abs(a_Normal), 1);\n' +
    '   v_Texture = a_Texture;\n' +
    '}\n'
    return src;
}

function simple_frag() {
    var src =
    'precision mediump float;\n' +
    'uniform sampler2D u_Sampler;\n' + 
    'varying vec4 v_Color;\n' +
    'varying vec2 v_Texture;\n' +
    'void main() {\n' +
    '   gl_FragColor = v_Color;\n' +
    '}\n';
    return src;
}

function background_vert() {
    var src =
    'attribute vec3 a_Position;\n' +
    'attribute vec2 a_Texture;\n' +
    'varying vec2 v_Texture;\n' +
    'void main() {\n' +
    '   gl_Position =  vec4(a_Position, 1.0);\n' +
    '   v_Texture = a_Texture;\n' +
    '}\n'
    return src;
}

function background_frag() {
    var src =
    'precision mediump float;\n' +
    'uniform sampler2D u_Sampler;\n' + 
    'varying vec2 v_Texture;\n' +
    'void main() {\n' +
    '   gl_FragColor = texture2D(u_Sampler, v_Texture);\n' +
    '}\n';
    return src;
}

/* shader with lighting */
function light_vert() {
    var src =
    'attribute vec3 a_Position;\n' +
    'attribute vec3 a_Normal;\n' +
    'uniform vec3 u_DiffuseLight;\n' +   // Diffuse light color
    'uniform vec3 u_LightDirection;\n' + // Diffuse light direction (in the world coordinate, normalized)
    'uniform vec3 u_AmbientLight;\n' +   // Color of an ambient light
    'uniform mat4 u_M;\n' +
    'uniform mat4 u_lookAt;\n' +
    'uniform mat4 u_P;\n' +
    'uniform vec4 u_Color;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '   gl_Position =  u_P * u_lookAt * u_M * vec4(a_Position, 1.0);\n' +
    '   vec3 normal = mat3(u_M) * a_Normal;\n' +
    '   float nDotL = max(dot(u_LightDirection, normal), 0.0);\n' +
    '   vec3 diffuse = u_DiffuseLight * u_Color.rgb * nDotL;\n' +
    '   vec3 ambient = u_AmbientLight * u_Color.rgb;\n' +
    '   v_Color = vec4(diffuse + ambient, u_Color.a);\n' +
    '}\n'
    return src;
}

/* procedural texture */
function procedural_frag() {
    var src =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'varying vec2 v_Texture;\n' +
    'void main() {\n' +
    '   gl_FragColor = texture2D(u_Sampler, v_tex_coord);\n' +
    '}\n';
    return src;
}
