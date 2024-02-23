import React from 'react'

export const Tolls = ({setColorState , colorState , canvas}) => {
    const clearAll = ()=>{
        canvas.clear()
        const bgRect = new fabric.Rect({
          width: canvas.width,
          height: canvas.height,
          fill: 'white',
          selectable: false // Make it unselectable
        });
        canvas.add(bgRect);
    
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
    
        // Add the text object to the canvas
        canvas.add(text);
        canvas.setActiveObject(text)
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
      <button onClick={() => {
        clearAll()
      }}
      >
        Clear All
      </button>
      <button onClick={addText}>add text</button>

    </div>
  )
}
