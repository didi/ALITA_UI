import AMap from 'AMap'
import {
  drawMarker
} from '../../../../utils/map'
// IconMarker
export function draw(props) {
  const {
    data = {}, key, viewPath, onClick, mouseOver, mouseOut, map
  } = props
  let iconPointsOG = new AMap.OverlayGroup()
  const {
    payload = [], config = []
  } = data
  // eslint-disable-next-line no-unused-vars
  for (let [index, point] of payload.entries()) {
    const {
      longitude,
      latitude,
      operatorName
    } = point
    let icon = '';
    icon = `${operatorName}.png`
    const marker = drawMarker(longitude, latitude, icon, map)
    marker.on('click', (e) => {
      e.extra = {
        key,
        viewPath,
        target: point,
        config
      }
      onClick && onClick(e)
    })
    marker.on('mouseover', (e) => {
      e.extra = {
        key,
        viewPath,
        target: point,
        config
      }
      mouseOver && mouseOver(e)
    })
    marker.on('mouseout', (e) => {
      e.extra = {
        key,
        viewPath,
        target: point,
        config
      }
      mouseOut && mouseOut(e)
    })
    iconPointsOG.addOverlay(marker)
  }
  map.add(iconPointsOG)
  window.iconPointsOG = iconPointsOG;
  return iconPointsOG
}

export default {
  view: 1,
  draw
}