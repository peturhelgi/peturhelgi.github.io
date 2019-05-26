var movement = false;
var spinX = 17;
var spinY = -20;
var origX;
var origY;
const ARROW_LEFT = 37;
const ARROW_UP = 38;
const ARROW_RIGHT = 39;
const ARROW_DOWN = 40;
const SPACE_BAR = 32;
const KEY_A = 65;
const KEY_C = 67;
const KEY_D = 68;
const KEY_S = 83;
const KEY_X = 88;
const KEY_Z = 90;
const NUM_0 = 96;
const ENTER = 13;

function onMouseDown(e) {
    movement = true;
    origX = e.clientX;
    origY = e.clientY;
    e.preventDefault();         // Disable drag and gravity
}

function onMouseUp(e) {
    movement = false;
}

function onMouseMove(e) {
    if (movement) {
        spinY = (spinY + (e.clientX - origX)) % 360;
        spinX = (spinX + (origY - e.clientY)) % 360;
        origX = e.clientX;
        origY = e.clientY;
    }
}
function onMouseWheel(e) {
    if (e.wheelDelta > 0.0) {
        zDist += 0.2;
    } else {
        zDist -= 0.2;
    }
}


function onKeyDown(e) {
    switch (e.keyCode) {

        case ARROW_UP:
            var step = -1;//næsta skref á að vera í mínusstefnu
            if (!spacePressed && !collision(step, Z_AXIS))
                moveBlockCoord(Z_AXIS, step);
            break;
        case ARROW_DOWN:
            var step = 1;//næsta skref á að vera í plússtefnu 
            if (!spacePressed && !collision(step, Z_AXIS))
                moveBlockCoord(Z_AXIS, step);
            break;
        case ARROW_LEFT:
            var step = -1;//næsta skref á að vera í mínusstefnu
            if (!spacePressed && !collision(step, X_AXIS))
                moveBlockCoord(X_AXIS, step);
            break;
        case ARROW_RIGHT:
            var step = 1;//næsta skref á að vera í plús stefnu
            if (!spacePressed && !collision(step, X_AXIS))
                moveBlockCoord(X_AXIS, step);
            break;
        case SPACE_BAR:
            var step = -1; // fer ávallt niður á við
            while (!collision(step, Y_AXIS)) {
                moveBlockCoord(Y_AXIS, step);
            }

            spacePressed = true;
            if (spawn) {
                score += 25;
                clearTimeout(time);
                time = setTimeout(recycle, interval);
                spawn = false;
            }
            break;
        case KEY_A: //a
            if (!spacePressed) {
                if (rotateTrue) {
                    rotateBlock(X_AXIS, 90);
                }
                rotateTrue = true;
            }
            break;
        case KEY_Z: //z
            if (!spacePressed) {
                if (rotateTrue) {
                    rotateBlock(X_AXIS, -90);
                }
                rotateTrue = true;
            }
            break;
        case KEY_S: //s
            if (!spacePressed) {
                if (rotateTrue) {
                    rotateBlock(Z_AXIS, 90);
                }
                rotateTrue = true;
            }
            break;
        case KEY_X: //x
            if (!spacePressed) {
                if (rotateTrue) {
                    rotateBlock(Z_AXIS, -90);
                }
                rotateTrue = true;
            }
            break;
        case KEY_D: //d
            if (!spacePressed) {
                if (rotateTrue) {
                    rotateBlock(Y_AXIS, 90);
                }
                rotateTrue = true;
            }
            break;
        case KEY_C: //c
            if (!spacePressed) {
                if (rotateTrue) {
                    rotateBlock(Y_AXIS, -90)
                }
                rotateTrue = true;
            }
            break;
        case NUM_0: //numpad 0
            var step = -1;
            if (!collision(step, Y_AXIS)) {
                moveBlockCoord(Y_AXIS, step);
                ++score;
            }
            break;
        case ENTER://enter
            var step = -1;
            if (!collision(step, Y_AXIS)) {
                moveBlockCoord(Y_AXIS, step);
                ++score;
            }
            break;
    }
}