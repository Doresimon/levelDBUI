const {ipcMain} = require('electron')
const level = require('level')

let dbPath = './DB'
let dbName = 'default'
let db = level(`${dbPath}/${dbName}`)

ipcMain.on('DB-Channel', async (event, arg) => {
    console.log(arg) // prints "ping"
    let res
    switch (arg.func) {
        case 'open':
            await db.close()
            try{
                arg.dbPath = arg.dbPath || dbPath
                db = level(`${arg.dbPath}/${arg.dbName}`)
                res = `${arg.dbPath}/${arg.dbName} successfully opened`
            }catch(err){
                res = err.message
                db = null
            }
            break;
        case 'put':
            try{
                await db.put(arg.data.k, arg.data.v)
                res = `${arg.data.k} successfully updated`
            }catch(err){res = err.message}
            break;
        case 'get':
            try{
                res = await db.get(arg.data.k)
            }catch(err){
                res = err.message
            }
            break;

        default:
            res = '???'
            break;
    }

    event.sender.send('DB-response-channel', res)
})
  
ipcMain.on('synchronous-message', (event, arg) => {
    console.log(arg) // prints "ping"
    event.returnValue = 'pong'
})