const { ipcRenderer } = require('electron') 

const CANVAS_MAX_WIDTH = 400
const CANVAS_MAX_HEIGHT = 600

function generatePuzzle (imgPath, difficulty){ //generates the puzzle from an image
    var length = difficulty + 3 // 3x3 4x4 5x5 ez to hard
    
    var img = new Image()
    img.src = imgPath

    var canvas = document.getElementById("game_container") //gets canvas
    var ctx = canvas.getContext("2d")
    canvas.width = CANVAS_MAX_WIDTH
    canvas.height = CANVAS_MAX_HEIGHT

    img.onload = () => {
        //TODO: RESIZE IMAGE
        var cellWidth = CANVAS_MAX_WIDTH / length
        var cellHeight = CANVAS_MAX_HEIGHT / length
        var widthRatio = img.width / CANVAS_MAX_WIDTH    
        var heightRatio = img.height / CANVAS_MAX_HEIGHT
        var srcImgCellWidth = cellWidth * widthRatio
        var srcImgCellHeight = cellHeight * heightRatio
        var xOffset = 5
        var yOffset = 5

        for (var row = 0; row < length; row++)
            for (var col = 0; col < length; col++){
                console.log("Drawing row" + row + ", col" + col)
                
                if(row == 0)
                    yOffset = 0
                else
                    yOffset = 5 * row

                if (col == 0)
                    xOffset = 0
                else
                    xOffset = 5 * col

                ctx.drawImage(img, col * srcImgCellWidth, row * srcImgCellHeight, srcImgCellWidth, srcImgCellHeight, col * cellWidth + xOffset, row * cellHeight + yOffset, cellWidth, cellHeight)
            }
    }
}

ipcRenderer.send("genPuzzle", "puzzle generation ready")
ipcRenderer.on("puzzleArgs", (event, path, diff) => {
    console.log("Generating puzzle with args:\n" + path + '\n' + diff)
    generatePuzzle(path, diff)
})