let runAI = false;
window.won = false;
window.a = "";
async function run() {
    let board = getBoard();
    let promises = [];
    for (const i in miniWorkers) {
        miniWorkers[i].postMessage({board, move:Number(i)})
        promises[i] = createPromise(miniWorkers[i]);
    }
    let values = await Promise.all(promises);
    let bestScore = values[0].score, bestMove = -1;
    for (const i in miniWorkers) {
        if(values[i].score>=bestScore) {
            bestScore = values[i].score;
            bestMove = values[i].move;
        }
    }
    if(bestMove != -1) {
        GM.move([0, 2, 3, 1][bestMove]);
        if((GM.won&&!won)||GM.over) {
            stopai();
            if(GM.won) {
                won = true;
            }
            if(GM.over) {
                won = false;
            }
        }
        if(runAI) {
            setTimeout(run, 0);
        }
    } else {
        stopai();
        won = false;
        for (const i in miniWorkers) {
            miniWorkers[i].postMessage("reset");
        }
    }
}
function startai() {
    runAI = true;
    run();
    document.getElementById("ai").onclick = stopai;
    document.getElementById("ai").innerText = "Stop AI";
}

function stopai() {
    runAI = false;
    document.getElementById("ai").onclick = startai;
    document.getElementById("ai").innerText = "Start AI";
}

function depthChange() {
    let v = document.getElementById("depth").value;
    console.log(v);
    if(v < 1) {
        v = document.getElementById("depth").value = 1;
    } else if(v > 2147483647) {
        v = document.getElementById("depth").value = 2147483647;
    }
    for (const i in miniWorkers) {
        miniWorkers[i].postMessage({depth:v});
    }
}

window.addEventListener("load", ()=>{
    document.getElementById("ai").onclick = startai;
});

function getBoard() {
    let board = [[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0]];
    for (row of GM.grid.cells) {
        for(cell of row) {
            if(cell==null) continue;
            board[cell.y][cell.x] = Math.log2(cell.value);
        }
    }
    let cboard = BigInt(0), i = 0;
    for(row of board) {
        for(c of row) {
            cboard |= BigInt(c) << BigInt(4*i);
            i+=1;
        }
    }
    return cboard;
}

let miniWorkers = [new Worker("js/ai.worker.js"), new Worker("js/ai.worker.js"), new Worker("js/ai.worker.js"), new Worker("js/ai.worker.js")];

function createPromise(worker) {
    return new Promise(function(resolve) {
        worker.onmessage = (e)=>{
            //if(e.data.type) return;
            resolve(e.data);
            worker.onmessage = undefined;
        }
    })
}