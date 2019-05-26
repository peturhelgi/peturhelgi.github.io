var canvas;
var gl;

var NumVertices = 36;

var colors1 = [];
var points1 = [];

var scoreBuffer;
var scoreTable = [];
var scoreColor = [];

var program;
var texture;

var tmp = 0;
var score = 1324;
var newScore = 50;

function initScore() {
    scoreBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, scoreBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points1), gl.STATIC_DRAW);

    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);


    scoreColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, scoreColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors1), gl.STATIC_DRAW);

    vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
}

function colorScore() {
    squad(1, 0, 3, 2);
    squad(2, 3, 7, 6);
    squad(3, 0, 4, 7);
    squad(6, 5, 1, 2);
    squad(4, 5, 6, 7);
    squad(5, 4, 0, 1);
}

function squad(a, b, c, d) {
    var vertices = [
        vec3(-0.5, -0.5, 0.5),
        vec3(-0.5, 0.5, 0.5),
        vec3(0.5, 0.5, 0.5),
        vec3(0.5, -0.5, 0.5),
        vec3(-0.5, -0.5, -0.5),
        vec3(-0.5, 0.5, -0.5),
        vec3(0.5, 0.5, -0.5),
        vec3(0.5, -0.5, -0.5)
    ];

    var vertexColors = [
        [255 / 255, 0.0 / 255, 0.0 / 255, 1.0 / 255],  // black
        [255 / 255, 218 / 255, 0 / 255, 1.0],  // red
        [255 / 255, 165 / 255, 0 / 255, 1.0],  // yellow
        [255 / 255, 109 / 255, 63 / 255, 1.0],  // green
        [255 / 255, 109 / 255, 63 / 255, 1.0],  // blue
        [255 / 255, 187 / 255, 0 / 255, 1.0],  // magenta
        [255 / 255, 187 / 255, 0 / 255, 1.0],  // cyan
        [1.0 / 255, 1.0 / 255, 1.0 / 255, 1.0]   // white
    ];

    //vertex texture coordinates assigned by the index of the vertex
    var indices = [a, b, c, a, c, d];
    for (var i = 0; i < indices.length; ++i) {
        points1.push(vertices[indices[i]]);
        colors1.push(vertexColors[a]);
    }
}
function scale4(x, y, z) {
    if (Array.isArray(x) && x.length == 3) {
        z = x[2];
        y = x[1];
        x = x[0];
    }

    var result = mat4();
    result[0][0] = x;
    result[1][1] = y;
    result[2][2] = z;

    return result;
}
function makeZero(dx, dy, dz, ctm) {

    // vinstri hlid 0
    var ctm1 = mult(ctm, translate(-2.5 / 10 + dx, 0.0 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(0.1, 4 / 10, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // haegri hlid 0
    ctm1 = mult(ctm, translate(2.5 / 10 + dx, 0.0 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(0.1, 4 / 10, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // efri hlid 0
    ctm1 = mult(ctm, translate(0.0 + dx, 2.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(4 / 10, 0.1, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // nedri hlid 0
    ctm1 = mult(ctm, translate(0.0 + dx, -2.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(4 / 10, 0.1, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

}
function makeOne(dx, dy, dz, ctm) {

    // midbiti
    var ctm1 = mult(ctm, translate(0.5 / 10 + dx, 0.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(0.1, 5 / 10, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // litli biti
    ctm1 = mult(ctm, translate(-1.0 / 10 + dx, 1.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(2 / 10, 0.1, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // nedsti biti
    ctm1 = mult(ctm, translate(0.0 + dx, -2.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(6 / 10, 0.1, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

}
function makeTwo(dx, dy, dz, ctm) {

    // vinstri hlid 2
    var ctm1 = mult(ctm, translate(-2.5 / 10 + dx, -1.0 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(0.1, 2 / 10, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // haegri hlid 2
    ctm1 = mult(ctm, translate(2.5 / 10 + dx, 1.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(0.1, 1 / 10, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // efsti biti 2
    ctm1 = mult(ctm, translate(-0.5 / 10 + dx, 2.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(5 / 10, 0.1, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // mid biti 2
    ctm1 = mult(ctm, translate(0.0 + dx, 0.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(4 / 10, 0.1, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // nefsti biti 2
    ctm1 = mult(ctm, translate(0.5 / 10 + dx, -2.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(5 / 10, 0.1, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

}
function makeThree(dx, dy, dz, ctm) {
    // haegri efri hlid 3
    var ctm1 = mult(ctm, translate(2.5 / 10 + dx, 1.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(0.1, 1 / 10, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // haegri nedri hlid 3
    ctm1 = mult(ctm, translate(2.5 / 10 + dx, -1.0 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(0.1, 2 / 10, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // efsti biti 3
    ctm1 = mult(ctm, translate(-0.5 / 10 + dx, 2.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(5 / 10, 0.1, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // mid biti 3
    ctm1 = mult(ctm, translate(0.0 + dx, 0.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(4 / 10, 0.1, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // nefsti biti 3
    ctm1 = mult(ctm, translate(-0.5 / 10 + dx, -2.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(5 / 10, 0.1, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

}
function makeFour(dx, dy, dz, ctm) {
    // vinstri hlid 4
    var ctm1 = mult(ctm, translate(-2.5 / 10 + dx, 1.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(0.1, 3 / 10, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // haegri hlid 4
    ctm1 = mult(ctm, translate(2.5 / 10 + dx, 0.0 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(0.1, 6 / 10, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    //midstrik hlid 4
    ctm1 = mult(ctm, translate(0.0 + dx, -0.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(4 / 10, 0.1, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}
function makeFive(dx, dy, dz, ctm) {

    // vinstri  hlid 5
    var ctm1 = mult(ctm, translate(-2.5 / 10 + dx, 1.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(0.1, 1 / 10, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // haegri hlid 5
    ctm1 = mult(ctm, translate(2.5 / 10 + dx, -1.0 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(0.1, 2 / 10, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // efsti biti 5
    ctm1 = mult(ctm, translate(0.5 / 10 + dx, 2.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(5 / 10, 0.1, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // mid biti 5
    ctm1 = mult(ctm, translate(0.0 + dx, 0.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(4 / 10, 0.1, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // nefsti biti 5
    ctm1 = mult(ctm, translate(-0.5 / 10 + dx, -2.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(5 / 10, 0.1, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

}
function makeSix(dx, dy, dz, ctm) {

    // vinstri  hlid 6
    var ctm1 = mult(ctm, translate(-2.5 / 10 + dx, 0.0 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(0.1, 4 / 10, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // haegri hlid 6
    ctm1 = mult(ctm, translate(2.5 / 10 + dx, -1.0 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(0.1, 2 / 10, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // efsti biti 6
    ctm1 = mult(ctm, translate(0.5 / 10 + dx, 2.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(5 / 10, 0.1, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // mid biti 6
    ctm1 = mult(ctm, translate(0.0 + dx, 0.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(4 / 10, 0.1, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // nefsti biti 6
    ctm1 = mult(ctm, translate(0.0 + dx, -2.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(4 / 10, 0.1, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

}
function makeSeven(dx, dy, dz, ctm) {

    // haegri hlid 7
    var ctm1 = mult(ctm, translate(1.5 / 10 + dx, -0.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(0.1, 5 / 10, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    //midstrik hlid 7
    ctm1 = mult(ctm, translate(1.5 / 10 + dx, -0.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(3 / 10, 0.1, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    //efri hlid 7
    ctm1 = mult(ctm, translate(-1.0 / 10 + dx, 2.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(4 / 10, 0.1, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}
function makeEight(dx, dy, dz, ctm) {

    // haegri efri hlid 8
    var ctm1 = mult(ctm, translate(2.5 / 10 + dx, 1.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(0.1, 1 / 10, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // haegri nedri hlid 8
    ctm1 = mult(ctm, translate(2.5 / 10 + dx, -1.0 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(0.1, 2 / 10, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // vinstri efri hlid 8
    ctm1 = mult(ctm, translate(-2.5 / 10 + dx, 1.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(0.1, 1 / 10, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // vinstri nedri hlid 8
    ctm1 = mult(ctm, translate(-2.5 / 10 + dx, -1.0 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(0.1, 2 / 10, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // efsti biti 8
    ctm1 = mult(ctm, translate(0.0 + dx, 2.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(4 / 10, 0.1, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // mid biti 8
    ctm1 = mult(ctm, translate(0.0 + dx, 0.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(4 / 10, 0.1, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // nefsti biti 8
    ctm1 = mult(ctm, translate(0.0 + dx, -2.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(4 / 10, 0.1, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

}
function makeNine(dx, dy, dz, ctm) {

    // vinstri hlid 9
    var ctm1 = mult(ctm, translate(-2.5 / 10 + dx, 1 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(0.1, 2 / 10, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // haegri hlid 9
    ctm1 = mult(ctm, translate(2.5 / 10 + dx, -0.5 / 10.0 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(0.1, 5 / 10, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    //midstrik hlid 9
    ctm1 = mult(ctm, translate(0.0 + dx, -0.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(4 / 10, 0.1, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    //efsta hlid 9
    ctm1 = mult(ctm, translate(0.0 + dx, 2.5 / 10 + dy, 0.0 + dz));
    ctm1 = mult(ctm1, scale4(4 / 10, 0.1, 0.1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}
function calculateScore(score, ctm) //tekur inn stig og skilar theim 4 integers sem talan uppistendur af
{
    scoreFun = score;
    var nums = []
    for (var i = 3; i >= 0; --i) {
        var size = Math.pow(10, i);
        var num = (scoreFun - scoreFun % size) / size;
        scoreFun = scoreFun % size;
        nums.push(num);
    }
    makeScore(nums, ctm);
}

function makeScore(score, ctm) //tekur inn stigatolurnar og birtir thaer a skjanum
{
    var functions = [
        makeZero,
        makeOne,
        makeTwo,
        makeThree,
        makeFour,
        makeFive,
        makeSix,
        makeSeven,
        makeEight,
        makeNine
    ];
    for (row = 0; row < score.length; row++) {
        var makeNum = functions[score[row]];
        makeNum(row * 0.7, 0, 0, ctm);
    }
}

