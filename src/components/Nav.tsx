import { v4 as uuid } from "uuid";
import { FcCalculator, FcDocument } from "react-icons/fc";
import { TbTemperatureCelsius } from "react-icons/tb";
import startLogo from "../assets/windows-logo.webp"
import { useEffect, useState } from "react";

type Window = {
  uid: string,
  title: string
}

interface IProps {
  addWindow: (uid: string, title: string)=>void,
  activeWindows: Window[],
}

export default function Nav({addWindow}: IProps) {

  const [date, setDate] = useState<Date>(new Date());
  const uid = uuid();

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date())
    }, 1000);
  
    return () => {
      clearInterval(timer);
    }
  }, [])
  

  return (
    <nav className="nav" id="nav">
      <div className="row">
        <div className="nav-start">
          <img className="nav-logo" src={startLogo}></img>
          <p>start</p>
        </div>
        <div className="nav-btns">
          <button className="nav-btn" title="Calculator" onClick={() => addWindow(uid, 'Calculator')}><FcCalculator/></button>
          <button className="nav-btn" title="Temperature Converter" onClick={() => addWindow(uid, 'Temperature Converter')}><TbTemperatureCelsius/></button>
          <button className="nav-btn" title="Notepad" onClick={() => addWindow(uid, 'Notepad')}><FcDocument/></button>
        </div>
      </div>
      <div className="nav-widget">
        <p className="nav-time">{date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:{date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()} {date.getHours() < 12 ? 'AM' : 'PM'}</p>
      </div>
    </nav>
  )
}
