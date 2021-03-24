//import logo from './logo.svg';
import React,{useRef} from "react";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import './App.css';
import { drawMesh } from "./util";

function App() {
  //setup References
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  
  
  //Load Face mesh
  const runFacemesh=async () =>{
    const net =await facemesh.load({
      inputResolution:{width:640 ,height :480 },scale :0.8,
    });

    setInterval(() =>{
      detect(net)    //calling Detect function after every 100ms
    },100 )
  };

  //Detect Function
  const detect =async (net) =>
  {
    if(
      typeof webcamRef.current !=="undefined" &&
      webcamRef.current !==null &&
      webcamRef.current.video.readyState===4
    ){
      //getting video properties
      const video=webcamRef.current.video;  //Getting Video From webcam
      const videoWidth=webcamRef.current.video.videoWidth; //getting v width
      const videoHeight=webcamRef.current.video.videoHeight; //getting video Heigth

      //setting  video dimensions
      webcamRef.current.video.width=videoWidth;
      webcamRef.current.video.height=videoHeight;
    
      
      //setting canvas H&W
      canvasRef.current.width=videoWidth;
      canvasRef.current.height=videoHeight;

      //Making Detection
      const face =await net.estimateFaces(video);
      console.log(face);

      //Get canvas Context for Drawing
      const ctx=canvasRef.current.getContext("2d");
      drawMesh(face, ctx)
    
    
    }
  }

  runFacemesh();
  
  return (
    <div className="App">
      <Webcam ref ={webcamRef} style={
        {
          position:"absolute",
          marginLeft:"auto",
          marginRight : "auto",
          left : 0,
          right : 0,
          textAlign:"center",
          zIndex:9,
          width : 640,
          height: 480,
        }
      } />
      <canvas ref ={canvasRef}
      style={
        {
          position:"absolute",
          marginLeft:"auto",
          marginRight : "auto",
          left : 0,
          right : 0,
          textAlign:"center",
          zIndex:9,
          width : 640,
          height: 480,
        } }/>
    </div>
  );
}

export default App;
