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
                let buf = Buffer.from(arg.data.k)
                await db.put(buf, arg.data.v)
                res.type = "info"
                res.msg = `${arg.data.k} successfully updated`
            }catch(err){
                res.type = "error"
                res.msg = err.message
            }
            break;
        case 'get':
            try{
                if (arg.db.coding=='uri') {
                    arg.data.k =decodeURI(arg.data.k)
                }
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
                    method:arg.func+'-data',
                    value:[],
                    total:0,
                }
                let k = 1
                db.createReadStream(option)
                .on('data', async function (data) {
                    let buf = Buffer.from(data)

                    resDelay.value.push({
                        utf8:   buf.toString('utf8'),
                        hex:    buf.toString('hex'),
                        ascii:  buf.toString('ascii'),
                        uri:    encodeURI(data),
                    })
                    // resDelay.value.push(`${data.length} ${data}`)
                    // kk = Buffer.from(data,'utf8')
                    // let buf = Buffer.from(data)
                    // let buf_ascii = Buffer.from(data,'ascii')
                    // let buf_utf8 = Buffer.from(data,'utf8')
                    // // resDelay.value.push(`${data.length} ${buf.toString('hex')}`)
                    // // console.log(data.length)
                    // // console.log(typeof data)
                    // // console.log(data)
                    console.log(buf)
                    // console.log(buf_ascii)
                    // console.log(buf_utf8)
                    // console.log(buf.toString())
                    // console.log(buf.toString('ascii'))
                    // console.log(buf.toString('utf8'))
                    // let d = await db.get(buf.toString('ascii'))
                    // console.log(d)
                    // let e = await db.get(buf.toString('ascii'))
                    // console.log(Buffer.from(e,'ascii'))
                    // let f = await db.get(buf.toString('utf8'))
                    // console.log(Buffer.from(f,'ascii'))
                })
                .on('error', function (err) {
                    console.log('Oh my!', err)
                })
                .on('close', function () {
                    console.log('Stream closed')
                })
                .on('end', async function () {
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