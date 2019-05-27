var cBuffer;
var grid = [];
var gridBuffer;
var gridColors = [];
var gl;
var canvas;
var padding = 0.01;

var x_width = 1.0
var z_width = 1.0
var height = 20 / 6;
var min_x = -0.5
var min_z = -0.5
var min_y = 0;
var max_x = min_x + x_width;
var max_z = min_z + z_width;
var max_y = min_y + height;
//notkun: drawGrid()
//fyrir: ekkert
//eftir: búið er að setja alla fýsilega hnúta í grid og liti gridColors;
function drawGrid() {
    //lóðréttar súlur
    for (var y = 0; y < YDim; ++y) {
        var ratio = (YDim - y) / YDim;

        var orange = [1, 1 - (1 - ratio) * 154 / 255, ratio, 1];
        var red = [1, ratio, ratio, 1];
        var blue = [ratio, ratio, 1, 1];
        var green = [ratio, 1, ratio, 1];

        var y1 = y / 6 + padding;
        var y2 = (y + 1) / 6 - padding;

        for (var x = 0; x < XDim; ++x) {
            var x1 = x / 6 - 0.5 + padding
            var x2 = (x + 1) / 6 - padding - 0.5;
            var a = vec3(x1, y1, min_z);
            var b = vec3(x1, y2, min_z);
            var c = vec3(x2, y1, min_z);
            var d = vec3(x2, y2, min_z);
            tile(a, c, b, d, green);
            a = vec3(x1, y1, max_z);
            b = vec3(x1, y2, max_z);
            c = vec3(x2, y1, max_z);
            d = vec3(x2, y2, max_z);
            tile(a, b, c, d, blue);
        }
        for (var z = 0; z < ZDim; ++z) {
            var z1 = z / 6 - 0.5 + padding
            var z2 = (z + 1) / 6 - padding - 0.5;
            var a = vec3(min_x, y1, z1);
            var b = vec3(min_x, y2, z1);
            var c = vec3(min_x, y1, z2);
            var d = vec3(min_x, y2, z2);
            tile(a, b, c, d, red);
            a = vec3(max_x, y1, z1);
            b = vec3(max_x, y2, z1);
            c = vec3(max_x, y1, z2);
            d = vec3(max_x, y2, z2);
            tile(a, c, b, d, orange);
        }
    }


    for (var x = 0; x < 6; ++x) {
        for (var z = 0; z < 6; ++z) {
            var x1 = x / 6 - 0.5 + padding;
            var x2 = (x + 1) / 6 - 0.5 - padding;
            var z1 = z / 6 - 0.5 + padding;
            var z2 = (z + 1) / 6 - 0.5 - padding;
            var a = vec3(x1, min_y, z1);
            var b = vec3(x1, min_y, z2);
            var c = vec3(x2, min_y, z1);
            var d = vec3(x2, min_y, z2);
            tile(a, b, c, d, [1, 1, 1, 1]);
        }
    }


    // var a = vec3(-0.5, 21 / 6, -0.5);
    // var b = vec3(-0.5, 21 / 6, 0.5);
    // var c = vec3(0.5, 21 / 6, -0.5);
    // var d = vec3(0.5, 21 / 6, 0.5);

    // tile(a, b, c, d, [0, 1, 1, 1]);



    grid.push(vec3(0, -10, 0));
    grid.push(vec3(0, 10, 0));
    grid.push(vec3(-10, 0, 0));
    grid.push(vec3(10, 0, 0));
    grid.push(vec3(0, 0, -10));
    grid.push(vec3(0, 0, 10));

    gridColors.push([1, 0, 0, 1]);
    gridColors.push([1, 0, 0, 1]);

    gridColors.push([0, 1, 0, 1]);
    gridColors.push([0, 1, 0, 1]);

    gridColors.push([0, 0, 1, 1]);
    gridColors.push([0, 0, 1, 1]);


}

function tile(a, b, c, d, color) {

    grid.push(d); grid.push(a); grid.push(b);
    grid.push(d); grid.push(c); grid.push(a);

    for (var i = 0; i < 6; ++i) gridColors.push(color);
}

//notkun: renderGrid()
//fyrir: ekkert
//eftir: búið er að búa til buffer fyrir grid og hlaða í gpu
function renderGrid() {
    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(gridColors), gl.STATIC_DRAW);

    vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    gridBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gridBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(grid), gl.STATIC_DRAW);

    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

}