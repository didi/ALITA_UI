import React, { useEffect, useState, useRef } from 'react'
import AMap from 'AMap'
import './index.styl'
const HEIGHT = 300
const WIDTH = 300
let observer

function FloatCard(props) {
  const { children, visible, data, map } = props
  const [location, setLocation] = useState({
    top: 0,
    left: 0,
  })
  const divRef = useRef(null)
  const callBackRef = useRef(null);

  useEffect(() => {
    const { longitude, latitude } = data
    divRef.current.setAttribute('longitude',longitude);
    divRef.current.setAttribute('latitude',latitude);
  }, [data])

  useEffect(() => {
    let config = {
      attributes: true,
    };
    callBackRef.current = (mutationsList) => {
      for (let mutation of mutationsList) {
        let type = mutation.type;
        const longitude = mutation.target.getAttribute('longitude');
        const latitude =mutation.target.getAttribute('latitude');
        switch (type) {
        case "attributes":
          if (document.defaultView.getComputedStyle(mutation.target).display !== 'none') {
            if( longitude && latitude && map){
              getPosition(longitude, latitude, mutation.target)
            }
          }
          break
        default:
          break
        }
      }
    }
    observer = new MutationObserver(callBackRef.current)
    observer.observe(divRef.current, config)
    return ()=>{
      observer.disconnect()
    }
  }, [map])
  
  const getPosition = (lng, lat, target) => {
    const pixel = map.lngLatToContainer(new AMap.LngLat(lng, lat))
    let left; let top; let height = 0
    if (target) {
      height = target.offsetHeight
    } else {
      height = HEIGHT
    }
    if (pixel.getX() > WIDTH) {
      left = pixel.getX() - WIDTH
    }
    else {
      left = pixel.getX()
    }
    if (pixel.getY() > height) {
      top = pixel.getY() - height
    }
    else {
      top = pixel.getY()
    }
    setLocation({ left, top })
  }

  return (
    <div
      className="float-card"
      ref={divRef}
      style={{
        display: visible ? 'block' : 'none',
        top: location.top,
        left: location.left,
        width: WIDTH
      }}
    >
      {children}
    </div>
  )
}

export default FloatCard