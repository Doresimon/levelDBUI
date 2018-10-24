// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const level = require('level')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  // win.loadFile('index.html')  
  // 加载远程URL
  // win.loadURL('https://github.com')
  // 或加载本地HTML文件
  win.loadURL(`file://${__dirname}/app/index.html`)

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  // 1) Create our database, supply location and options.
  //    This will create or open the underlying LevelDB store.
  let db = level('./DB/test')

  async function save(){
      await db.put('halo','18 years old');
      await db.put('alice','19 years old');
      await db.put('bob','20 years old');
      await db.put('carol','21 years old');
  }

  save()



}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
