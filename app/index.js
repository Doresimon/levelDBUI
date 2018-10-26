var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        data:{
            Key:'',
            Value:'',
            dbName:'',
            dbPath:'',
        },
        res:[],
    },
    methods: {
        put(){
            db.put(this.data.Key, this.data.Value)
        },
        get(){
            db.get(this.data.Key)
        },
        del(){
            db.del(this.data.Key)
        },
        open(){
            if (this.data.dbName!='') {
                db.open(this.data.dbPath, this.data.dbName)
            }
        }
    },
    created(){
        let _t_ = this
        db.ipcRenderer.on('DB-response-channel', (event, arg) => {
            console.log(arg)
            switch (arg.method) {
                case 'get':
                    _t_.data.Value = arg.value
                    break;
            
                default:
                    break;
            }
            let tmp = {
                type:arg.type,
                msg:arg.msg,
            }
            _t_.res.push(tmp)
        })
    }
  })