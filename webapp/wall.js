
import { Pave} from "./pave.js"

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {number} width 
 * @param {number} height 
 * @param {number} thick 
 * @param {glMatrix.mat4} model 
 * @param {Material} material
 */
export function Wall(gl, width, height, thick, model,
    material){
    
        this.pave = new Pave(gl, width, height, thick, material);
    this.model = model;
    
    this.draw = function(gl, program){
        this.pave.draw(gl, this.model, program);
    }
}