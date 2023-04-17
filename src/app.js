const {app, BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');

function createWindow(){
    const win = new BrowserWindow({
        height: 720,
        width: 1440,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })

    
    win.loadURL(url.format(
        path.join(__dirname, '/pages/index/index.html')
    ))

    
}

app.on('ready', () => {
    createWindow();
})