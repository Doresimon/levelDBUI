var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        data:{
            Key:'',
            Value:'',
        },
        res:[],
        db:db,
    },
    methods: {
        put(){
            this.db.put(this.data.Key, this.data.Value)
        },
        get(){
            this.db.get(this.data.Key)
        },
        del(){
            this.db.del(this.data.Key)
        },
        readKeys(){
            this.db.readKeys()
        },
        clearHistory(){
            this.res = []
        },
        clearValue(){
            this.data.Value = ''
        },
        open(){
            if (this.db.name!='') {
                this.db.open(this.db.path, this.db.name)
            }
        }
    },
    created(){
        let _t_ = this
        db.ipcRenderer.on('DB-response-channel', (event, arg) => {
            console.log(event)
            console.log(arg)
            switch (arg.method) {
                case 'get':
                    _t_.data.Value = arg.value
                    break;
                case 'readKeys':
                    _t_.db.total = arg.total
                    _t_.db.keys = arg.value
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