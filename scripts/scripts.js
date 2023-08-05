const timeoutJobs = {}
const STORAGE_KEY = "facebook_comment_meme_generator"
const DEFAULT_NAME = "Adam Smith"
const DEFAULT_COMMENT = "Yes"
const DEFAULT_IMG = "images/profile_picture.jpg"

class StorageData {
    displayName
    comment
    img

    constructor(displayName, comment, img) {
        this.displayName = displayName
        this.comment = comment
        this.img = img
    }

    static fromJson(json) {
        if (json == null)
            return StorageData.DEFAULT
        return new StorageData(
            json.displayName || DEFAULT_NAME,
            json.comment || DEFAULT_COMMENT,
            json.img || DEFAULT_IMG
        )
    }
    
    static DEFAULT = new StorageData(
        DEFAULT_NAME,
        DEFAULT_COMMENT,
        DEFAULT_IMG
    )
}

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

function removeProfilePicture() {
    renderProfilePicture(DEFAULT_IMG)
    updateMainAndRenderOutputWithDebounce()
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

function renderProfilePicture(content) {
    getProfilePictureElement().src = content
}

function updateMainText() {
    let displayNameText = getDisplayNameInputElement().value
    let commentText = getCommentTextInputElement().value

    if (isTextBlank(displayNameText)) displayNameText = DEFAULT_NAME
    if (isTextBlank(commentText)) commentText = DEFAULT_COMMENT

    let displayNameSpan = getDisplayNameElement()
    let commentTextSpan = getCommentTextElement()

    displayNameSpan.innerText = displayNameText
    commentTextSpan.innerText = commentText
}

function registerInputListener() {
    getCommentTextInputElement()
        .addEventListener("input", updateMainAndRenderOutputWithDebounce)
    getDisplayNameInputElement()
        .addEventListener("input", updateMainAndRenderOutputWithDebounce)
    getProfilePictureInputElement()
        .addEventListener("change", (event) => {
            const reader = new FileReader()
            reader.readAsDataURL(event.target.files[0])
            reader.onload = function () {
                renderProfilePicture(reader.result)
                updateMainAndRenderOutputWithDebounce()
            }
        })
}

function updateMainAndRenderOutputWithDebounce() {
    displayOutputLoading()
    updateMainText()
    debounce(() => {
        renderOuputImage()
        displayOutputRendered()
    }, 'render-image', 1000)

    storeData()
}

function displayOutputRendered() {
    getOutputLoadingElement().style = "display: none;"
    getOutputRenderElement().style = ""
}

function displayOutputLoading() {
    getOutputLoadingElement().style = ""
    getOutputRenderElement().style = "display: none;"
}

function initial() {
    loadData()
    registerInputListener()
    updateMainAndRenderOutputWithDebounce()
}

function storeData() {
    let data = new StorageData(
        getDisplayNameInputElement().value,
        getCommentTextInputElement().value,
        getProfilePictureElement().src
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function loadData() {
    let data = StorageData.fromJson(JSON.parse(localStorage.getItem(STORAGE_KEY)))
    getDisplayNameInputElement().value = data.displayName
    getCommentTextInputElement().value = data.comment
    if (data.img != null) getProfilePictureElement().src = data.img
}

function isTextBlank(text) {
    return text.trim().length == 0
}

function getOutputRenderElement() {
    return document.getElementById('output-render')
}

function getOutputLoadingElement() {
    return document.getElementById('output-loading')
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