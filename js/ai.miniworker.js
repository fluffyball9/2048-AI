let table = {};
function getFrom(key) {
    return table[key];
}
function exists(key) {
    return table[key]!=undefined;
}
function set(key, val) {
    table[key] = val;
}
let imports = { Map: { getFrom, exists, set }, Math:{pow:Math.pow}};
(async () => {
    let asm = await WebAssembly.instantiateStreaming(fetch("2048.wasm"), imports);
    //console.log(asm);
    asm.instance.exports._start();
    onmessage = async function (e) {
        if(e.data=="reset") {
            asm = await WebAssembly.instantiateStreaming(fetch("2048.wasm"), imports);
            //console.log(asm);
            asm.instance.exports._start();
            return;
        }
        let res = { move: e.data.move, score: asm.instance.exports.score_toplevel_move(e.data.board, e.data.move) };
        postMessage(res);
    }
})();
