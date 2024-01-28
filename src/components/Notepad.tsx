import { useEffect, useState } from 'react'
import { FcDocument } from 'react-icons/fc';

interface IProps {
  uid: string,
  title: string,
  width: number,
  height: number,
  closeWindow: (uid: string)=>void,
  z: number,
  bringToTop: (uid: string)=>void,
  newNotepad: ()=>void
}

export default function Notepad({uid, title, width, height, closeWindow, z, bringToTop, newNotepad}: IProps) {
  const [top, setTop] = useState<number>(window.innerHeight / 2 - height/2);
  const [left, setLeft] = useState<number>(window.innerWidth / 2 - width/2);
  const [dragging, setDragging] = useState<boolean>(false);
  const [xOffset, setXOffset] = useState<number>(0);
  const [text, setText] = useState<string>('')

  useEffect(() => {
    if (dragging == true) {
      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', barClickUp);
    }
  
    return () => {
      window.removeEventListener('mousemove', move)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging])
  
  const move = (e: MouseEvent) => {
    const x = window.innerWidth;
    const y = window.innerHeight;
    const element = document.getElementById(uid);
    const nav = document.getElementById('nav');
    const navHeight = nav ? nav.offsetHeight : 0;
    const width = element ? element.offsetWidth : 0;
    const height = element ? element.offsetHeight : 0;
    if (e.clientX - xOffset < 0) {
      setLeft(0)
    } else if (e.clientX + (width - xOffset) > x) {
      setLeft(x - width)
    } else {
      setLeft(e.clientX - xOffset)
    }

    if (e.clientY - 16 < 0) {
      setTop(0)
    } else if (e.clientY + (height-16+navHeight) > y) {
      setTop(y - height - navHeight)
    } else {
      setTop(e.clientY - 16)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const barClickDown = (e: any) => {
    setXOffset(Math.abs(e.target?.getClientRects()[0].x - e.clientX))
    bringToTop(uid);
    setDragging(true)
  }

  const barClickUp = () => {
    setDragging(false)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onTextChange = (e: any) => {
    setText(e.target.value);
  }

  const resetText = () => {
    setText('');
  }

  const saveTextAsFile = () => {
    const textFileAsBlob = new Blob([ text ], {type: 'text/plain'});
    const fileNameToSaveAs = 'notepad.txt';
    const anchor = document.createElement('a');
    anchor.download = fileNameToSaveAs;
    anchor.href = window.webkitURL.createObjectURL(textFileAsBlob);
    anchor.target = '_blank';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  return (
    <div id={uid} className={`window-container ${dragging ? 'unselectable' : ''}`} unselectable={dragging ? 'on' : 'off'} style={{top: top, left: left, zIndex: z.toString(), width: `${width}px`, height: `${height}px`}}>
      <div onMouseDown={barClickDown} className='bar'>
        <div className='bar-icon'><FcDocument/></div>
        <h2 className='bar-title'>{title}</h2>
      </div>
      <div className='bar-buttons'>
        <button className='bar-close' onClick={() => closeWindow(uid)}>X</button>
      </div>
      <div className='window-content'>
        <div className='notepad-bar'>
          <div className="notepad-dropdown">
            <button className="notepad-dropdown-btn">File</button>
            <div className="notepad-dropdown-content">
              <button onClick={resetText}>Clear</button>
              <button onClick={newNotepad}>New Window</button>
              <button onClick={saveTextAsFile}>Download Text File</button>
            </div>
          </div>
        </div>
        <textarea value={text} onChange={onTextChange} className='notepad'>
        </textarea>
      </div>
    </div>
  )
}
