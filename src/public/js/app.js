const socket = io();

const myface = document.getElementById("myface");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");


let myStrem;
let muted = false;
let cameraOff = false;

async function getCameras(){
    try{
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === "videoinput");
        cameras.forEach(camera => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            camerasSelect.appendChild(option);
        })
    }catch(e){
        console.log(e)
    }
}

async function getMedia(){
try {
    myStrem =await navigator.mediaDevices.getUserMedia({
            audio:true,
            video:true,
        });
        myface.srcObject = myStrem;
        await getCameras();
}catch (e) {
    console.log(e);
}
}

getMedia();

function hadleMuteClick(){
    myStrem.getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
    if(!muted){
        muteBtn.innerText = "Mic On"
        muted = true;
    }else{
        muteBtn.innerText = "Mic Off"
        muted = false;
    }
}
function hadleCameraClick(){
    myStrem.getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
    if(cameraOff){
        cameraBtn.innerText = "Camera Off"
        cameraOff = false;
    }else{
        cameraBtn.innerText = "Camera On"
        cameraOff = true;
    }
}


muteBtn.addEventListener("click",hadleMuteClick);
cameraBtn.addEventListener("click",hadleCameraClick);