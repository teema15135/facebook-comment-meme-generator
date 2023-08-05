const timeoutJobs = {}

function debounce(callback, tag, millis) {
    if (timeoutJobs[tag] != null) {
        clearTimeout(timeoutJobs[tag])
    }

    timeoutJobs[tag] = setTimeout(callback, millis)
}

function takeshot(canvasCallback) {
    let div = getMainDiv()
    html2canvas(div).then(canvasCallback)
}

function takeshotSaveImage() {
    takeshot((canvas) => {
        let link = document.createElement('a')
        link.href = canvas.toDataURL("image/png")
        link.download = "" + Date.now() + ".png"
        link.click()
    })
}

function takeshotNewTab() {
    takeshot((canvas) => {
        window.open(canvas.toDataURL("image/png"))
    })
}

function renderOuputImage() {
    takeshot((canvas) => {
        getOutputRenderElement().src = canvas.toDataURL("image/png")
    })
}

function update() {
    let displayNameText = getDisplayNameInputElement().value
    let commentText = getCommentTextInputElement().value

    if (isTextBlank(displayNameText)) displayNameText = "Somchaiyz"
    if (isTextBlank(commentText)) commentText = "เพ้อเจ้อ"

    let displayNameSpan = getDisplayNameElement()
    let commentTextSpan = getCommentTextElement()

    displayNameSpan.innerText = displayNameText
    commentTextSpan.innerText = commentText
}

function registerInputListener() {
    getCommentTextInputElement()
        .addEventListener("input", updateAndRenderWithDebounce)
    getDisplayNameInputElement()
        .addEventListener("input", updateAndRenderWithDebounce)
    getProfilePictureInputElement()
        .addEventListener("change", (event) => {
            const reader = new FileReader()
            reader.readAsDataURL(event.target.files[0])
            reader.onload = function () {
                updateProfilePicture(reader.result)
                updateAndRenderWithDebounce()
            }
        })
}

function updateProfilePicture(content) {
    getProfilePictureElement().src = content
}

function updateAndRender() {
    update()
    renderOuputImage()
}

function updateAndRenderWithDebounce() {
    update()
    debounce(() => {
        renderOuputImage()
    }, 'render-image', 1000)
}

function isTextBlank(text) {
    return text.trim().length == 0
}

function getOutputRenderElement() {
    return document.getElementById('output-render')
}

function getMainDiv() {
    return document.getElementById('main')
}

function getProfilePictureInputElement() {
    return document.getElementById('picture-input')
}

function getProfilePictureElement() {
    return document.getElementById('profile-picture')
}

function getDisplayNameInputElement() {
    return document.getElementById('input-display-name')
}

function getDisplayNameElement() {
    return document.getElementById('display-name')
}

function getCommentTextInputElement() {
    return document.getElementById('input-comment-text')
}

function getCommentTextElement() {
    return document.getElementById('comment-text')
}