//     _____   __  .__  .__    ____    __________        __                   
//    /  _  \_/  |_|  | |__|  /  _ \   \______   \ _____/  |_ __ _________    
//   /  /_\  \   __\  | |  |  >  _ </\  |     ___// __ \   __\  |  \_  __ \   
//  /    |    \  | |  |_|  | /  <_\ \/  |    |   \  ___/|  | |  |  /|  | \/   
//  \____|__  /__| |____/__| \_____\ \  |____|    \___  >__| |____/ |__|      
//          \/                      \/                \/                      
//  __________      .__       .__         .__         .__ __                 
//  \__   ___/______|__| _____|__| ______ |  |   ____ |__|  | ____ _________ 
//    |   |  \_  __ \  |/  ___/  |/  ___/ |  | _/ __ \|  |  |/ /  |  \_  __ \
//    |   |   |  | \/  |\___ \|  |\___ \  |  |_\  ___/|  |    <|  |  /|  | \/
//    |___|   |__|  |__/____  >__/____  > |____/\___  >__|__|_ \____/ |__|   
//
var canvas;
var gl;
var NumVertices = 36;
var tmpScore = 0;
var score = 0;
var program;

var interval = 1000;
var check = 1000;
var score = 0;

var rotateTrue = true;

var zDist = 9.5;
var xDist = 0.0;

var spawn = false;
var proLoc;
var mvLoc;

var MV = mat4();

var points = [];
var vPosition;

var vColor;
var cBuffer;
var colors = [];

var spacePressed = false;

var isPlaying = true;


var cubeBuffer;
var gridBuffer;
var grid = [];
var gridColors = [];

var stackBuffer;
var stack = [];
var stackColors = [];
var stackColorBuffer;
var stacker = [];

var scoreBuffer;
var scoreTable = [];
var scoreColor = [];

var time;

var stackExists = false;
var count = [];
for (var row = 0; row < 22; row++)
    count[row] = 0;

//notkun: createCube(a,y,z,cubeColor)
//fyrir: x,y,z, cubeColor eru tölur
//eftir: búið er að búa til nýjan kubb og setja í cubes. hann hefur hnitin x,y,z og litinn cubeColor
//       búið er að gera nýjan buffer fyrir kubbinn.
function createCube(x, y, z, cubeColor, cubeNo) {
    var newBuffer = gl.createBuffer();
    var newColorBuffer = gl.createBuffer();
    colorCube(x, y, z, cubeColor, quad);
    var cube = {
        coords: [x, z, y],
        myColor: cubeColor,//litur kubbsins
        bufferV: newBuffer,
        bufferC: newColorBuffer,
        vertices: points,
        color: colors//litafylki kubbsins
    };
    cubes.push(cube);
}
//notkun: createBlock();
//fyrir: ekkert
//eftir: búið er að gera nýjan blokk með þremur kubbum sem geymdir eru i cubes
function createBlock() {
    clearTimeout(time);
    if (isPlaying) {
        spawn = true;
        rotation[X_AXIS] = 0;
        rotation[Z_AXIS] = 0;
        rotation[Y_AXIS] = 0;

        if (cubes.length != 0) {
            cubes.splice(0, 3);
            points.splice(0, points.length);
            colors.splice(0, colors.length);
        }
        var cubeColor = Math.floor(Math.random() * 2 + 1);

        var x_row = 3;
        var z_row = 3;

        if (cubeColor == 1) {
            createCube(x_row, YDim + 1, z_row, cubeColor, 0); //blár L kassi
            createCube(x_row, YDim, z_row, cubeColor, 0); //blár L kassi
            createCube(x_row + 1, YDim, z_row, cubeColor, 0); //blár L kassi
        }
        else {
            createCube(x_row, YDim + 2, z_row, cubeColor, 0);//appelsínugulur beinn kassi
            createCube(x_row, YDim + 1, z_row, cubeColor, 1);//appelsínugulur beinn kassi
            createCube(x_row, YDim, z_row, cubeColor, 2);//appelsínugulur beinn kassi
        }
        spacePressed = false;
        time = setTimeout(gravity, interval);
    }
}
//notkun: renderBlock()
//fyrir: cubes er ekki tómt.
//eftir: búið er að teikna alla kubbana í cubes á strigann.
function renderBlock(mv) {
    for (var i = 0; i < 3; i++) {
        var cube = cubes[i];
        gl.bindBuffer(gl.ARRAY_BUFFER, cube.bufferV);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(cube.vertices), gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, cube.bufferC);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(cube.color), gl.STATIC_DRAW);

        vColor = gl.getAttribLocation(program, "vColor");
        gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(cube.color);

        gl.bindBuffer(gl.ARRAY_BUFFER, cube.bufferV);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(cube.vertices), gl.STATIC_DRAW);

        vPosition = gl.getAttribLocation(program, "vPosition");
        gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
        gl.drawArrays(gl.TRIANGLES, 0, cube.vertices.length);
    }
}


function multiply(axis, rad) {

    var newX = [];
    var newY = [];
    var newZ = [];

    var sin = Math.sign(rad) * 1;
    var cos = 0;

    rotateTrue = true;
    for (var cubeNo = 0; cubeNo < 3; cubeNo += 2)//nóg að uppfæra hnit endakubba þar sem snúið er um miðkubbinn
    {
        var dx = cubes[cubeNo].coords[X_AXIS] - cubes[1].coords[X_AXIS];
        var dz = cubes[cubeNo].coords[Z_AXIS] - cubes[1].coords[Z_AXIS];
        var dy = cubes[cubeNo].coords[Y_AXIS] - cubes[1].coords[Y_AXIS];

        var x = cubes[cubeNo].coords[X_AXIS];
        var y = cubes[cubeNo].coords[Y_AXIS];
        var z = cubes[cubeNo].coords[Z_AXIS];

        if (axis == 0) {
            x = dx + cubes[1].coords[X_AXIS];
            y = dy * cos - dz * sin + cubes[1].coords[Y_AXIS];
            z = dy * sin + dz * cos + cubes[1].coords[Z_AXIS];
        }
        else if (axis == 1) {
            x = dx * cos + dz * sin + cubes[1].coords[X_AXIS];
            y = dy + cubes[1].coords[Y_AXIS];
            z = -dx * sin + dz * cos + cubes[1].coords[Z_AXIS];
        }
        else if (axis == 2) {
            x = dx * cos - dy * sin + cubes[1].coords[X_AXIS];
            y = dx * sin + dy * cos + cubes[1].coords[Y_AXIS];
            z = dz + cubes[1].coords[Z_AXIS];
        }


        if (collides(x, z, y)) {
            rotateTrue = false;
        }
        newX.push(x);
        newY.push(y);
        newZ.push(z);
    }

    if (rotateTrue) {
        for (var i = 0; i < 3; i += 2) {
            cubes[i].coords[X_AXIS] = newX[i / 2];
            cubes[i].coords[Z_AXIS] = newZ[i / 2];
            cubes[i].coords[Y_AXIS] = newY[i / 2];
        }
    }
    return rotateTrue;
}

//notkun: b=collision()
//fyrir: cubes hefur 3 kubba
//eftir: ef einhver kubbur hefur rekist í gólf, vegg eða annan kubb er b true, false annars
function collision(direction, axis) {
    var nextVal = [0, 0, 0];
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; ++j) {
            nextVal[j] = cubes[i].coords[j];
        }
        nextVal[axis] += direction;

        if (collides(nextVal[0], nextVal[1], nextVal[2]))
            return true;
    }
    return false;
}

function collides(x, z, y) {
    return y == 0 || collisionMap[x][z][y] == 1;
}
//notkun: gravity()
//fyrir: cubes hefur 3 kubba
//eftir: búið er að lækka y hnit allra kubbana um 1
function gravity() {
    if (!collision(-1, Y_AXIS)) {
        moveBlockCoord(Y_AXIS, -1);
        setTimeout(gravity, interval);
    }
    else recycle();

}
window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    // gl.clearColor(231 / 255, 225 / 255, 219 / 255, 1);
    gl.clearColor(10 / 255, 10 / 255, 20 / 255, 1);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    drawGrid(); //skilgreinir gridið utanum kubbana
    renderGrid();    //teiknar gridið
    createBlock(); //býr til fyrsta kubbinn
    colorScore();

    proLoc = gl.getUniformLocation(program, "projection");
    mvLoc = gl.getUniformLocation(program, "modelview");
    var proj = perspective(50.0, 1.0, 0.2, 100.0);
    gl.uniformMatrix4fv(proLoc, false, flatten(proj));

    //event listeners for mouse
    canvas.addEventListener("mousedown", onMouseDown);

    canvas.addEventListener("mouseup", onMouseUp);

    canvas.addEventListener("mousemove", onMouseMove);

    // Event listener for keyboard
    window.addEventListener("keydown", onKeyDown);
    // Event listener for mousewheel
    window.addEventListener("mousewheel", onMouseWheel);
    render();
}

function makeCollidable(cube) {
    collisionMap[cube.coords[0]][cube.coords[1]][cube.coords[2]] = 1;
}

function recycle() {
    stackExists = true;
    for (var i = 0; i < 3; i++) {
        createStackCube(
            cubes[i].coords[0],
            cubes[i].coords[2],
            cubes[i].coords[1],
            cubes[i].myColor); //bæti inn í stack og stackColors;
        makeCollidable(cubes[i]);//breytum collisionMap
        count[cubes[i].coords[Y_AXIS]]++;
        MV = mat4();

    }
    var levelCounter = 0;
    for (var i = count.length - 1; i > 0; i--)
        if (count[i] == numCubesPerLevel) {//athugar hvort hæð sé full
            removeLevel(i);
            levelCounter++;
        }

    score += scoreSystem[levelCounter];

    if (count[YDim] > 0) gameOver();
    if (isPlaying) createBlock();
}

function gameOver() {
    isPlaying = false;
    var n = stackColors.length;
    stackColors.splice(0, n);

    for (var i = 0; i < n / 6; i++) {
        for (var green = 0; green < 6; ++green) {
            for (var j = 0; j < 6; ++j) {
                stackColors.push(greens[green]);
            }
        }
    }
}

function createStackCube(x, y, z, cubeColor) {
    colorCube(x, y, z, cubeColor, quadStack);
    var cube = {
        x: x,
        y: y,
        z: z,
        color: cubeColor
    }
    stacker.push(cube);
}
//Notkun: removeLevel(level)
//Fyrir: level er heiltala. Hæð númer level er full
//eftir: búið er að fjarlægja alla kubbana á hæð level
function removeLevel(level) {
    for (var i = level; i < count.length - 1; i++)
        count[i] = count[i + 1];

    for (var i = 1; i < 7; i++)
        for (var j = 1; j < 7; j++) {
            collisionMap[i][j][level] = 0;
            var k = level;
            while (k < YDim) {
                collisionMap[i][j][k] = collisionMap[i][j][k++];
            }
            collisionMap[i][j][YDim] = 0;
        }

    for (i = stacker.length - 1; i >= 0; i--) {
        if (stacker[i].y == level) {
            stack.splice(numCubesPerLevel * i, numCubesPerLevel);
            stackColors.splice(numCubesPerLevel * i, numCubesPerLevel);
            stacker.splice(i, 1);
        }
    }
    var n = stacker.length;
    for (var i = n - 1; i >= 0; i--)
        if (stacker[i].y > level) {
            createStackCube(stacker[i].x, stacker[i].y - 1, stacker[i].z, stacker[i].color);
            stack.splice(numCubesPerLevel * i, numCubesPerLevel);
            stackColors.splice(numCubesPerLevel * i, numCubesPerLevel);
            stacker.splice(i, 1);
        }
}

function renderStack() {
    stackBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, stackBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(stack), gl.STATIC_DRAW);

    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    stackColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, stackColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(stackColors), gl.STATIC_DRAW);

    vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);


}
var currLevel = 0;
function levelUp() {

    var threshold = 500;
    while (score >= threshold && currLevel < intervals.length) {
        threshold += 500;
        interval = intervals[currLevel++];
    }

    if (interval != check) {
        check = interval;
    }
}

//notkun: colorCube(x,y,z,color)
//fyrir: x,y,z,color eru tölur
//eftir: búið er að gera kassa blabla
function colorCube(x, y, z, type, quadFun) {
    quadFun(1, 0, 3, 2, x, y, z, type, 0);
    quadFun(2, 3, 7, 6, x, y, z, type, 5);
    quadFun(3, 0, 4, 7, x, y, z, type, 3);
    quadFun(4, 5, 6, 7, x, y, z, type, 2);
    quadFun(5, 4, 0, 1, x, y, z, type, 1);
    quadFun(6, 5, 1, 2, x, y, z, type, 4);
}

var texCoord = [];
function calcCoord(x) {
    return -0.5 + (x - 1) / 6;
}

//notkun: quad(a,b,c,d,x,y,z,color),
//fyrir: a...color eru tölur
//eftir: búið er að gera kassa blabla, color er liturinn
function quad(a, b, c, d, x, y, z, type, shade) {

    // x = (x - 1); // / 6;
    // z = (z - 1);// / 6;
    var x_min = calcCoord(x);
    var z_min = calcCoord(z);
    var x_max = calcCoord(x + 1);
    var z_max = calcCoord(z + 1);
    var y_min = (y - 1) / 6;
    var y_max = y / 6;
    console.log(x, y, z, x_min, z_min);

    var vertices = [
        vec3(x_min, y_min, z_max),//0
        vec3(x_min, y_max, z_max),//1
        vec3(x_max, y_max, z_max),//2
        vec3(x_max, y_min, z_max),//3
        vec3(x_min, y_min, z_min),//4
        vec3(x_min, y_max, z_min),//5
        vec3(x_max, y_max, z_min),//6
        vec3(x_max, y_min, z_min)//7
    ];

    var vertexColors = type == 1 ? blues : reds;
    var indices = [a, b, c, a, c, d];
    for (var i = 0; i < indices.length; ++i) {
        points.push(vertices[indices[i]]);
        colors.push(vertexColors[shade]);
    }
}
//notkun: quad(a,b,c,d,x,y,z,color),
//fyrir: a...color eru tölur
//eftir: búið er að gera kassa blabla, color er liturinn
function quadStack(a, b, c, d, x, y, z, type, shade) {
    var x_min = calcCoord(x);
    var x_max = calcCoord(x + 1);
    var z_min = calcCoord(z);
    var z_max = calcCoord(z + 1);
    var y_min = (y - 1) / 6;
    var y_max = y / 6;

    var vertices = [
        vec3(x_min, y_min, z_max), // 0
        vec3(x_min, y / 6, z_max), // 1
        vec3(x_max, y / 6, z_max), // 2
        vec3(x_max, y_min, z_max), // 3
        vec3(x_min, y_min, z_min), // 4
        vec3(x_min, y / 6, z_min), // 5
        vec3(x_max, y / 6, z_min), // 6
        vec3(x_max, y_min, z_min)  // 7
    ];

    var vertexColors = type == 1 ? blues : reds;

    var indices = [a, b, c, a, c, d];
    for (var i = 0; i < indices.length; ++i) {
        stack.push(vertices[indices[i]]);
        stackColors.push(vertexColors[shade]);
    }

}

var scoreRotation = 0;
var clk = 0;
var scoreIsRotating = false;

function handleRotateScore() {
    ++clk;
    if (clk % 200 == 0)
        scoreIsRotating = true;

    if (scoreIsRotating)
        scoreRotation += 5;

    if (scoreRotation == 360) {
        scoreIsRotating = false;
        scoreRotation = 0;
    }

    scoreRotation = scoreRotation % 360;
}

var render = function () {

    levelUp();
    handleRotateScore();

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var proj = perspective(30.0, 1.0, 0.002, 100.0);//fovy, aspect, near, far
    gl.uniformMatrix4fv(proLoc, false, flatten(proj));
    // staðsetja áhorfanda og meðhöndla músarhreyfingu
    var score_trs = lookAt(vec3(-1.81, 0, 20), vec3(-1.81, -4.5, 0.0), vec3(0.0, 1.0, 0.0));   //eye, at, up

    var x_translate = 1.84 / 1.75;

    score_trs = mult(score_trs, translate(x_translate, 0, 0));
    score_trs = mult(score_trs, rotate(scoreRotation, [0, 1, 0]));
    score_trs = mult(score_trs, translate(-x_translate, 0, 0));

    var mv = lookAt(vec3(0, 0, zDist), vec3(0, 0.6, zDist / 10), vec3(0.0, 1.0, 0.0)); //eye, at, up
    mv = mult(mv, rotate(parseFloat(spinX), [1, 0, 0]));
    mv = mult(mv, rotate(parseFloat(spinY), [0, 1, 0]));

    mv = mult(mv, translate(0, -1, 0));

    if (isPlaying && tmpScore < score) tmpScore++;
    else if (!isPlaying && tmpScore > 0) tmpScore--;

    initScore();
    calculateScore(tmpScore, score_trs);

    //teikna gridið
    renderGrid();
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays(gl.TRIANGLES, 0, grid.length - 6);
    gl.drawArrays(gl.LINES, grid.length - 6, 6);

    var stack_trs = mv;

    //teiknum stackinn
    renderStack();

    if (stack.length > 0) {
        gl.uniformMatrix4fv(mvLoc, false, flatten(stack_trs));
        gl.drawArrays(gl.TRIANGLES, 0, stack.length);
    }

    mv = moveBlock(0, mv);
    mv = moveBlock(1, mv);
    mv = moveBlock(2, mv);
    mv = mult(mv, MV);

    if (isPlaying)
        renderBlock(mv);

    gl.enable(gl.DEPTH_TEST);
    requestAnimFrame(render);
}