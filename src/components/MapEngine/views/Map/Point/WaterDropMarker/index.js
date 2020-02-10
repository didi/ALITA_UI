import AMap from 'AMap'
import AMapUI from 'AMapUI'
import { OG } from '../../../../utils/OG'
import './index.styl'

export function draw(props) {
  const { data = {}, key, viewPath, OGs, onClick, mouseOver, mouseOut, map } = props
  const { payload = [], config = [], __config__ } = data
  let waterDropPointsOG = new AMap.OverlayGroup()
  AMapUI.loadUI(['overlay/SvgMarker'], (SvgMarker) => {
    for (let point of payload) {
      const { longitude, latitude } = point
      let styleConfig = {}
      if (__config__) {
        const { fn } = __config__
        styleConfig = fn(point)
      }
      const { fillColor = 'red', name = '' } = styleConfig
      const shape = new SvgMarker.Shape.WaterDrop({
        height: 32,
        fillColor,
      })
      let tempText = ''; let text = point[name]
      if (text) {
        tempText = text.length > 2 ? text.substring(0, 2) : text
      }
      const waterDropMarker = new SvgMarker(shape, {
        map: map,
        position: [longitude, latitude],
        showPositionPoint: false,
        iconLabel: {
          innerHTML: `<div class="map-engine-text-waterdrop-marker">${tempText}</div>`,
          style: {
            color: 'white'
          }
        },
        title: text
      })
      waterDropMarker.extData = point
      waterDropMarker.on('click', (e) => {
        e.extra = { key, viewPath, target: point, config }
        onClick && onClick(e)
      })
      waterDropMarker.on('mouseover', (e) => {
        e.extra = { key, viewPath, target: point, config }
        mouseOver && mouseOver(e)
      })
      waterDropMarker.on('mouseout', (e) => {
        e.extra = { key, viewPath, target: point, config }
        mouseOut && mouseOut(e)
      })
      waterDropPointsOG.addOverlay(waterDropMarker)
    }
    OG.clear(key, OGs)
    OGs.push({
      key: viewPath,
      OG: waterDropPointsOG
    })
    map.add(waterDropPointsOG)
  })
}

export default {
  view: 5,
  syn: true,
  draw
}