import { useEffect, useState } from 'react'
import { GoArrowRight } from "react-icons/go";
import { TbTemperatureCelsius } from 'react-icons/tb';

interface IProps {
  uid: string,
  title: string,
  width: number,
  height: number,
  closeWindow: (uid: string)=>void,
  z: number,
  bringToTop: (uid: string)=>void
}

export default function TempCon({uid, title, width, height, closeWindow, z, bringToTop}: IProps) {

  const [tempInput, setTempInput] = useState<string>('');

  const [inputUnit, setInputUnit] = useState('C')
  const [outputUnit, setOutputUnit] = useState('F')

  const [top, setTop] = useState<number>(window.innerHeight / 2 - height/2);
  const [left, setLeft] = useState<number>(window.innerWidth / 2 - width/2);
  const [dragging, setDragging] = useState<boolean>(false);
  const [xOffset, setXOffset] = useState<number>(0);

  const onTempChange = (e: React.FormEvent<HTMLInputElement>) => {
    setTempInput(e.currentTarget.value);
  }

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
    setDragging(true)
    bringToTop(uid);
  }

  const barClickUp = () => {
    setDragging(false)
  }

  const getTempDisplyName = (shorthand: string) => {
    switch (shorthand) {
      case 'C':
        return 'Celsius (°C)';
      case 'F':
        return 'Fahrenheit (°F)';
      case 'K':
        return 'Kelvin (K)'
    }
  }

  const calculateOutput = () => {
    let input: number;
    if (isNaN(Number(tempInput)) || tempInput == '') {return ''}
    else {input = Number(tempInput)}
    switch (inputUnit) {
      case 'C':
        switch (outputUnit) {
          case 'F':
            return (input * 9/5) + 32;
          case 'K':
            return input + 273.15;
          default:
          return input;
        }
      case 'F':
        switch (outputUnit) {
          case 'C':
            return (input - 32) * 5/9;
          case 'K':
            return (input - 32) * 5/9 + 273.15;
          default:
            return input;
        }
      case 'K':
        switch (outputUnit) {
          case 'C':
            return input - 273.15;
          case 'F':
            return (input - 273.15) * 9/5 + 32;
          default:
            return input;
        }
    }
  }

  return (
    <div id={uid} className={`window-container ${dragging ? 'unselectable' : ''}`} unselectable={dragging ? 'on' : 'off'} style={{top: top, left: left, zIndex: z.toString(), width: `${width}px`, height: height}}>
      <div onMouseDown={barClickDown} className='bar'>
        <div className='bar-icon'><TbTemperatureCelsius /></div>
        <h2 className='bar-title'>{title}</h2>
      </div>
      <div className='bar-buttons'>
        <button className='bar-close' onClick={() => closeWindow(uid)}>X</button>
      </div>
      <div className='window-content'>
        <div className='temp-container'>
          <div className='temp-input-container'>
            <input className='temp-input' onChange={onTempChange} value={tempInput}></input>
            <div className="temp-dropdown">
              <button className="temp-dropdown-btn">{getTempDisplyName(inputUnit)}</button>
              <div className="temp-dropdown-content">
                <button aria-selected={inputUnit == 'C'} onClick={(e) => setInputUnit((e.target as HTMLButtonElement).value)} value={'C'}>Celsius</button>
                <button aria-selected={inputUnit == 'F'} onClick={(e) => setInputUnit((e.target as HTMLButtonElement).value)} value={'F'}>Fahrenheit</button>
                <button aria-selected={inputUnit == 'K'} onClick={(e) => setInputUnit((e.target as HTMLButtonElement).value)} value={'K'}>Kelvin</button>
              </div>
            </div>
          </div>
          <div className='temp-arrow'><GoArrowRight/></div>
          <div className='temp-output-container'>
            <div className='temp-output'>
              <p>{calculateOutput()}</p>
            </div>
            <div className="temp-dropdown">
              <button className="temp-dropdown-btn">{getTempDisplyName(outputUnit)}</button>
              <div className="temp-dropdown-content">
              <button aria-selected={outputUnit == 'C'} onClick={(e) => setOutputUnit((e.target as HTMLButtonElement).value)} value={'C'}>Celsius</button>
                <button aria-selected={outputUnit == 'F'} onClick={(e) => setOutputUnit((e.target as HTMLButtonElement).value)} value={'F'}>Fahrenheit</button>
                <button aria-selected={outputUnit == 'K'} onClick={(e) => setOutputUnit((e.target as HTMLButtonElement).value)} value={'K'}>Kelvin</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
