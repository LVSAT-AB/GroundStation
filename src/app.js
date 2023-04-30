const {app, BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');
const io = require('socket.io-client')
const socket = io.connect('http://localhost:3000');

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