const socket = io();

const myface = document.getElementById("myface");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");

const call = document.getElementById("call");

call.hidden = true;

let myStrem;
let muted = false;
let cameraOff = false;
let roomName;
let mypeerConnection;

async function getCameras(){
    try{
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === "videoinput");
        const currentCamera = myStrem.getVideoTracks() [0];
        cameras.forEach(camera => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if(currentCamera.label === camera.label) {
                option.selected = true;
            };
            camerasSelect.appendChild(option);
        })
    }catch(e){
        console.log(e)
    }
}

async function getMedia(deviceId){
const initialConstrains = {
    audio : true,
    video : { facingMode: "user" },
};
const cameraConstraints = {
    audio: true,
    video: { deviceId: { exact : deviceId } },
};
try {
    myStrem =await navigator.mediaDevices.getUserMedia(
        deviceId? cameraConstraints : initialConstrains
    );
        myface.srcObject = myStrem;
        if (!deviceId) {
            await getCameras();
        }
}   catch (e) {
    console.log(e);
}
}


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

async function handleCameraChange(){
    await getMedia(camerasSelect.value);
}

muteBtn.addEventListener("click",hadleMuteClick);
cameraBtn.addEventListener("click",hadleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);

// WelcomeFrom ( 방 선택 )

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

async function startMedia(){
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    makeConnection();
}

function handleWelcomeSubmit(event){
    event.preventDefault();
    const input = welcomeForm.querySelector("input");
    socket.emit("join_room",input.value,startMedia);
    roomName = input.value;
    input.value = "";
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);



// Sockt Code

socket.on("welcome", async () => {
    const offer = await mypeerConnection.createOffer();
    mypeerConnection.setLocalDescription(offer);
    console.log("sent the offer");
    socket.emit("offer",offer,roomName);
});

socket.on ("offer", (offer) => {
    console.log(offer);
});

// RTC Code

function makeConnection(){
    mypeerConnection = new RTCPeerConnection();
    myStrem
        .getTracks()
        .forEach(track => mypeerConnection.addTrack(track,myStrem)) ;
}