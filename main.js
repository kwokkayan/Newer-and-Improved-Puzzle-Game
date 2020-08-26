const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const fs = require('fs')

let mainWindow = null
let imgPathList = new Array()

function initialize(){
    function initializeWindow(){ // To initialize window and load html
        //TODO: add config and stuff
        mainWindow = new BrowserWindow({ 
            width : 600,
            height : 400,
            webPreferences: { //don't know what this does
                nodeIntegration: true, 
            }
        })
        //TODO: change to index.html + add event listeners (need to look into)
        const indexPath = path.join("file://", __dirname, "index.html")
        mainWindow.loadURL(indexPath)
        mainWindow.once('responsive', () => {
            mainWindow.show()
        })
        mainWindow.webContents.openDevTools()
    }
    
    function readImg(){ // To read all source images available
        const imgFolderPath = path.join("data/srcImg") //Shouldn't it be ("file://", __dirname, "data/srcImg") ?
        fs.readdir(imgFolderPath, (err, imgsPath) => {
            if (err)
                console.log(err) //Logs read file name error error
            else{
                console.log("\nAll images:") //Logs files
                imgsPath.forEach(imgPath => {
                    console.log(imgPath) 
                    imgPathList.push(path.join(imgFolderPath, imgPath))
                })
            }
        })
    }

    readImg()
    app.whenReady().then(initializeWindow)
}

initialize()

ipcMain.on("genPuzzle", (event, confirmation) => { //generates puzzle and waits for completion
    console.log(confirmation)
    //TODO: ask for inputs
    event.reply("puzzleArgs", imgPathList[0], 2) //sends args for gen puzzle
})

//generatePuzzle(imgPathList[0], 2)