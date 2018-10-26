var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        data:{
            Key:'',
            Value:'',
            DBName:'',
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
        open(){
            if (this.data.DBName!='') {
                db.open(this.data.DBName)
            }
        }
    },
    created(){
        let _t_ = this
        db.ipcRenderer.on('DB-response-channel', (event, arg) => {
            console.log(arg)
            _t_.res.push(arg)
            _t_.tmp = 'pong'
        })
    }
  })