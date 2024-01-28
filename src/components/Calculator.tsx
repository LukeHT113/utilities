import { useEffect, useState } from 'react'
import { FcCalculator } from 'react-icons/fc';

interface IProps {
  uid: string,
  title: string,
  width: number,
  height: number
  closeWindow: (uid: string)=>void,
  z: number,
  bringToTop: (uid: string)=>void
}

export default function Calculator({uid, title, width, height, closeWindow, z, bringToTop}: IProps) {
  const [top, setTop] = useState<number>(window.innerHeight / 2 - height/2);
  const [left, setLeft] = useState<number>(window.innerWidth / 2 - width/2);
  const [dragging, setDragging] = useState<boolean>(false);
  const [xOffset, setXOffset] = useState<number>(0);
  const [calcDisplay, setCalcDisplay] = useState('');

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
  const onCalcBtnDown = (e: any) => {
    switch(e.target.value) {
      case '=':
        calculate();
        break;
      case 'C':
        clear();
        break;
      default:
        setCalcDisplay(prev => prev += e.target.value);
    }
  }

  const calculate = () => {
    let cleanFormula = '';
    if (calcDisplay.includes('--')) {
      cleanFormula = calcDisplay.replace('--', '+')
    } else if (calcDisplay.includes('++')) {
      cleanFormula = calcDisplay.replace('++', '+')
    } else {
      cleanFormula = calcDisplay;
    }

    try {
      setCalcDisplay(eval(cleanFormula) || '')
    } catch(e) {
      setCalcDisplay('error');
    }
  }

  const clear = () => {
    setCalcDisplay('');
  }

  return (
    <div id={uid} className={`window-container ${dragging ? 'unselectable' : ''}`} unselectable={dragging ? 'on' : 'off'} style={{top: top, left: left, zIndex: z.toString(), width: `${width}px`, height: `${height}px`}}>
      <div onMouseDown={barClickDown} className='bar'>
        <div className='bar-icon'><FcCalculator /></div>
        <h2 className='bar-title'>{title}</h2>
      </div>
      <div className='bar-buttons'>
        <button className='bar-close' onClick={() => closeWindow(uid)}>X</button>
      </div>
      <div className='window-content'>
        <div className='calc-container'>
          <div className='calc-display-container'>
            <div className='calc-display'>
              {calcDisplay}
            </div>
          </div>
          <div className='calc-buttons'>
            <button onClick={onCalcBtnDown} value={7} className='calc-btn'>7</button>
            <button onClick={onCalcBtnDown} value={8} className='calc-btn'>8</button>
            <button onClick={onCalcBtnDown} value={9} className='calc-btn'>9</button>
            <button onClick={onCalcBtnDown} value={'/'} className='calc-btn'>&divide;</button>
            <button onClick={onCalcBtnDown} value={4} className='calc-btn'>4</button>
            <button onClick={onCalcBtnDown} value={5} className='calc-btn'>5</button>
            <button onClick={onCalcBtnDown} value={6} className='calc-btn'>6</button>
            <button onClick={onCalcBtnDown} value={'*'} className='calc-btn'>&times;</button>
            <button onClick={onCalcBtnDown} value={1} className='calc-btn'>1</button>
            <button onClick={onCalcBtnDown} value={2} className='calc-btn'>2</button>
            <button onClick={onCalcBtnDown} value={3} className='calc-btn'>3</button>
            <button onClick={onCalcBtnDown} value={'-'} className='calc-btn'>-</button>
            <button onClick={onCalcBtnDown} value={0} className='calc-btn'>0</button>
            <button onClick={onCalcBtnDown} value={'C'} className='calc-btn'>C</button>
            <button onClick={onCalcBtnDown} value={'='} className='calc-btn'>=</button>
            <button onClick={onCalcBtnDown} value={'+'} className='calc-btn'>+</button>
          </div>
        </div>
      </div>
    </div>
  )
}
