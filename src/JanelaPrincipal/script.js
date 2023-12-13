/* const {ipcRenderer} = require('electron');
 */
document.addEventListener('DOMContentLoaded', ()=>{

    const tempo = document.querySelector("#tempo")
    const gravar = document.querySelector("#gravar")
    const microfone = document.querySelector("#tipoMic")

    let chunks = [];
    let isRecording = false;
    let microfoneSelecionado = null;
    let mediaRecorder = null;
    let tempoInicio = null;

    navigator.mediaDevices.enumerateDevices().then(devices =>{
        devices.forEach(device => {
            if(device.kind === "audioinput"){
                if(!microfoneSelecionado){
                    microfoneSelecionado = device.deviceId
                }
                let option = document.createElement("option")
                option.value = device.deviceId;
                option.text = device.label;

                microfone.appendChild(option)
            }
        })
    })
    
    microfone.addEventListener('change', (event)=>{
        microfoneSelecionado = event.target.value
    })

    gravar.addEventListener('click', ()=>{
        gravando(!isRecording)
        handleRecord(isRecording)
        isRecording = !isRecording
    })

    function handleRecord(recording){
        if(recording){
            mediaRecorder.stop()
        }else{
            navigator.mediaDevices.getUserMedia( {audio: { deviceId: microfoneSelecionado}, video: false}).then(stream=>{
                mediaRecorder = new MediaRecorder(stream)
                mediaRecorder.start()
                tempoInicio = Date.now()
                updateDisplay()
                mediaRecorder.ondataavailable = (event) =>{
                    chunks.push(event.data)
                }
                mediaRecorder.onstop = () =>{
                    saveData()
                }
            })
        }
    }

    function updateDisplay(){
        tempo.innerHTML = duracaoDoTempo(Date.now() - tempoInicio)
        if(isRecording){
            window.requestAnimationFrame(updateDisplay)
        }
    }

    function duracaoDoTempo(duration){
        let mili = parseInt((duration % 1000)/100);
        let seconds = Math.floor((duration/1000)%60)
        let minutes = Math.floor((duration/1000/60)%60)
        let hours = Math.floor((duration/1000/60/60))

        seconds = seconds < 10?"0" + seconds : seconds
        minutes = minutes < 10?"0" + minutes : minutes
        hours = hours < 10?"0" + hours : hours

        return `${hours}:${minutes}:${seconds}:${mili}`
    }

    function saveData(){
        const blob = new Blob(chunks, {"type": "audio/webm; codecs=opus"})
        chunks = [];

        blob.arrayBuffer().then(blobBuffer =>{
            const buffer = Buffer.from(blobBuffer)
           /*  ipcRenderer.send("save_buffer", buffer) */
        })
    }

    function gravando(recording){
        if(recording){
        let gravar = document.querySelector("#gravar");
        gravar.classList.add("gravando");
        
        let img = document.querySelector("#mic-icon");
        img.classList.add("hidden")
        }else{
            let gravar = document.querySelector("#gravar");
            gravar.classList.remove("gravando");
            
            let img = document.querySelector("#mic-icon");
            img.classList.remove("hidden")
        }
    }
})