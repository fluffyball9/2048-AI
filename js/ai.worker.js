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
        postMessage({data:board});
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
    //console.log(board);
    let cboard = BigInt(0), i = 0;
    for(row of board) {
        for(c of row) {
            cboard |= BigInt(c) << BigInt(4*i);
            i+=1;
        }
    }
    /*for(i=0; i<4; i++) {
        for(j=0; j<4; j++) {
            powerVal = Number((cboard) & BigInt(0xf));
            console.log((powerVal == 0) ? 0 : 1 << powerVal);
            cboard >>= BigInt(4);
        }
        //printf("\n");
    }*/
    return cboard;
}

let miniWorkers = [new Worker("/js/ai.miniworker.js"), new Worker("/js/ai.miniworker.js"), new Worker("/js/ai.miniworker.js"), new Worker("/js/ai.miniworker.js")]

function createPromise(worker) {
    return new Promise(function(resolve) {
        worker.onmessage = (e)=>{
            resolve(e.data);
            worker.onmessage = undefined;
        }
    })
}

miniWorkers[0].addEventListener("message", e=>{if(e.data.data!=undefined) {
    //postMessage(e.data);
    return;
}});

/*let run = async()=>{
    if(runAI) {
        
    }
    setTimeout(run, 0);
}
setTimeout(run, 0);*/