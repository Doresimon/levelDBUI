const {ipcMain} = require('electron')
const level = require('level')
const fs = require('fs')

let dbPath = './DB'
let dbName = 'default'
let db = level(`${dbPath}/${dbName}`)

ipcMain.on('DB-Channel', async (event, arg) => {
    console.log(arg) // prints "ping"
    let res = {
        method:arg.func,
    }
    switch (arg.func) {
        case 'open':
            await db.close()
            try{
                arg.dbPath = arg.dbPath || dbPath
                if(!fs.existsSync(arg.dbPath))  {throw {message:"path is wrong"}}
                db = level(`${arg.dbPath}/${arg.dbName}`)
                res.type = "info"
                res.msg = `${arg.dbPath}/${arg.dbName} successfully opened`
            }catch(err){
                res.type = "error"
                res.msg = err.message
            }
            break;
        case 'put':
            try{
                await db.put(arg.data.k, arg.data.v)
                res.type = "info"
                res.msg = `${arg.data.k} successfully updated`
            }catch(err){
                res.type = "error"
                res.msg = err.message
            }
            break;
        case 'get':
            try{
                res.value = await db.get(arg.data.k)
                res.type = "info"
                res.msg = 'ok'
            }catch(err){
                res.type = "warn"
                res.msg = err.message
            }
            break;
        case 'del':
            try{
                res.value = await db.del(arg.data.k)
                res.type = "info"
                res.msg = `${arg.data.k} deleted`
            }catch(err){
                res.type = "error"
                res.msg = err.message
            }
            break;

        default:
            res.type = "warn"
            res.msg = '???'
            break;
    }

    event.sender.send('DB-response-channel', res)
})