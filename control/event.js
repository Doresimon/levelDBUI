const {ipcMain} = require('electron')
const level = require('level')

let dbName = 'test'
let db = level(`./DB/${dbName}`)

ipcMain.on('DB-Channel', async (event, arg) => {
    console.log(arg) // prints "ping"
    let res
    switch (arg.func) {
        case 'open':
            await db.close()
            db = level(`./DB/${arg.dbName}`)
            break;
        case 'put':
            await db.put(arg.data.k, arg.data.v)
            break;
        case 'get':
            res = await db.get(arg.data.k)
            break;

        default:
            res = '??'
            break;
    }

    event.sender.send('DB-response-channel', res)
})
  
ipcMain.on('synchronous-message', (event, arg) => {
    console.log(arg) // prints "ping"
    event.returnValue = 'pong'
})