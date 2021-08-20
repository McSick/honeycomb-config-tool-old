// main.js

// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, ipcMain, nativeImage} = require('electron')
const path = require('path')
const Store = require('electron-store');
const HoneycombAPI = require('./src/HoneycombAPI.js');
const store = new Store();
const fs = require('fs');

let rawdata = fs.readFileSync(path.join(__dirname,'templates/dashboards/refinery.json'));
let refineryjson = JSON.parse(rawdata);

let hnyapi = new HoneycombAPI({ apikey: store.get('honeycomb_api_key'), apihost: "api"});

ipcMain.on("saveKey", (event, args) => {
    store.set('honeycomb_api_key', args);

  });

  ipcMain.on("deployBoard", async (e, dataset) => {

    let stringyjson = JSON.stringify(refineryjson);
    let replacedjson = stringyjson.replaceAll('<dataset>', dataset);
    let response = await hnyapi.createBoard(replacedjson)
    e.sender.send('boardDeployed', response);

  });
ipcMain.on("loadDatasets", async (e)=> {
    let ds = await hnyapi.getDatasets();
    e.sender.send('datasets', ds);
});
function createWindow () {

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: path.join(__dirname, 'icons', 'experiment.png'),
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
    },
    {
      label: "Edit",
      submenu: [
          { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
          { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
          { type: "separator" },
          { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
          { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
          { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
          { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
      ]}
  

])

Menu.setApplicationMenu(menu); 

    
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
    //mainWindow.webContents.openDevTools()
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
const image = nativeImage.createFromPath(
  path.join(__dirname, 'icons', 'experiment.png')
);
app.dock.setIcon(image);
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
