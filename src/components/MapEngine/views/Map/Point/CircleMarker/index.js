import AMap from 'AMap'

export function draw(props) {
  const { data = {}, key, viewPath, onClick, mouseOver, mouseOut, map } = props
  const { payload = [], config = [], __config__ } = data
  let circlePointsOG = new AMap.OverlayGroup()
  for (let point of payload) {
    const { longitude, latitude } = point
    let styleConfig = {}
    if (__config__) {
      const { fn } = __config__
      styleConfig = fn(key)
    }
    const { strokeOpacity = 0, radius = 5, fillColor = '#336699' } = styleConfig
    const marker = new AMap.CircleMarker({
      center: [longitude, latitude],
      radius,
      strokeOpacity,
      fillColor,
      cursor: 'pointer',
      clickable: true,
    })
    marker.on('click', (e) => {
      e.extra = { key, viewPath, target: point, config }
      onClick && onClick(e)
    })
    marker.on('mouseover', (e) => {
      e.extra = { key, viewPath, target: point, config }
      mouseOver && mouseOver(e)
    })
    marker.on('mouseout', (e) => {
      e.extra = { key, viewPath, target: point, config }
      mouseOut && mouseOut(e)
    })
    circlePointsOG.addOverlay(marker)
  }
  map.add(circlePointsOG)
  return circlePointsOG
}


export default {
  view: 2,
  draw
}