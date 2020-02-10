import AMap from 'AMap'
import {
  findNode
} from '../../mapConfig'

// NormalPlane
export function draw(props) {
  const {
    data = {},
      key,
      viewPath,
      onClick,
      mouseOver,
      mouseOut,
      onDelete,
      map
  } = props
  const {
    payload = [], config = {}
  } = data
  const otherOGs = [];
  // 取出嵌套组件信息
  const filters = config.config.filter(({
    view
  }) => view && view[0] === 1)
  for (const {
      view,
      key: innerKey,
      config: innerConfig = []
    } of filters) {
    const curNode = findNode(view);
    if (curNode) {
      const params = {
        data: {
          config: {
            config: innerConfig,
            view
          },
          payload: payload.map((item) => item[innerKey])
        },
        OGsType: 'array',
        key,
        viewPath,
        map
      }
      const TOGs = (curNode.draw && curNode.draw.call(null, params)) || []
      otherOGs.push([...TOGs])
    }
  }
  let planesOG = new AMap.OverlayGroup();
  let planeMenu = new AMap.ContextMenu();
  let curPlane;
  let curE

  planeMenu.addItem("删除", () => {
    let e = {
      extra: {
        key,
        viewPath,
        target: curPlane,
        config
      },
      ...curE
    }
    onDelete(e)
  }, 1)
  const blockPolygonCb = (e, item) => {
    planeMenu.open(map, e.lnglat)
    curE = e
    curPlane = item
  }
  for (const item of payload) {
    const {
      plane
    } = item
    let styleConfig = {}
    const {
      fillColor = 'green',
        fillOpacity = 0.2,
        strokeColor = 'rgb(238,173,14)',
        strokeWeight = 1
    } = styleConfig
    const polygon = new AMap.Polygon({
      path: plane,
      fillColor,
      fillOpacity,
      strokeColor,
      strokeOpacity: 1,
      strokeWeight,
      cursor: 'pointer',
    })
    polygon.setExtData(item)
    polygon.on('click', (e) => {
      e.extra = {
        key,
        viewPath,
        target: item,
        config
      }
      onClick && onClick(e)
    })
    polygon.on('mouseover', (e) => {
      e.extra = {
        key,
        viewPath,
        target: item,
        config
      }
      mouseOver && mouseOver(e)
    })
    polygon.on('mouseout', (e) => {
      e.extra = {
        key,
        viewPath,
        target: item,
        config
      }
      mouseOut && mouseOut(e)
    })
    polygon.on('rightclick', (e) => {
      onDelete && blockPolygonCb(e, item)
    })
    planesOG.addOverlay(polygon)
  }
  planesOG.addOverlays(otherOGs)
  map.add(planesOG)
  return planesOG
}

export default {
  view: 1,
  draw
}