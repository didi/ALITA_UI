import AMap from 'AMap'

// CurveLine
export function draw(props) {
  const {
    data = {}, key, viewPath, onClick, mouseOver, mouseOut, map
  } = props
  const {
    payload = [], config = []
  } = data
  let curveLinesOG = new AMap.OverlayGroup()
  let textsOG = new AMap.OverlayGroup()
  for (let line of payload) {
    const {
      fromLongitude,
      fromLatitude,
      toLongitude,
      toLatitude,
      controlLongitude,
      controlLatitude,
    } = line
    const path = [
      [fromLongitude, fromLatitude],
      [controlLongitude, controlLatitude, toLongitude, toLatitude],
    ]
    const bezierCurve = new AMap.BezierCurve({
      path: path,
      strokeColor: 'rgb(86, 210, 205)',
      strokeWeight: 1.5,
      strokeStyle: "solid",
      lineJoin: 'round',
      lineCap: 'round',
      zIndex: 550,
      cursor: 'pointer',
    })
    bezierCurve.setExtData(line)
    bezierCurve.on('click', (e) => {
      e.extra = {
        key,
        viewPath,
        target: line,
        config
      }
      onClick && onClick(e)
    })
    bezierCurve.on('mouseover', (e) => {
      e.extra = {
        key,
        viewPath,
        target: line,
        config
      }
      mouseOver && mouseOver(e)
    })
    bezierCurve.on('mouseout', (e) => {
      e.extra = {
        key,
        viewPath,
        target: line,
        config
      }
      mouseOut && mouseOut(e)
    })
    curveLinesOG.addOverlay(bezierCurve)
  }
  map.add(curveLinesOG)
  return {
    curveLinesOG,
    textsOG
  }
}

export default {
  view: 2,
  draw
}