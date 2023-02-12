let runAI = false;
let cells = null;
onmessage = async function(e) {
    /*if(e.data == "start") {
        runAI = true;
    } else if(e.data == "stop") {
        runAI = false;
    } else */if(e.data == "reset") {
        for (const i in miniWorkers) {
            miniWorkers[i].postMessage("reset");
        }
    }
     else {
        cells = e.data.cells;
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
        if(bestMove != -1)
            postMessage(bestMove);
    }
}

function getBoard() {
    let board = [[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0]];
    for (row of cells) {
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

let miniWorkers = [new Worker("ai.miniworker.js"), new Worker("ai.miniworker.js"), new Worker("ai.miniworker.js"), new Worker("ai.miniworker.js")]

function createPromise(worker) {
    return new Promise(function(resolve) {
        worker.onmessage = (e)=>{
            resolve(e.data);
            worker.onmessage = undefined;
        }
    })
}
