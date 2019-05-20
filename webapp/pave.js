
import { Material } from "./material.js"

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {number} width 
 * @param {number} height 
 * @param {number} thickness 
 * @param {Material} material
 */
export function Pave(gl, width, height, thickness, material){
    this.width = width;
    this.height = height;
    this.thickness = thickness;
    this.material = material;

    const vertexDataPosition = [
        //ABCD
        -width/2,  height/2, thickness/2, /*A*/ 0.0, 0.0, 1.0,
         width/2,  height/2, thickness/2, /*B*/ 0.0, 0.0, 1.0,
         width/2, -height/2, thickness/2, /*C*/ 0.0, 0.0, 1.0,
        -width/2, -height/2, thickness/2, /*D*/ 0.0, 0.0, 1.0,

        //EADH
        -width/2,  height/2, -thickness/2, /*E*/ -1.0, 0.0, 0.0,
        -width/2,  height/2,  thickness/2, /*A*/ -1.0, 0.0, 0.0,
        -width/2, -height/2,  thickness/2, /*D*/ -1.0, 0.0, 0.0,
        -width/2, -height/2, -thickness/2, /*H*/ -1.0, 0.0, 0.0,
        
        //EFGH
        -width/2,  height/2, -thickness/2, /*E*/ 0.0, 0.0, -1.0,
         width/2,  height/2, -thickness/2, /*F*/ 0.0, 0.0, -1.0,
         width/2, -height/2, -thickness/2, /*G*/ 0.0, 0.0, -1.0,
        -width/2, -height/2, -thickness/2, /*H*/ 0.0, 0.0, -1.0,

        //FBCG
        width/2,  height/2, -thickness/2, /*F*/  1.0, 0.0, 0.0,
        width/2,  height/2,  thickness/2, /*B*/  1.0, 0.0, 0.0,
        width/2, -height/2,  thickness/2, /*C*/  1.0, 0.0, 0.0,
        width/2, -height/2, -thickness/2, /*G*/  1.0, 0.0, 0.0,

        //EFBA
        -width/2,  height/2, -thickness/2, /*E*/ 0.0, 1.0, 0.0,
         width/2,  height/2, -thickness/2, /*F*/ 0.0, 1.0, 0.0,
         width/2,  height/2,  thickness/2, /*B*/ 0.0, 1.0, 0.0,
        -width/2,  height/2,  thickness/2, /*A*/ 0.0, 1.0, 0.0,

        //HGCD
        -width/2, -height/2, -thickness/2, /*H*/ 0.0, -1.0, 0.0,
         width/2, -height/2, -thickness/2, /*G*/ 0.0, -1.0, 0.0,
         width/2, -height/2,  thickness/2, /*C*/ 0.0, -1.0, 0.0,
        -width/2, -height/2,  thickness/2, /*D*/ 0.0, -1.0, 0.0,
    ];

    const vertexDataPositionIndexOrder = [
        0, 1, 2,
        0, 2, 3,

        4, 5, 6,
        4, 6, 7,

        8, 9, 10,
        8, 10, 11,

        12, 13, 14,
        12, 14, 15,

        16, 17, 18,
        16, 18, 19,

        20, 21, 22,
        20, 22, 23
    ];

    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 
        new Float32Array(vertexDataPosition),
         gl.STATIC_DRAW);
    
    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, 
        new Uint16Array(vertexDataPositionIndexOrder), 
        gl.STATIC_DRAW);


    /**
     * Draw the pave
     * 
     * @param {WebGLRenderingContext} gl
     * @param {glMatrix.mat4} model
     * @param {WebGLProgram} program
     */
    this.draw = function(gl, model, program){

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        
        const positionAttribName = gl.getAttribLocation(program, 'a_position');
        const normalAttribName = gl.getAttribLocation(program, 'a_normal');

        gl.vertexAttribPointer(positionAttribName,
            3, gl.FLOAT, false, 6*4, 0);
        gl.enableVertexAttribArray(positionAttribName);

        gl.vertexAttribPointer(normalAttribName,
            3,gl.FLOAT, false, 6*4, 3*4);
        gl.enableVertexAttribArray(normalAttribName);

        gl.uniformMatrix4fv(gl.getUniformLocation(program,'u_matrix_model'), false, model);
        
        //Envoyer le type de materiaux au fragment shader
        gl.uniform3fv(gl.getUniformLocation(program, "u_material.ambient"), this.material.ambient);
        gl.uniform3fv(gl.getUniformLocation(program, "u_material.diffuse"), this.material.diffuse);
        gl.uniform3fv(gl.getUniformLocation(program, "u_material.specular"), this.material.specular);
        gl.uniform1f(gl.getUniformLocation(program, "u_material.shine"), this.material.shine);

        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }
}