const {contextBridge, ipcRenderer} = require("electron");

console.log(process);

contextBridge.exposeInMainWorld("modules", {
    "comm": {
        send: (event, payload)  => ipcRenderer.send(event, payload),
        invoke:  (event, payload) => ipcRenderer.invoke(event, payload),
        on:  (event, fn) => ipcRenderer.on(event, fn),
    }
})