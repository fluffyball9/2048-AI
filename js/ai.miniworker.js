let table = new Map();
function getFrom(key) {
    //console.log("get " + key + " is " + table[key]);
    //console.log(table);
    return table.get(key);
}
function exists(key) {
    //console.log("exists " + key + " is " + (table[key]!=undefined));
    return table.has(key);
}
function set(key, val) {
    //console.log("set "+key+" to "+val);
    table.set(key, val);
}
let log = (e)=>{postMessage({data:e})};
let imports = { Map: { getFrom, exists, set }, console:{log:e=>log(e), logf:e=>log(e.toFixed(6))}, Math:{pow:Math.pow}};
(async () => {
    let asm = await WebAssembly.instantiateStreaming(fetch("js/2048.wasm"), imports);
    //console.log(asm);
    asm.instance.exports._start();
    onmessage = async function (e) {
        if(e.data=="reset") {
            asm = await WebAssembly.instantiateStreaming(fetch("js/2048.wasm"), imports);
            //console.log(asm);
            asm.instance.exports._start();
            return;
        }
        let res = { move: e.data.move, score: asm.instance.exports.score_toplevel_move(e.data.board, e.data.move) };
        postMessage(res);
    }
})();

//broken board: '[[null,null,null,null],[null,null,null,null],[null,{"x":2,"y":1,"value":4,"previousPosition":{"x":2,"y":1},"mergedFrom":null},null,null],[null,{"x":3,"y":1,"value":2,"previousPosition":{"x":3,"y":1},"mergedFrom":null},{"x":3,"y":2,"value":2,"previousPosition":{"x":3,"y":2},"mergedFrom":null},{"x":3,"y":3,"value":2,"previousPosition":{"x":3,"y":3},"mergedFrom":null}]]'