const {ipcMain} = require('electron')
const level = require('level')


let dbName = 'test'
let db = level(`./DB/${dbName}`)

ipcMain.on('DB-Channel', async (event, arg) => {
    console.log(arg) // prints "ping"

    switch (arg.func) {
        case 'open':
            await db.close()
            db = level(`./DB/${arg.dbName}`)
            break;
        case 'put':
            
            break;
        case value:
            
            break;
        case value:
            
            break;
    
        default:
            break;
    }

    event.sender.send('DB-Channel', 'pong')
})
  
ipcMain.on('synchronous-message', (event, arg) => {
    console.log(arg) // prints "ping"
    event.returnValue = 'pong'
})



async function save(){
    console.log("[LEVEL] save()")
    await db.put('halo','18 years old');
    await db.put('alice','19 years old');
    await db.put('bob','20 years old');
    await db.put('carol','21 years old');
}

save()