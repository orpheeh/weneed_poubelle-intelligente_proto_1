import { Pave } from "./pave.js";

export function DoorWall(gl, wall_width, wall_heihgt, wall_thick,
    door_width, door_height, material, model){

    const width = (wall_width - door_width)/2;
    this.left_wall = new Pave(gl, width, wall_heihgt,
         wall_thick, material );

    this.right_wall = new Pave(gl, width, wall_heihgt,
        wall_thick, material );

    const height = wall_heihgt - door_height;
    this.top_wall = new Pave(gl, door_width, 
        height, wall_thick, material);
    
    this.top_model = glMatrix.mat4.create();
    glMatrix.mat4.translate(this.top_model, this.top_model, 
        [0.0, wall_heihgt/2 - height/2, 0.0]);
    glMatrix.mat4.multiply(this.top_model, this.top_model, model);

    this.left_model = glMatrix.mat4.create();
    glMatrix.mat4.translate(this.left_model, this.left_model, 
        [-wall_width/2 + width/2, 0.0, 0.0]);
    glMatrix.mat4.multiply(this.left_model, this.left_model, model);

    this.right_model = glMatrix.mat4.create();
    glMatrix.mat4.translate(this.right_model, this.right_model,
         [wall_width/2 - width/2, 0.0, 0.0]);
    glMatrix.mat4.multiply(this.right_model, this.right_model, model);

    this.draw = function(gl, program){
        this.left_wall.draw(gl, this.left_model, program);
        this.right_wall.draw(gl, this.right_model, program);
        this.top_wall.draw(gl, this.top_model, program);
    }

}