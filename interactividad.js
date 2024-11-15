// Copyright 2023 The MediaPipe Authors.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//      http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import {
    GestureRecognizer,
    FilesetResolver,
    DrawingUtils
  } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
  
  
  let gestureRecognizer = GestureRecognizer;
  let runningMode = "IMAGE";
  let enableWebcamButton = HTMLButtonElement;
  let webcamRunning = Boolean = false;
  const videoHeight = "360px";
  const videoWidth = "480px";
  
  // Before we can use HandLandmarker class we must wait for it to finish
  // loading. Machine Learning models can be large and take a moment to
  // get everything needed to run.
  const createGestureRecognizer = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );
    gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
        delegate: "GPU"
      },
      runningMode: runningMode
    });
    
  };
  createGestureRecognizer();
  
  /********************************************************************
  // Demo 1: Detect hand gestures in images
  ***
  
  /********************************************************************
  // Demo 2: Continuously grab image from webcam stream and detect it.
  ********************************************************************/
  
  const video = document.getElementById("webcam");
  const canvasElement = document.getElementById("output_canvas");
  const canvasCtx = canvasElement.getContext("2d");
  const gestureOutput = document.getElementById("gesture_output");
  
  // Check if webcam access is supported.
  function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
  
  // If webcam supported, add event listener to button for when user
  // wants to activate it.
  if (hasGetUserMedia()) {
    enableWebcamButton = document.getElementById("webcamButton");
    enableWebcamButton.addEventListener("click", enableCam);
  } else {
    console.warn("getUserMedia() is not supported by your browser");
  }
  
  // Enable the live webcam view and start detection.
  function enableCam(event) {
    if (!gestureRecognizer) {
      alert("Please wait for gestureRecognizer to load");
      return;
    }
  
    if (webcamRunning === true) {
      webcamRunning = false;
      enableWebcamButton.innerText = "ENABLE PREDICTIONS";
    } else {
      webcamRunning = true;
      enableWebcamButton.innerText = "DISABLE PREDICTIONS";
    }
  
    // getUsermedia parameters.
    const constraints = {
      video: true
    };
  
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
      video.srcObject = stream;
      video.addEventListener("loadeddata", predictWebcam);
    });
  }
  
  let lastVideoTime = -1;
  let results = undefined;
  const states = Object.freeze({
    Nada: 0,
    Filtro: 1,
    Zoom: 2,
    Mouse: 3
});
  let contador = parseFloat(document.getElementById("yearRange").value)
  let mapZoom = 2;
  let actualState = 0;
  let yPosition = 10;
  let xPosition = 0;
  async function predictWebcam() {
    ShowActionSelected(actualState)
    const webcamElement = document.getElementById("webcam");
    // Now let's start detecting the stream.
    if (runningMode === "IMAGE") {
      runningMode = "VIDEO";
      await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
    }
    let nowInMs = Date.now();
    if (video.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;
      results = gestureRecognizer.recognizeForVideo(video, nowInMs);
    }
  
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    const drawingUtils = new DrawingUtils(canvasCtx);
  
    canvasElement.style.height = videoHeight;
    webcamElement.style.height = videoHeight;
    canvasElement.style.width = videoWidth;
    webcamElement.style.width = videoWidth;
  
    if (results.landmarks) {
      for (const landmarks of results.landmarks) {
        drawingUtils.drawConnectors(
          landmarks,
          GestureRecognizer.HAND_CONNECTIONS,
          {
            color: "#00FF00",
            lineWidth: 5
          }
        );
        drawingUtils.drawLandmarks(landmarks, {
          color: "#FF0000",
          lineWidth: 2
        });
      }
    }
    canvasCtx.restore();
    if (results.gestures.length > 0) {
      gestureOutput.style.display = "block";
      gestureOutput.style.width = videoWidth;
      const categoryName = results.gestures[0][0].categoryName;
      const categoryScore = parseFloat(
        results.gestures[0][0].score * 100
      ).toFixed(2);
      const handedness = results.handednesses[0][0].displayName;
      gestureOutput.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore} %\n `;
      if (actualState == 0) {
        AsignState(categoryName)
      
      }
      if (actualState != 0 && categoryName == "ILoveYou" ) {
        actualState = states.Nada
      }
      

      if ( actualState == states.Filtro ) {

        FiltrarInteractivo(categoryName);
        document.getElementById("accion").innerText = Math.floor(contador).toString()

      }
      if (actualState == states.Zoom) {
        //document.getElementById("accion") = document.getElementById("map")
        ExploreMap(categoryName);
      }

    } else {
      gestureOutput.style.display = "none";
    }

    // Call this function again to keep predicting when the browser is ready.
    if (webcamRunning === true) {
      window.requestAnimationFrame(predictWebcam);
    }
  }
  

async function FiltrarInteractivo(categoryName) {
  if (categoryName == "Victory") {
    contador += 0.5;
    
    
  }
  if (categoryName == "Thumb_Up") {
    contador += 0.05;
  }

  if (categoryName == "Closed_Fist") {
    contador -= 0.5;

  }

  if (categoryName == "Thumb_Down") {
    contador -= 0.05;
    
  }
  if (contador > 2018) {
    contador = 2018
  }
  if (contador < 1960) {
    contador = 1960
  }
  document.getElementById("yearRange").value = Math.floor(contador).toString();
  const actualizarMapa = new Event('input');
  document.getElementById("yearRange").dispatchEvent(actualizarMapa)
  
  
}

async function AsignState(categoryName) {
  if (categoryName == "Pointing_Up") {
    //filtro
    actualState = states.Filtro
  }

  if (categoryName == "Closed_Fist") {
    //zoom
    actualState = states.Zoom
  }

  if (categoryName == "Victory") {
    //mouse
    actualState = states.Mouse
  }
  if (categoryName == "ILoveYou") {
    //nada
    actualState = states.Nada
  }
}

async function ShowActionSelected(state) {
  const base = "Acciones escogida: "
  

  if (state == states.Filtro) {
    document.getElementById("accion").innerText = base + "Filtrar por año"
  }

  else if (state == states.Zoom) {
    document.getElementById("accion").innerText = base + "Explorando mapa"

  }

  else if (state == states.Mouse) {
    document.getElementById("accion").innerText = base + "Mover mouse"

  }

  else {
    
    document.getElementById("accion").innerText = "Haz un gesto para seleccionar acción"
    
  }

}



async function ExploreMap(categoryName) {

  if (categoryName == "Closed_Fist" || categoryName == "Victory"){

    if (categoryName == "Victory") { //ZOOM IN
      mapZoom += 0.025;
    }
    if (categoryName == "Closed_Fist") { //ZOOM OUT
      mapZoom -= 0.025;
    }
    

    if (mapZoom > 10) {
      mapZoom = 10
    }
    if (mapZoom < 2) {
      mapZoom = 2
    }

    map.setZoom(Math.floor(mapZoom))
  }

  if (categoryName == "Thumb_Up" || categoryName == "Thumb_Down") {

    if (categoryName == "Thumb_Up") {
      yPosition += 0.5
    }
  
  
    if (categoryName == "Thumb_Down") {
      yPosition -= 0.5
      
    }
    

    map.setView([Math.floor(yPosition), Math.floor(xPosition)])
  }

  
}

