import { Pave } from "./pave.js";
import { Material } from "./material.js";


export function Dispo(gl, dispo){
    const model = glMatrix.mat4.create();
    glMatrix.mat4.translate(model, model, dispo.position);

    const material_plastic = new Material([0.19225,0.19225,0.19225],
        [0.50754,0.50754,0.50754], 
        [0.508273,0.508273,0.508273], 0.4);
    
    const material_paper = new Material([0.19125,0.0735,0.0225],
            [0.7038,0.27048,0.0828], 
            [0.256777,0.137622,0.086014], 0.1);

    const material_all = new Material([0.1,0.18725,0.1745],
                [0.396,0.74151,0.69102], 
                [0.297254,0.30829,0.306678], 0.1);

    this.array = [];
    for(let i = 0; i < dispo.trash.length; i++){
        const m = glMatrix.mat4.create();
        glMatrix.mat4.translate(m, m, [0.5*i, 0.0, 0.0]);
        glMatrix.mat4.multiply(m, m, model);
        const material = (dispo.trash[i] == 'Plastique' ? 
        material_plastic : (dispo.trash[i] == 'Papier' ? material_paper : material_all));
        const p = new Pave(gl, 0.5, 1.5, 2, material);
        this.array.push({
            "model": m,
            "pave": p
        });
    }

    this.draw = function(gl, program){
        for(let i = 0; i < this.array.length; i++){
            this.array[i].pave.draw(gl, this.array[i].model, program);
        }
    }
}