const { ipcRenderer } = require('electron') 

const CANVAS_MAX_WIDTH = 400
const CANVAS_MAX_HEIGHT = 600
const CANVAS_X_OFFSET = 10
const CANVAS_Y_OFFSET = 10

var canvas = document.getElementById("game_container") //gets canvas
var ctx = canvas.getContext("2d")

function generatePuzzle (imgPath, difficulty){ //generates the puzzle from an image
    var length = difficulty + 3 // 3x3 4x4 5x5 ez to hard
    
    var img = new Image()
    img.src = imgPath

    canvas.width = CANVAS_MAX_WIDTH + CANVAS_X_OFFSET * 4//maybe expand the purpose of canvas???
    canvas.height = CANVAS_MAX_HEIGHT + CANVAS_Y_OFFSET * 4

    var piecesList = new Array() //create array for puzzle pieces (partitions of image)

    img.onload = () => {
        
        const CELLWIDTH = CANVAS_MAX_WIDTH / length        // 
        const CELLHEIGHT = CANVAS_MAX_HEIGHT / length      // 
        var widthRatio = img.width / CANVAS_MAX_WIDTH      // These lines defined the heights and widths of indiviual puzzle pieces,
        var heightRatio = img.height / CANVAS_MAX_HEIGHT   // and their source images equivilents.
        var srcImgCellWidth = CELLWIDTH * widthRatio       //
        var srcImgCellHeight = CELLHEIGHT * heightRatio    //

        for (var row = 0; row < length; row++)
            for (var col = 0; col < length; col++){
                piecesList.push({
                    sourceX: col * srcImgCellWidth,
                    sourceY: row * srcImgCellHeight,
                    id: row * 5 + col,
                    //puzzleBoardX: col * cellWidth,
                    //puzzleBoardY: row * cellHeight
                })
            }
        piecesList.pop() //delete last piece to create buffer

        for(var i = piecesList.length - 1; i > 0; i--){ //Fisher-Yates shuffle for the pieces
            let j = Math.floor(Math.random() * (i + 1))
            let temp = piecesList[i]
            piecesList[i] = piecesList[j]
            piecesList[j] = temp
        }
        //console.log(piecesList) 
        
        var xOffset = 5 //initialize some values
        var yOffset = 5
        var row = 0
        var col = 0

        piecesList.forEach(piece => { //draws the pieces
            if(row == 0)
                yOffset = 0
            else
                yOffset = 5 * row
            if (col == 0)
                xOffset = 0
            else
                xOffset = 5 * col

            piece.puzzleBoardX = col * CELLWIDTH + xOffset + CANVAS_X_OFFSET
            piece.puzzleBoardY = row * CELLHEIGHT + yOffset + CANVAS_Y_OFFSET

            with(piece)
                ctx.drawImage(img, sourceX, sourceY, srcImgCellWidth, srcImgCellHeight,
                              puzzleBoardX, puzzleBoardY, CELLWIDTH, CELLHEIGHT)
            
            col++
            if(col == length){
                col = 0
                row++
            }
        })
        console.log(col + " " + row)
        console.log(xOffset + " " + yOffset)
        drawEmptySpace(col * CELLWIDTH + xOffset + 5 + CANVAS_X_OFFSET, row * CELLHEIGHT + yOffset + CANVAS_Y_OFFSET, CELLWIDTH, CELLHEIGHT) // +5 to update offset
        console.log(piecesList)

        //TODO: add mouse click event and game logic
        canvas.addEventListener("click", event => {
            
        })
    }
}

function drawEmptySpace(x, y, w, h){
    const COLOR = 0
    ctx.fillStyle = "rgb(255, 255, 0)"
    ctx.fillRect(x, y, w, h)
}

ipcRenderer.send("genPuzzle", "puzzle generation ready")
ipcRenderer.on("puzzleArgs", (event, path, diff) => {
    console.log("Generating puzzle with args:\n" + path + '\n' + diff)
    generatePuzzle(path, diff)
})