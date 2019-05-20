import { Pave } from "./pave.js";
import { Material } from "./material.js";
import { DoorWall } from "./door-wall.js";
import { Wall } from "./wall.js";
import { Stairs } from "./stairs.js";

export function Scene(gl){

    /*________________________________//
     *                                 
     *       g1                  g2                                 
     * 
     *******************
     *                 *      ________                   
     *                 *
     *        g3       *
     *   ________      *
     *                 *       zone2
     *                 *
     *                 *
     *      zone1      *
     *                 *      ________
     *                 *
     *                 *
     *   _________     *      
     *                 *
     * _________________________________*/

    const material = new Material([0.25,0.20725,0.20725],
         [1,0.829,0.829], 
         [0.296648,0.296648,0.296648], 0.088);

    
    const entry_model = glMatrix.mat4.create();
    const weneed_qg_entry = new DoorWall(gl, 50, 60, 2.5, 20, 20, material, entry_model);
    
    const left_wall_model = glMatrix.mat4.create();
    glMatrix.mat4.translate(left_wall_model, left_wall_model, [-23.5, 0.0, -40.0]);
    const weneed_qg_left_wall = new Wall(gl, 2.5, 60, 80, left_wall_model, material);

    const right_wall_model = glMatrix.mat4.create();
    glMatrix.mat4.translate(right_wall_model, right_wall_model, [+23.5, 0.0, -40.0]);
    const weneed_qg_right_wall = new Wall(gl, 2.5, 60, 80, right_wall_model, material);
    
    const back_wall_model = glMatrix.mat4.create();
    glMatrix.mat4.translate(back_wall_model, back_wall_model, [0.0, 0.0, -78.5]);
    const back_wall = new Wall(gl, 50, 60, 2.5, back_wall_model, material);

    const dg_office_model1 = glMatrix.mat4.create();
    glMatrix.mat4.translate(dg_office_model1, dg_office_model1, [-15.0, -14.0, -40.0]);
    const dg_office_wall = new Wall(gl, 18.0, 30.0, 2.5, dg_office_model1, material);

    const dg_office_model2 = glMatrix.mat4.create();
    glMatrix.mat4.translate(dg_office_model2, dg_office_model2, [-7.0, -14.0, -50.0-15.0]);
    const dg_office_wall2 = new Wall(gl, 2.5, 30.0, 25.0, dg_office_model2, material);

    const stair_model = glMatrix.mat4.create();
    glMatrix.mat4.translate(stair_model, stair_model, [-20.0, -14.0, -40.0]);
    const stair = new Stairs(gl, 9, 30, 30, 2.0, stair_model, material);

    const top_ground_model = glMatrix.mat4.create();
    glMatrix.mat4.translate(top_ground_model, top_ground_model, [0.0, 0.0, -59]);
    const top_ground = new Wall(gl, 48, 2.5, 40, top_ground_model, material);

    const ground_model = glMatrix.mat4.create();
    glMatrix.mat4.translate(ground_model, ground_model, [0.0, -30.0, -50.0]);
    const ground = new Wall(gl, 200, 2.5, 200, ground_model, material);

    /**
     * @param {WebGLRenderingContext} gl
     * @param {WebGLProgram} program
     */
    this.draw = function(gl, program){
        weneed_qg_entry.draw(gl, program);
        weneed_qg_left_wall.draw(gl, program);
        weneed_qg_right_wall.draw(gl, program);
        back_wall.draw(gl, program);
        dg_office_wall.draw(gl, program);
        dg_office_wall2.draw(gl, program);
        stair.draw(gl, program);
        top_ground.draw(gl, program);
        ground.draw(gl, program);
    }
}