function takeshot(canvasCallback) {
    let div = getMainDiv()
    html2canvas(div).then(canvasCallback)
}

function takeshotSaveImage() {
    takeshot((canvas) => {
        let dataUrl = canvas.toDataURL("image/png")
        let link = document.createElement('a')
        link.href = dataUrl
        link.download = "" + Date.now() + ".png"
        link.click()
    })
}

function takeshotNewTab() {
    takeshot((canvas) => {
        let dataUrl = canvas.toDataURL("image/png")
        window.open(dataUrl)
    })
}

function updateText() {
    let input = getTextInputElement().value
    if (input.trim().length == 0) input = "เพ้อเจ้อ"
    let commentTextSpan = document.getElementById('comment-text')
    commentTextSpan.innerText = input
}

function registerTextInputListener() {
    let textInputElement = getTextInputElement()
    textInputElement
        .addEventListener("input", (event) => {
            updateText()
        })
}

function getMainDiv() {
    return document.getElementById('main')
}

function getTextInputElement() {
    return document.getElementById('input-comment-text')
}