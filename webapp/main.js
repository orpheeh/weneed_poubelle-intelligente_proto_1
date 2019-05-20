import {createProgramFromScript} from "./shader.js";
import { Scene } from "./scene.js";
import { Dispo } from "./dispositif.js";

main();

function main(){
    const canvas = document.querySelector("#glCanvas");
    const gl = canvas.getContext("webgl");
    const program = createProgramFromScript(gl);

    ///----------------------------------------------------------
    //La matrice de vue qui permet de regarder dans une certaine 
    //direction
    let viewMatrix = glMatrix.mat4.create();
    let viewPosition = [0.0, 3.0, 30.0];
    let targetPosition = [0.0, 3.0, 0.0];
    glMatrix.mat4.lookAt(
        viewMatrix,
        viewPosition,
        targetPosition,
        [0.0, 1.0, 0.0]
    );

    //---------------------------------------------------
    //DISPO DATABASE - Charger tous les dispositifs depuis la base de données
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            const response = this.responseText;
            array = JSON.parse(response);
            console.log(array);
            const parser = new DOMParser();
            const container = document.querySelector("#list");
            const template = `
            <div><a href="#" class="btn2">abcd</a>
            <span hidden>5ccbf54699c13e1cfc4a71d4</span></div>`;

            for(let i = 0; i < array.length; i++){
                dispositif.push(new Dispo(gl,
                    { position: array[i].viewPosition, trash: array[i].contents, name: array[i].name}));
                const doc = parser.parseFromString(template, 'text/html');
                doc.firstChild.querySelector("a").firstChild.nodeValue = array[i].name;
                doc.firstChild.querySelector("span").nodeValue = array[i]._id;
                doc.firstChild.addEventListener('click',(e)=>{
                    for(let j = 0; j < array.length; j++){
                        container.children[j].classList.remove('active');
                    }
                    container.children[i].classList.add('active');
                    
                    document.querySelector("#dispo-info .name")
                    .innerHTML = array[i].name;
                    document.querySelector("#dispo-info .rubbish")
                    .firstChild.nodeValue = array[i].contents.toString();
                    document.querySelector("#dispo-info a")
                    .addEventListener('click', (e)=>{
                        const xhttp = new XMLHttpRequest();
                        xhttp.onreadystatechange = function(){
                            if(this.readyState == 4 && this.status == 200){
                                const response = this.responseText;
                                console.log(response);
                                container.children[i].remove();
                                if(i == array.length-1){
                                    array.pop();
                                    dispositif.pop();
                                }
                                else { 
                                    array = array.slice(0, i-1).concat(i+1, length);
                                    dispositif = dispositif.slice(0, i-1).concat(i+1, length);
                                }
                                repaint();
                            }
                        };
                        xhttp.open("DELETE", "http://127.0.0.1:3000/dispo/"+ 
                        array[i]._id, true);
                        xhttp.send();
                    });
                });
                container.appendChild(doc.firstChild);
            }
            
        }
    };
    xhttp.open("GET", "http://127.0.0.1:3000/dispo", true);
    xhttp.send();

    //---------------------------------------------------
    //La seine la seine la seine
    const scene = new Scene(gl);
    
    //---------------------------------------------------
    //Creer un nouveau dispositif  
    const new_dispo = document.querySelector("#nd");
    new_dispo.addEventListener('click', ()=>{
        const display = document.querySelector("#create_dis").style.display;
        document.querySelector("#create_dis").style.display =display == "none" ? "block" : "none";
    });

    let tmp;
    let array = [];
    const create_dispo = document.querySelector("#create_dis .btn");
    create_dispo.addEventListener('click', (e)=>{
        const name = document.querySelector("#name").value;
        const trash = [];
        const check_plastique = document.querySelector("#plastique");
        const check_alluminium = document.querySelector('#alluminium');
        const check_papier = document.querySelector('#papier');
        if(check_plastique.checked){
            trash.push("Plastique");
        }
        if(check_papier.checked){
            trash.push("Papier");
        }
        if(check_alluminium.checked){
            trash.push("Alluminium");
        }
        tmp = { "name" : name, "trash" : trash };
        document.querySelector("#deployment").style.display ="block";
    });

    const deploie_dispo = document.querySelector("#deployment");
    deploie_dispo.addEventListener('click', (e)=>{
        document.querySelector("#deployment").style.display ="none";
        document.querySelector("#create_dis").style.display ="none";
        tmp["position"] = viewPosition;
        console.log(viewPosition[0] + " " + viewPosition[2]);
        
        const xhttp = new XMLHttpRequest();
	console.log(viewPosition[0] + " , " + viewPosition[2]);
        const new_dispo = {
            name: tmp["name"],
            contents: tmp["trash"],
            viewPosition: viewPosition,
            position : {
                x: viewPosition[0] + 25,
                y: viewPosition[2] + 80
            },
            step: Math.floor((viewPosition[1]+30) / 30)
        }
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                const response = this.responseText;
                const o = JSON.parse(response);
                console.log("Le nouveau dispositifs ajouté : " + o);
                array.push(o);
                dispositif.push(new Dispo(gl, tmp));
                console.log(array);
                tmp = undefined;
            }
        };
        xhttp.open("POST", "http://127.0.0.1:3000/dispo", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(new_dispo));
    });

    //Afficher la liste des dispositifs
    const toggleButton = document.querySelector("#toggle");
    toggleButton.addEventListener('click', function(e){
        const display =document.querySelector("#list").style.display;
        document.querySelector("#list").style.display = display == "block" ? "none" : "block";
        document.querySelector("#dispo-info").style.display = display == "block" ? "none" : "block";
    
    });

    //Gestion des évènements clavier
    window.addEventListener('keydown', function(event){
        //avancer
        if(event.key == "ArrowUp"){
            move(0.5);
            repaint();
        }
        //reculer
        if(event.key == "ArrowDown"){
            move(-0.5);
            repaint();
        }
        //aller vers la gauche
        if(event.key == "ArrowLeft"){
            move2(0.5);
            repaint();
        }
        //aller vers la droite
        if(event.key == "ArrowRight"){
            move2(-0.5);
            repaint();
        }
        if(event.key == "i"){
            viewPosition[1] += 1.0;
            targetPosition[1] += 1.0;
            repaint();
        }
        if(event.key == "k"){
            viewPosition[1] -= 1.0;
            targetPosition[1] -= 1.0;
            repaint();
        }
        if(event.key == "e"){
            //TODO faire tourner la camera autour de l'axe X
            targetPosition[1] += 1.0;
            repaint();
        }
        if(event.key == "d"){
            //TODO faire tourner la camera autour de l'axe X
            targetPosition[1] -= 1.0;
            repaint();
        }
        if(event.key == "f"){
            turn(-5*Math.PI/180.0);
            repaint();
        }
        if(event.key == "s"){
            turn(5*Math.PI/180.0);
            repaint();
        }
    });

    function repaint(){
        viewMatrix = updateCamera(viewPosition, targetPosition);
        drawScene(gl, program, 
            viewMatrix,
            projectionMatrix,
            lightPos,
            viewPosition,
            scene,
            dispositif);
    }

    /**
     * radian
     * @param {number} r 
     */
    function turn(r){
        const vectViewDir = glMatrix.vec3.fromValues(
            targetPosition[0] - viewPosition[0],
            targetPosition[1] - viewPosition[1],
            targetPosition[2] - viewPosition[2]
        );
        const radius = glMatrix.vec3.len(vectViewDir);
        const determinant = det(1, 0, 
            vectViewDir[0], 
            vectViewDir[2]);
        const alpha = (determinant > 0 ? -1 : 1 ) * Math.acos(vectViewDir[0] / radius);
        const tx = radius * Math.cos(alpha + r);
        const tz = -radius * Math.sin(alpha + r);
        targetPosition[0] = tx + viewPosition[0];
        targetPosition[2] = tz + viewPosition[2];
    }

    function det(x1, y1, x2, y2){
        return x1*y2 - y1*x2;
    }

    /**
     * dir = -1 pour reculer et +1 pour avanvcer
     * @param {number} dir 
     */
    function move(dir){
        const vectViewDir = glMatrix.vec3.fromValues(
            targetPosition[0] - viewPosition[0],
            targetPosition[1] - viewPosition[1],
            targetPosition[2] - viewPosition[2]
        );
        moveUtil(dir, vectViewDir);
    }

    /**
     * 
     * @param {number} dir 
     * @param {glMatrix.vec3} vectViewDir 
     */
    function moveUtil(dir, vectViewDir){
        const radius = glMatrix.vec3.len(vectViewDir);
        viewPosition[0] += dir * vectViewDir[0] / radius;
        viewPosition[1] += dir * vectViewDir[1] / radius;
        viewPosition[2] += dir * vectViewDir[2] / radius;

        targetPosition[0] += dir * vectViewDir[0] / radius;
        targetPosition[1] += dir * vectViewDir[1] / radius;
        targetPosition[2] += dir * vectViewDir[2] / radius;
    }

    /**
     * dir > 0 aller à gauche dir < 0 aller à droite 
     * @param {number} dir
     */
    function move2(dir){
        const left = glMatrix.vec3.create();
        const dir2 = [viewPosition[0] - targetPosition[0],
        viewPosition[1] - targetPosition[1],
        viewPosition[2] - targetPosition[2]];
        glMatrix.vec3.cross(left,dir2, [0.0, 1.0, 0.0]);
        const up = glMatrix.vec3.create();
        glMatrix.vec3.cross(up, left, dir2);
        moveUtil(dir, left);
    }

    //--------------------------------------------
    //La matrice de projection en perspective
    const projectionMatrix = glMatrix.mat4.create();
    glMatrix.mat4.perspective(
        projectionMatrix,
        60*Math.PI/180,
        gl.canvas.clientWidth/gl.canvas.clientHeight,
         1, 2000);
    
    //--------------------------------------------
    //La position de la source de lumière lumière
    let lightPos = [0.0, 60.0, -30.0];
    
    //--------------------------------------------
    //Les dispositifs
    let dispositif = [];

    drawScene(gl, program, 
        viewMatrix,
        projectionMatrix,
        lightPos,
        viewPosition,
        scene,
        dispositif);
}

/**
 * 
 * @param {Array} viewPosition 
 * @param {Array} targetPosition
 * @returns {glMatrix.mat4}
 */
function updateCamera(viewPosition, targetPosition){
    const left = glMatrix.vec3.create();
    const dir = [viewPosition[0] - targetPosition[0],
    viewPosition[1] - targetPosition[1],
    viewPosition[2] - targetPosition[2]];
    glMatrix.vec3.cross(left,dir, [0.0, 1.0, 0.0]);
    const up = glMatrix.vec3.create();
    glMatrix.vec3.cross(up, left, dir);

    const cam = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(cam, viewPosition, targetPosition, up);
    return cam;
}
/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {WebGLBuffer} buffer 
 * @param {WebGLProgram} program 
 * @param {glMatrix.mat4} viewMatrix
 * @param {glMatrix.mat4} projectionMatrix
 * @param {Array} lightPos
 * @param {Array} viewPos
 * @param {Scene} scene
 */
function drawScene(gl, program, 
    viewMatrix, projectionMatrix, lightPos, viewPos, scene, dispositifs){
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.useProgram(program);
    const matrix = gl.getUniformLocation(program, "u_matrix_view");
    const matrix_proj = gl.getUniformLocation(program, "u_matrix_projection");
    const u_light_pos = gl.getUniformLocation(program, "u_light_pos");
    const u_view_pos = gl.getUniformLocation(program, "u_view_pos");
    
    gl.uniformMatrix4fv(matrix, false, viewMatrix);
    gl.uniformMatrix4fv(matrix_proj, false, projectionMatrix);
    gl.uniform3fv(u_light_pos, lightPos);
    gl.uniform3fv(u_view_pos, viewPos);

    //Draw the scene here !
    scene.draw(gl, program);

    for(let i = 0; i < dispositifs.length; i++){
        dispositifs[i].draw(gl, program);
    }
}
