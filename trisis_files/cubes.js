var cubes = []
const X_AXIS = 0;
const Z_AXIS = 1;
const Y_AXIS = 2;

var xRot = 0;
var yRot = 0;
var zRot = 0;

var rotation = [0, 0, 0]
var grad = 0;
const scoreSystem = [0, 125, 350, 700];
const intervals = [500, 400, 300, 200, 100];

const greens = [
    [5 / 255, 225 / 255, 119 / 255, 1],
    [48 / 255, 173 / 255, 35 / 255, 1],
    [17 / 255, 119 / 255, 45 / 255, 1],
    [34 / 255, 238 / 255, 91 / 255, 1],
    [0 / 255, 187 / 255, 39 / 255, 1],
    [156 / 255, 255 / 255, 136 / 255, 1]
]

const blues = [
    [33 / 255, 174 / 255, 254 / 255, 1],//framaná
    [26 / 255, 130 / 255, 191 / 255, 1],//vinstra megein
    [112 / 255, 154 / 255, 180 / 255, 1],//aftaná
    [14 / 255, 64 / 255, 97 / 255, 1],// undir
    [122 / 255, 206 / 255, 253 / 255, 1],//ofaná
    [65 / 255, 121 / 255, 154 / 255, 1]//hægri hlið
];

const yellows = [
    [226 / 255, 226 / 255, 0, 1],//framaná
    [153 / 255, 153 / 255, 0, 1],//vinstra megein
    [172 / 255, 172 / 255, 0, 1],//aftaná
    [96 / 255, 96 / 255, 0, 1],// undir
    [249 / 255, 249 / 255, 0, 1],//ofaná
    [156 / 255, 156 / 255, 0, 1]//hægri hlið
];

const reds = [
    [226 / 255, 37 / 255, 43 / 255, 1], //framaná (rose)
    [153 / 255, 15 / 255, 2 / 255, 1],//vinstramegin
    [172 / 255, 15 / 255, 2 / 255, 1],//aftaná ()
    [96 / 255, 11 / 255, 4 / 255, 1],//undir
    [249 / 255, 99 / 255, 87 / 255, 1],//ofaná
    [156 / 255, 16 / 255, 3 / 255, 1]//hægri hlið(lipstick)
];

function moveBlockCoord(axis, dir) {
    // if (!collision(dir, dim))
    for (var i = 0; i < 3; ++i) {
        cubes[i].coords[axis] += dir;
    }
}

//notkun: rotateBlock(axis, magnitude);
//fyrir: axis er ás sem snúa á um, magnitude er fjöldi gráða sem snúa skal um. MV er vörpunarfylki
//eftir: búið er að uppfæra vörpunarfylkið mv m.t.t. snúnings og því er skilað
function rotateBlock(axis, theta) {
    rotation[axis] = (rotation[axis] + theta) % 360;
    var rad = theta * (Math.PI) / 180;

    var canRotate = multiply(axis, rad);
    // if (!rotateTrue) return;
    var xOffset = 0;
    var zOffset = -2 / 6;
    var yOffset = cubes[0].myColor == 1 ? 20 / 6 : 21 / 6;

    var rotateArray = [0, 0, 0];
    rotateArray[axis] = 1;

    if (canRotate) {
        MV = mult(translate(-xOffset, -yOffset, -zOffset), MV);//hliðra aftur til baka
        MV = mult(rotate(theta, rotateArray), MV);
        MV = mult(translate(xOffset, yOffset, zOffset), MV);//hliðra kubbi núll
    }
}
//notkun: mv=moveBlock(axis, mv);
//fyrir: axis er stefna færslu, mv er vörpunarfylki
//eftir: buið er að uppfæra mv m.t.t. hliðrunar um 1 í stefnu axis.
function moveBlock(axis, mv) {
    var xOffset = (-3 + cubes[1].coords[X_AXIS]) / 6;
    var zOffset = (-3 + cubes[1].coords[Z_AXIS]) / 6;
    var yOffset = -((cubes[0].myColor == 1 ? 21 : 22) - cubes[1].coords[Y_AXIS]) / 6;

    if (axis == X_AXIS) mv = mult(mv, translate(xOffset, 0, 0));
    else if (axis == Z_AXIS) mv = mult(mv, translate(0, 0, zOffset));
    else if (axis == Y_AXIS) mv = mult(mv, translate(0, yOffset, 0));
    return mv;
}