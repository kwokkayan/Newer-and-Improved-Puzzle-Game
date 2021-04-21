var item_count = 0
exports.load = (paths) => {
    var container = document.getElementById("img_list_container")
    //Event functions
    let pos = {
        top: 0,
        left: 0,
        x: 0,
        y: 0
    }
    function mDown(e){
        pos = {
            left: container.scrollLeft,
            top: container.scrollTop,
            x: e.clientX,
            y: e.clientY
        }
        container.style.cursor = "grabbing"

        document.addEventListener("mousemove", mMove)
        document.addEventListener("mouseup", mUp)
    }
    function mMove(e){
        let dx = e.clientX - pos.x
        let dy = e.clientY - pos.y

        container.scrollTop = pos.top + dx
        container.scrollLeft = pos.left + dy
    }
    function mUp(e){
        container.style.cursor = "grab"
        
        document.removeEventListener("mousemove", mMove)
        document.removeEventListener("mouseUp", mUp)

        canvasList = document.getElementsByClassName("list_canvas")
        console.log(canvasList)
        //canvasList.forEach(canvas => {
            //getBoundingClientRect()
        //})
        for(var i = 0; i < canvasList.length; i++){
            let boundingRect = canvasList.item(i).getBoundingClientRect()
            if (e.clientX <= boundingRect.x + boundingRect.width && e.clientX >= boundingRect.x) {
                if (e.clientY <= boundingRect.y + boundingRect.height && e.clientY >= boundingRect.y) {
                    console.log(paths[i])
                    ipcRenderer.send("genPuzzle", "ok", paths[i])
                }
            }
        }
    }
    //Event functions End
    container.addEventListener("mousedown", mDown)

    paths.forEach(path => { //generate list
        var item_container = document.createElement("div") //create item container
        item_container.id = "item_" + item_count

        //var img_info = document.createElement("div") //create description text for image
        //img_info.className = "list_img_info"

        var img_canvas = document.createElement("canvas") //create icon canvas
        var ctx = img_canvas.getContext("2d")
        img_canvas.className = "list_canvas"

        item_container.appendChild(img_canvas)
        //item_container.appendChild(img_info)
        container.appendChild(item_container)

        var img = new Image()
        img.src = path
        img.onload = () => {
            //TODO: convert img to smaller
            img_canvas.width = 256
            img_canvas.height = 256

            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img_canvas.width, img_canvas.height)
            //img_info.innerHTML = path
            
        }
        //TODO: make generate button and event 
        item_count++
    });
    console.log(paths)
}