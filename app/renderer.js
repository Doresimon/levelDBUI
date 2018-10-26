// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

//在渲染器进程 (网页) 中。
const {ipcRenderer} = require('electron')

db = {
    ipcRenderer:ipcRenderer,
    name:'default',
    path:'./DB',
    keys:[],
    total:0,
    open(path, name){
        this.name = name
        this.path = path
        let args = {
            type:'CALL',
            msg:'open db',
            func:'open',
            db:{
                name:this.name,
                path:this.path,
            },
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
            db:{
                name:this.name,
                path:this.path,
            },
        }
        ipcRenderer.send('DB-Channel', args)
    },
    get(key){
        let args = {
            type:'CALL',
            msg:'get data',
            func:'get',
            data:{
                k:key,
            },
            db:{
                name:this.name,
                path:this.path,
            },
        }
        ipcRenderer.send('DB-Channel', args)
    },
    del(key){
        let args = {
            type:'CALL',
            msg:'delete data',
            func:'del',
            data:{
                k:key,
            },
            db:{
                name:this.name,
                path:this.path,
            },
        }
        ipcRenderer.send('DB-Channel', args)
    },
    readKeys(){
        let args = {
            type:'CALL',
            msg:'read all key of current DB instance',
            func:'readKeys',
        }
        ipcRenderer.send('DB-Channel', args)
    },
}