var collisionMap = new Array();
const YDim = 21;
const XDim = 6;
const ZDim = 6;
const collisionYDim = YDim + 2;
const collisionXDim = XDim + 2;
const collisionZDim = ZDim + 2;
const numCubesPerLevel = ZDim * XDim;

for (var x = 0; x < collisionXDim; x++) {
    collisionMap[x] = new Array();
    for (var z = 0; z < collisionZDim; z++) {
        collisionMap[x][z] = new Array();
        for (var y = 0; y < collisionYDim; y++) {
            collisionMap[x][z][y] = 0;
        }
        collisionMap[x][z][0] = 1;
    }
}

for (var x = 0; x < collisionXDim; x++) {
    for (var y = 0; y < collisionYDim; y++) {
        collisionMap[x][0][y] = 1;
        collisionMap[x][collisionZDim - 1][y] = 1;
    }
}
for (var z = 0; z < collisionZDim; z++) {
    for (var y = 0; y < collisionYDim; y++) {
        collisionMap[0][z][y] = 1;
        collisionMap[collisionXDim - 1][z][y] = 1;
    }
}