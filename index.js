const bw = Math.floor((innerWidth * 0.7) / 7.1) * 10;
const bh = Math.floor(innerHeight / 11) * 10;
const p = 10;

document.getElementById("canvas").setAttribute("width", `${bw}px`);
document.getElementById("canvas").setAttribute("height", `${bh}px`);

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const drawGrid = () => {
    for (var x = 0; x <= bw; x += p) {
        ctx.moveTo(0.5 + x, 0);
        ctx.lineTo(0.5 + x, bh);
    }

    for (var x = 0; x <= bh; x += p) {
        ctx.moveTo(0, 0.5 + x);
        ctx.lineTo(bw, 0.5 + x);
    }

    ctx.strokeStyle = "black";
    ctx.stroke();
};

drawGrid();
const fillCell = (x, y) => ctx.fillRect(x * p, y * p, p, p);

const parsePlainText = plaintext => {
    plaintext = plaintext.split("\n");
};

let aliveCells = [];
const enterCell = () => {
    const cell = [parseInt(document.getElementById("x").value), parseInt(document.getElementById("y").value)];

    aliveCells.push(cell);
    fillCell(...cell);
};

const findNeighbors = (x, y) => {
    let n = 0;
    if (aliveCells.some(a => [x - 1, y - 1].every((v, i) => v === a[i]))) n++;
    if (aliveCells.some(a => [x - 1, y].every((v, i) => v === a[i]))) n++;
    if (aliveCells.some(a => [x - 1, y + 1].every((v, i) => v === a[i]))) n++;
    if (aliveCells.some(a => [x, y - 1].every((v, i) => v === a[i]))) n++;
    if (aliveCells.some(a => [x, y + 1].every((v, i) => v === a[i]))) n++;
    if (aliveCells.some(a => [x + 1, y - 1].every((v, i) => v === a[i]))) n++;
    if (aliveCells.some(a => [x + 1, y].every((v, i) => v === a[i]))) n++;
    if (aliveCells.some(a => [x + 1, y + 1].every((v, i) => v === a[i]))) n++;
    return n;
};

let dt;
let lt = 0;

const gameLoop = ts => {
    dt = ts - lt;
    lt = ts;

    document.getElementById("start").setAttribute("disabled", true);
    document.getElementById("enter").setAttribute("disabled", true);

    let newCells = aliveCells.slice(0);

    for (const cell of aliveCells) {
        if (!aliveCells.some(a => cell.every((v, i) => v === a[i]))) continue;

        const nCount = findNeighbors(...cell);
        if (nCount < 2 || nCount > 3) {
            newCells.splice(
                newCells.findIndex(a => cell.every((v, i) => v === a[i])),
                1
            );
        }
    }

    for (let x = 0; x <= bw / 10; x++) {
        for (let y = 0; y <= bh / 10; y++) {
            const nCount = findNeighbors(x, y);

            if (!aliveCells.some(a => [x, y].every((v, i) => v === a[i])) && nCount === 3) {
                newCells.push([x, y]);
            }
        }
    }

    ctx.clearRect(0, 0, bw, bh);
    drawGrid();
    aliveCells = newCells.slice(0);
    for (const cell of aliveCells) fillCell(...cell);

    setTimeout(() => requestAnimationFrame(gameLoop), 50 ** 2 / dt);
};
