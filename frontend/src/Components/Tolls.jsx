import React from 'react'

export const Tolls = ({setColorState , colorState , canvas , clearAll}) => {
    const clearAllhandler = ()=>{
      clearAll()
      }
      const addText = ()=>{
        const text = new fabric.Textbox('text!', {
          left: 100,
          top: 100,
          fill: 'black',
          fontSize: 30,
          fontFamily: 'Arial',
          editable: true ,// Enable text editing
          selectable: true
        });
        console.log(canvas.getObjects());
        // Add the text object to the canvas
        canvas.add(text);
        canvas.setActiveObject(text)
      }
      const addFigure = ()=>{
        const rect = new fabric.Rect({
          width: 200,
          height: 200,
          selectable: true ,
          fill: 'transparent' ,
          stroke:"black",
          strokeWidth:2
        });
        canvas.add(rect);
        canvas.setActiveObject(rect)    
        console.log(canvas.getObjects());
      }
  return (
    <div>
    <button onClick={() => {
        setColorState('black');
      }} style={{outline: colorState == 'black'?'4px auto -webkit-focus-ring-color':'none'}}>
        Pen
      </button>
      <button onClick={() => {
        setColorState("white");
      }}
      style={{outline: colorState == 'white'?'4px auto -webkit-focus-ring-color':'none'}}>
        Eraser
      </button>
      <button onClick={clearAllhandler}
      >
        Clear All
      </button>
      <button onClick={addText}>add text</button>
      <button onClick={addFigure}>add figure</button>

    </div>
  )
}
