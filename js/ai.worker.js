let imports = {};
(async () => {
    let asm = await WebAssembly.instantiateStreaming(fetch("2048.wasm"), imports);
    asm.instance.exports._start();
    this.addEventListener("message", async function (e) {
        if(e.data.depth) {
            asm.instance.exports.set_depth(e.data.depth);
            return;
        }
        if(e.data.return) {
            return;
        }
        let res = { move: e.data.move, score: asm.instance.exports.score_toplevel_move(e.data.board, e.data.move) };
        postMessage(res);
    });
})();

function createPromise() {
    return new Promise(function(resolve) {
        onmessage = (e)=>{
            resolve(e.data.data);
            onmessage = undefined;
        }
    })
}
