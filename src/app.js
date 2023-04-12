const {app, BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');

/*if(process.env.NODE_ENV !== 'production') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    })
}*/
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