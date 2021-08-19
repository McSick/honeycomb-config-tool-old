// preload.js
const {
  contextBridge,
  ipcRenderer
} = require("electron");



// Expose protected methods that allow the renderer process to use
// // the ipcRenderer without exposing the entire object
// contextBridge.exposeInMainWorld(
//   "api", {
//       send: (channel, data) => {
//           // whitelist channels
//           let validChannels = ["toMain"];
//           if (validChannels.includes(channel)) {
//               ipcRenderer.send(channel, data);
//           }
//       },
//       receive: (channel, func) => {
//           let validChannels = ["showSettings"];
//           if (validChannels.includes(channel)) {
//               // Deliberately strip event as it includes `sender` 
//               ipcRenderer.on(channel, (event, ...args) => func(...args));
//           }
//       }
//   }
// );
let loaded = false;
contextBridge.exposeInMainWorld('api', {
  send: (channel, data) => {
    let validChannels = ['saveKey', 'loadDatasets']
    if (validChannels.includes(channel)) {
      if(channel === 'saveKey') {
        //store.set('honeycomb_api_key', data);s
        alert(data);
      //  hnyapi.updateKey(data);
       
      }
      ipcRenderer.send(channel, data);
      
    }
  },
  receive: (channel, func) => {
    let validChannels = ['showSettings', 'datasets']
    if (validChannels.includes(channel)) {

      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  },
  
})


// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', async () => {


    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
    }
  })
  
