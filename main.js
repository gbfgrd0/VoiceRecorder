const {app, BrowserWindow, Menu, shell} = require('electron');
const path = require('path');
const fs = require('fs');
const isMac = process.platform === 'darwin'?true:false
const os = require('os');

const destino = path.join(os.homedir(), 'Downloads')
function CriarJanela(){
    const win = new BrowserWindow({
        width: 500,
        height: 300,
        backgroundColor: "#234",
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        icon: path.join(__dirname, "assets","icon.png"),
        resizable: false
    })

    win.loadFile("./src/JanelaPrincipal/index.html")

    win.once('ready-to-show', ()=>{
        win.show()
    })
}

function PreferenciasJanela(){
    const preferenciasJanela = new BrowserWindow({
        width: 500,
        height: 150,
        backgroundColor: "#234",
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        icon: path.join(__dirname, "assets","icon.png"),
        resizable: false
    })

    preferenciasJanela.loadFile("./src/Preferencias/index.html")
    preferenciasJanela.once('ready-to-show', ()=>{
        preferenciasJanela.show()
        preferenciasJanela.webContents.send("nome-destino", destino)
    })
}

const menuTemplate = [
    {
        label: app.name,
        submenu:[
            {label: "Preferencias", click: () =>{PreferenciasJanela()}},
            {label: "Local de armazenamento ", click: ()=>{shell.openPath(destino)}}
        ],
    },
    {
        label: "Arquivo",
        submenu: [
            isMac?{role: "close"}:{role:"Quit"}
        ]
    }
]

const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)

app.whenReady().then(()=>{
    CriarJanela()
})

app.on('window-all-closed', ()=>{
    console.log("Todas as janelas foram fechadas")
    if(!isMac){
        app.quit()
    }
})

/* ipcMain.on("open_new_window", ()=> {
    CriarJanela()
})

ipcMain.on("save_buffer", (e, buffer)=>{
    const filePath = path.join(destino, `${Date.now()}`)
    fs.writeFile(`${filePath}.webm`, buffer, (err)=>{
        if(err){
            console.error(err)
        }else{
            console.log("Arquivo salvo com sucesso!")
        }
    })
}) */
