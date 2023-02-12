let worker = new Worker("js/ai.worker.js");
let runAI = false;
let won = GM.won;
window.a = "";
worker.onmessage = function(e) {
    if(e.data.data != undefined) {
        console.log(e.data.data);
        return;
    }
    GM.move([0, 2, 3, 1][e.data]);
    console.log(e.data);
    //stopai();
    if((GM.won&&!won)||GM.over) {
        stopai();
        if(GM.won) {
            won = true;
        }
        if(GM.over) {
            won = false;
            worker.postMessage("reset");
        }
    } else if(runAI) {
        worker.postMessage({cells:GM.grid.cells});
    }
};
function startai() {
    runAI = true;
    worker.postMessage({cells:GM.grid.cells});
    //worker.postMessage("start");
    document.getElementById("ai").onclick = stopai;
    document.getElementById("ai").innerText = "Stop AI";
}

function stopai() {
    runAI = false;
    //worker.postMessage("stop");
    document.getElementById("ai").onclick = startai;
    document.getElementById("ai").innerText = "Start AI";
}

window.addEventListener("load", ()=>{
    document.getElementById("ai").onclick = startai;
});

