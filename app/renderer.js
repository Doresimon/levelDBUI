// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

//在渲染器进程 (网页) 中。
const {ipcRenderer} = require('electron')

// console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

// ipcRenderer.on('DB-Channel', (event, arg) => {
//     console.log(event)
//     console.log(arg) // prints "pong"
// })

db = {
    name:'hello',
    open(name){
        this.name = name
        let args = {
            type:'CALL',
            msg:'open db',
            func:'open',
            dbName:this.name,
        }
        ipcRenderer.send('DB-Channel', args)
    },
    put(key, value){
        let args = {
            type:'CALL',
            msg:'put data',
            func:'put',
            data:{
                k:key,
                v:value,
            },
            dbName:this.name,
        }
        ipcRenderer.send('DB-Channel', args)
    },
    put(key){
        let args = {
            type:'CALL',
            msg:'get data',
            func:'get',
            data:{
                k:key,
            },
            dbName:this.name,
        }
        ipcRenderer.send('DB-Channel', args)
    },
}