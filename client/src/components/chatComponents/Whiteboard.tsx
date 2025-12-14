import React, { useState } from 'react'
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";


function Whiteboard() {

  return (
    <div className='w-full h-[729px]'>
        <Excalidraw />
    </div>
  )
}

export default Whiteboard
