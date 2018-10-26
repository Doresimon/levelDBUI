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
                arg.db.path = arg.db.path || dbPath
                if(!fs.existsSync(arg.db.path))  {throw {message:"path is wrong"}}
                db = level(`${arg.db.path}/${arg.db.name}`)
                res.type = "info"
                res.msg = `${arg.db.path}/${arg.db.name} successfully opened`
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
        case 'readKeys':
            try{
                let option = {
                    // start:'', // null = 0 in ascii
                    // end: '', // int32
                    keys:true,  // true
                    values:false,   // true
                    reverse:false, // false
                    limit:32, // -1
                }
                res.type = 'info'
                res.msg = 'looking up~'
                let resDelay = {
                    method:arg.func,
                    value:[],
                    total:0,
                }
                db.createReadStream(option)
                .on('data', async function (data) {
                    resDelay.value.push(data)
                    // const buf = Buffer.from(data, 'ascii');
                    // console.log(buf)
                    // console.log(buf.toString('utf-8'))

                    // // let x = await db.get(data)
                    // console.log(typeof data)
                    // console.log(typeof buf)

                })
                .on('error', function (err) {
                    console.log('Oh my!', err)
                })
                .on('close', function () {
                    console.log('Stream closed')
                })
                .on('end', function () {
                    resDelay.total = resDelay.value.length
                    resDelay.type = 'info'
                    resDelay.msg = 'looking up finish~'
                    event.sender.send('DB-response-channel', resDelay)
                })

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