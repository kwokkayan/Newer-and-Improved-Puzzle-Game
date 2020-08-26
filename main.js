const {app, BrowserWindow} = require('electron')
const path = require('path')
const fs = require('fs')

let mainWindow = null
function initialize(){
    let imgList = new Array()

    function initializeWindow(){ // To initialize window and load html
        //TODO: add config and stuff
        mainWindow = new BrowserWindow({ 
            width : 600,
            height : 400
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
                    fs.readFile(path.join(imgFolderPath, imgPath), (err, data) => { //read file into list
                        if (err)
                            console.log(err) //Logs read file error
                        else
                            imgList.push(data) 
                            console.log("read " + imgPath + " and appended to list")
                    })
                })
            }
        })
    }

    readImg()
    app.whenReady().then(initializeWindow)
}

initialize()