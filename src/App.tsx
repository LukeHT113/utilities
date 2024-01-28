import { useState } from 'react';
import './App.css'
import Nav from './components/Nav';
import TempCon from './components/TempCon';
import Calculator from './components/Calculator';
import Notepad from './components/Notepad';
import background from './assets/bliss.webp'
import { v4 as uuid } from "uuid";

type Window = {
  uid: string,
  title: string,
  z: number
}

function App() {

  const [windows, setWindows] = useState<Window[]>([]);

  function onAddWindow(uid: string, title: string) {
    let highestWindow = 0;
    windows.map((window) => {
      if (window.z > highestWindow) {
        highestWindow = window.z + 1;
      }
    })
    setWindows(prev => [...prev, {uid: uid, title: title ? title : '', z: highestWindow}])
  }

  function addNewNotepad() {
    const uid = uuid();
    onAddWindow(uid, 'Notepad');
  }

  function onCloseWindow(uid: string) {
    const element = document.getElementById(uid)
    if (element) {
      element.style.animationName = 'close';
    }
    setTimeout(() => {
      setWindows(prev => prev.filter((window) => {
        if (window.uid !== uid) {
          return window
        } 
      }))
    }, 220)
  }

  function bringToTop(uid: string) {
    setWindows(prev => {
      let highestWindow = 0;
      prev.map((window) => {
        if (window.z >= highestWindow) {
          highestWindow = window.z + 1;
        }
      })
      return prev.filter((window) => {
        if (window.uid != uid) {
          return window
        } else {
          window.z = highestWindow;
          return window
        }
      })
    })
  }

  return (
    <>
      <section className='background'>
        <img src={background} className='background-img unselectable' unselectable='on'></img>
        {windows.map((window) => {
          if (window.title == 'Temperature Converter') {
            return <TempCon key={window.uid} uid={window.uid} title={window.title} closeWindow={onCloseWindow} z={window.z} width={400} height={340} bringToTop={bringToTop}></TempCon>
          } else if (window.title == 'Calculator') {
            return <Calculator key={window.uid} uid={window.uid} title={window.title} closeWindow={onCloseWindow} z={window.z} width={300} height={436} bringToTop={bringToTop}></Calculator>
          } else if (window.title == 'Notepad') {
            return <Notepad key={window.uid} uid={window.uid} title={window.title} closeWindow={onCloseWindow} z={window.z} width={500} height={500} bringToTop={bringToTop} newNotepad={addNewNotepad}></Notepad>
          }
        })}
      </section>
      <Nav addWindow={onAddWindow} activeWindows={windows}></Nav>
    </>
  )
}

export default App
