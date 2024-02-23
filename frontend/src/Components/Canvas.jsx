import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Tolls } from './Tolls';

const Canvas = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [colorState, setColorState] = useState('black');

  useEffect(() => {
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth * 0.8,
      height: window.innerHeight * 0.8,
      selection: false,
      fill: 'white'
    });
    setCanvas(newCanvas);

    const bgRect = new fabric.Rect({
      width: newCanvas.width,
      height: newCanvas.height,
      fill: 'white',
      selectable: false // Make it unselectable
    });
    newCanvas.add(bgRect);
    const text = new fabric.Textbox('Clicktoeditme!', {
      left: 100,
      top: 100,
      fill: 'black',
      fontSize: 30,
      fontFamily: 'Arial',
      editable: true ,// Enable text editing
      selectable: true
    });

    // Add the text object to the canvas
    newCanvas.add(text);

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
      if (options.target && options.target.text) {
        isDrawing= false
      }else{
        isDrawing = true;
        const pointer = canvas.getPointer(options.e);
        lastX = pointer.x;
        lastY = pointer.y;
      }
      console.log(options);

    };

    const handleMouseMove = (options) => {
      if (!isDrawing) return;
      if (options.target && options.target.text) {
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
          selectable: false
        });
        canvas.add(line);
        lastX = pointer.x;
        lastY = pointer.y;
        canvas.renderAll();
      }

    };

    const handleMouseUp = () => {
      isDrawing = false;
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

    document.addEventListener('keydown', handleKeyDown);
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [canvas, colorState]);

  const clearAll = ()=>{
    const bgRect = new fabric.Rect({
      width: canvas.width,
      height: canvas.height,
      fill: 'white',
      selectable: false // Make it unselectable
    });
    canvas.add(bgRect);

  }
  const addText = ()=>{
    const text = new fabric.Textbox('Clicktoeditme!', {
      left: 100,
      top: 100,
      fill: 'black',
      fontSize: 30,
      fontFamily: 'Arial',
      editable: true ,// Enable text editing
      selectable: true
    });

    // Add the text object to the canvas
    canvas.add(text);

    text.enterEditing()
  }

  return (
    <div>
      <canvas ref={canvasRef} />
    <Tolls canvas ={canvas} clearAll={clearAll} setColorState={setColorState} colorState={colorState}></Tolls>
    </div>
  );
};

export default Canvas;
