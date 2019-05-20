import { Pave } from "./pave.js";

export function Stairs(gl, width, lenght, height, stair_lenght, model, material){
    this.array = [];
    const nb_pave = lenght / stair_lenght;

    for(let i = 0; i < nb_pave; i++){
        const pave_height = (nb_pave-i)/nb_pave * height;
        
        const pave_model = glMatrix.mat4.create();
        glMatrix.mat4.translate(pave_model, pave_model, 
            [0.0, -(height/2-pave_height/2), i*stair_lenght]);
        glMatrix.mat4.multiply(pave_model, pave_model, model);

        this.array.push({
           pave: new Pave(gl, width, pave_height, stair_lenght, material),
           model: pave_model 
        });
    }

    this.draw = function(gl, program){
        for(let i = 0; i < this.array.length; i++){
            this.array[i].pave.draw(gl, this.array[i].model, program);
        }
    }

}