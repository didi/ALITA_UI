import AMap from 'AMap'

// StraightLine
export function draw(props) {
  const { data = {}, key, viewPath, onClick, mouseOver, mouseOut, map } = props
  const { payload = [], config = [],  __config__ } = data
  let straightLinesOG = new AMap.OverlayGroup()
  for (let line of payload) {
    const {
      fromLongitude,
      fromLatitude,
      toLongitude,
      toLatitude,
    } = line
    const path = [
      [fromLongitude, fromLatitude],
      [toLongitude, toLatitude],
    ]
    let styleConfig = {}
    if (__config__) {
      const { fn } = __config__
      styleConfig = fn(line)
    }
    const { 
      strokeColor = '#009966',
      strokeWeight = 6 
    } = styleConfig
    const straightLine = new AMap.Polyline({
      path: path,
      strokeWeight,
      strokeColor,
      // dirColor, //箭头颜色
      showDir: true,
      lineJoin: 'round',
      lineCap: 'round',
      strokeStyle: "solid",
      zIndex: 550,
      cursor: 'pointer',
    })
    straightLine.setExtData(line)
    straightLine.on('click', (e) => {
      e.extra = { key, viewPath, target: line, config }
      onClick && onClick(e)
    })
    straightLine.on('mouseover', (e) => {
      e.extra = { key, viewPath, target: line, config }
      mouseOver && mouseOver(e)
    })
    straightLine.on('mouseout', (e) => {
      e.extra = { key, viewPath, target: line, config }
      mouseOut && mouseOut(e)
    })
    straightLinesOG.addOverlay(straightLine)
  }
  map.add(straightLinesOG)
  return straightLinesOG
}

export default {
  view: 1,
  draw
}