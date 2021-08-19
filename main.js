// main.js

// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('path')
const Store = require('electron-store');
const HoneycombAPI = require('./src/HoneycombAPI.js');
const store = new Store();



let hnyapi = new HoneycombAPI(store.get('honeycomb_api_key'));

ipcMain.on("saveKey", (event, args) => {
    store.set('honeycomb_api_key', args);

  });
ipcMain.on("loadDatasets", async (e)=> {
    let ds = await hnyapi.getDatasets();
    e.sender.send('datasets', ds);
});
function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  var menu = Menu.buildFromTemplate([
    {
        label: 'File',
        submenu: [
            {label:'About'},
            {label:'Settings', click() {
                mainWindow.webContents.send("showSettings", {apikey:store.get('honeycomb_api_key')});
            }},
            {type:'separator'},  // Add this
            {label:'Exit',
            click() { 
                app.quit() 
            }
         }
        ]
    }
])

Menu.setApplicationMenu(menu); 

    
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
    mainWindow.webContents.openDevTools()
    //mainWindow.webContents.send("loadSettings", {apikey: store.get('honeycomb_api_key')});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
