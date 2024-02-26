import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Tolls } from './Tolls';
import axios from 'axios';


const Canvas = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [colorState, setColorState] = useState('black');
  const [message , setMessage]= useState('bob')
  const [pathState, setPath] = useState([])

  let path = []


  const ws = new WebSocket('ws://localhost:3000')
  ws.onopen = ()=>  console.log('ONLINE')
  ws.onclose = ()=>  console.log('DISCONNECTED')
  





  useEffect(() => {
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth * 0.8,
      height: window.innerHeight * 0.8,
      selection: false,
      backgroundColor: 'white' ,
      fill: 'white'
    });
    setCanvas(newCanvas);
    const text = new fabric.Textbox('Clicktoeditme!', {
      left: 100,
      top: 100,
      fill: 'black',
      fontSize: 30,
      fontFamily: 'Arial',
      editable: true ,// Enable text editing
      selectable: true,
    });
    newCanvas.add(text);

    ws.onmessage = (res)=>{
      console.log(res.data);
      if(res.data =='clear'){
        newCanvas.remove.apply(newCanvas, newCanvas.getObjects().concat())
      }else{
        drawPath(JSON.parse(res.data).line,JSON.parse(res.data).color  , newCanvas)
        drawPath(JSON.parse(res.data).eraser,'white'  , newCanvas)
      }

    }
    const getTable = async()=>{
      let res = await axios.get('http://localhost:8000/65db8ab758d8608248f94bb4')
      if(res.status == 200){
        setTimeout(()=>drawPath(res.data.line , "black" ,newCanvas))
      }
    }
    getTable()
  
    const drawPath = (path, color, canvas) => {
      path.forEach(pathLine=>{
        for(let i = 0 ; i<pathLine.length-1;i++){
          setTimeout(()=>{
          let radius = color !== "white" ? 15 : 40;

          let lastX = pathLine[i][0]
          let lastY = pathLine[i][1]

          let newX = pathLine[i+1][0]
          let newY = pathLine[i+1][1]
          const line = new fabric.Line([lastX - radius / 2, lastY - radius / 2,newX - radius / 2, newY - radius / 2], {
            strokeWidth: radius,
            stroke: color,
            strokeDashOffset: 10,
            strokeLineCap: 'round',
            strokeLineJoin: 'round',
            selectable: false,
            hoverCursor: "default"
          });

          newCanvas.add(line)
        },10+10*i)
        }

      })
    };
    
 



    return () => {
      newCanvas.dispose(); // Dispose Fabric.js canvas on unmount
    };
  }, []);


  useEffect(() => {
    if (!canvas) return;
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const handleMouseDown = (options) => {
      if ((options.target && canvas.getActiveObject(options.target))) {
        isDrawing= false
      }else{
        isDrawing = true;
        const pointer = canvas.getPointer(options.e);
        lastX = pointer.x;
        lastY = pointer.y;
      }

    };
    
    const handleMouseMove = (options) => {
      if (!isDrawing) return;
      if ((options.target && canvas.getActiveObject(options.target))) {
        options.target.enterEditing(); // Enter editing mode
      }else{
        let radius = colorState !== "white" ? 15 : 40;
        const pointer = canvas.getPointer(options.e);
        const line = new fabric.Line([lastX - radius / 2, lastY - radius / 2, pointer.x - radius / 2, pointer.y - radius / 2], {
          strokeWidth: radius,
          stroke: colorState,
          strokeDashOffset: 10,
          strokeLineCap: 'round',
          strokeLineJoin: 'round',
          selectable: false,
          hoverCursor: "default"
        });
        path.push([pointer.x,pointer.y])
        canvas.add(line);
        lastX = pointer.x;
        lastY = pointer.y;

        
        canvas.renderAll();
      }
    };

    const handleMouseUp = () => {
      isDrawing = false;

      ws.send(JSON.stringify(
      {id:'65db8ab758d8608248f94bb4',
      data:{
      line:[...path],
      eraser:[],
      squares:[],
      texts:[]
      },
      color:colorState,
      action:'add'
      }))
     
      setPath([])
      path=[]
    };

  

    

    const exitEditing = () => {
      const activeObject = canvas.current.getActiveObject();
      if (activeObject && activeObject.isEditing) {
        activeObject.exitEditing(); // Exit editing mode
        canvas.current.discardActiveObject(); // Deselect text object
        canvas.current.renderAll(); // Render canvas
      }
    };
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      exitEditing(); // Exit editing mode when Escape key is pressed
    }
  };
  const handleScaling = (options)=>{
    const obj = options.target;
    const scaleFactor = obj.scaleX; // Get the scale factor
    
    // Adjust the stroke width based on the scale factor
    const originalStrokeWidth = 2; // Original stroke width
    const newStrokeWidth = originalStrokeWidth / scaleFactor;
    obj.set('strokeWidth', newStrokeWidth);
  }
  

    document.addEventListener('keydown', handleKeyDown);
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
    canvas.on('object:scaling',handleScaling);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [canvas, colorState, pathState]);

  const clearAll = (path)=>{
    ws.send(JSON.stringify({
      id:'65db8ab758d8608248f94bb4',
      action:'clear'
    }))
   
    setPath([])
    path=[]

  }


  return (
    <div>
      <canvas ref={canvasRef} />
    <Tolls ws = {ws} canvas ={canvas} clearAll={clearAll} setColorState={setColorState} colorState={colorState}></Tolls>
    <button >{'vkv'}</button>
    
    </div>
  );
};

export default Canvas;
