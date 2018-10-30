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
        codingOption:['utf8','hex','ascii'],
        coding:'utf8',
    },
    methods: {
        put(){
            this.db.put(this.data.Key, this.data.Value)
        },
        get(k, c){
            if (k) {
                this.data.Key = k
            }
            this.db.get(this.data.Key, c)
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
            if (arg.type=='info') {
                switch (arg.method) {
                    case 'get':
                        _t_.data.Value = Buffer.from(arg.value).toString(_t_.coding)
                        // myString = JSON.parse( JSON.stringify( arg.value ) )
                        break;
                    case 'readKeys-data':
                        _t_.db.total = arg.total
                        _t_.db.keys = []
                        console.log(arg.value)
                        for (let i = 0; i < arg.value.length; i++) {
                            const e = arg.value[i];
                            e.id = i
                            _t_.db.keys.push(e)
                        }
                        break;
                
                    default:
                        break;
                }
            }            
            let tmp = {
                type:arg.type,
                msg:arg.msg,
            }
            _t_.res.push(tmp)
        })
    }
  })