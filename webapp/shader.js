
/**
 * 
 * @param {WebGLRenderingContext} gl
 * @returns {WebGLProgram} 
 */
export function createProgramFromScript(gl){
    const vertexSrc = document.querySelector("#vertex").text;
    const fragmentSrc = document.querySelector("#fragment").text;
    return createProgram(gl, vertexSrc, fragmentSrc);
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {string} vertex_src 
 * @param {string} fragment_src 
 * @returns {WebGLProgram}
 */
function createProgram(gl, vertex_src, fragment_src){
    const program = gl.createProgram();
    const vertexShader = compileShader(gl, vertex_src, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragment_src, gl.FRAGMENT_SHADER);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        alert("Erreur lors de l'édition de lien du shader" + gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {string} shaderSrc 
 * @param {number} shaderType
 * @returns {WebGLShader} 
 */
function compileShader(gl, shaderSrc, shaderType){
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSrc);
    gl.compileShader(shader);
    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        alert("Erreur lors de la compilation du shader " + gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}