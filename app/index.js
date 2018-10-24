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
        open(){
            if (this.data.DBName!='') {
                db.open(this.data.DBName)
            }
        }
    },
    created(){
        let _t_ = this
        ipcRenderer.on('DB-Channel', (event, arg) => {
            _t_.res.push(arg)
        })
    }
  })