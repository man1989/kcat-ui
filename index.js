const {app, BrowserWindow, ipcMain} = require("electron/main");
const  path = require("node:path");
const { kcatExecutor, getRequirements } = require("./kafka-processor");


const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 800,
        icon: path.join(__dirname, "icon.icns"),
        webPreferences:{
            preload: path.join(__dirname, "preload.js"),
            devTools: false
        }
    });    

    win.loadFile("./index.html")
    // win.webContents.openDevTools();

    ipcMain.on("kcat", (event, payload) => {
        // const winn = BrowserWindow.fromWebContents(event.sender);
        console.log("title::set", payload);
        // winn.setTitle(payload);
        // console.log(event.sender);
        // event.sender.send("set-title", "hello")
        kcatExecutor("kcat", event.sender, payload);
    });

    ipcMain.handle("requirements", () => {
        console.log(getRequirements())
        return getRequirements();
    })

}

app.whenReady().then(() => {
    createWindow();
})