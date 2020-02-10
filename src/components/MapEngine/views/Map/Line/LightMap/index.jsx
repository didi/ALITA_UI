import React, { useEffect, useRef } from 'react'
import AMap from 'AMap'
import { usePrevious } from '../../hook/usePrevious'
import config from '../../mapConfig'
import { OG } from '../../../../utils/OG'

let lightMap;
  let lightMapOGs = []

export default function LightMapView(props) {
  const {
    dataSource,
  } = props
  const mapEl = useRef(null);
  const preDataSource = usePrevious(dataSource) || {}
  useEffect(() => {
    initMap()
  }, []);
  useEffect(() => {
    Object.keys(dataSource).forEach(globalKey => {
      if (dataSource.hasOwnProperty(globalKey)) {
        const { data, count } = dataSource[globalKey]
        if (data && data.config && data.payload) {
          const { config: { view = [] } } = data
          const viewPath = Array.from(view)
          viewPath.shift()
          let result
          let children = config.children
          while (viewPath.length > 0) {
            const curView = viewPath.shift();
            const filterNodes = children.filter(item => item.view === curView);
            if (viewPath.length === 0) {
              result = filterNodes[0]
            } else {
              children = filterNodes[0] && filterNodes[0].children
            }
          }
          const { count: preCount } = preDataSource[globalKey] || []
          if ((preCount === undefined || preCount !== count) && result) {
            const viewPath = `${globalKey}-${view.join('-')}`
            const params = { data, key: globalKey, viewPath, OGs: lightMapOGs, ...props, map: lightMap }
            if (result.syn) {
              result.draw.call(null, params)
            }
            else {
              OG.clear(globalKey, lightMapOGs)
              const { payload } = data
              if(payload.length){
                const tempOG = result.draw.call(null, params)
                lightMapOGs.push({
                  key: viewPath,
                  OG: tempOG
                })
              }
            }
          }
        }
      }
    })
  }, [dataSource])

  // 初始化地图
  const initMap = () => {
    const map = new AMap.Map(mapEl.current, {
      zoom: 12,
      resizeEnable: true,
      touchZoom: true,
      scrollWheel: true,
      doubleClickZoom: true,
      zoomEnable: true,
      dragEnable: true,
    })
    lightMap = map
    lightMap.extra = {
      target: 'lightMap'
    }
    // 缩放工具
    AMap.plugin(['AMap.ToolBar', 'AMap.Scale', "AMap.RangingTool"], () => {
      map.addControl(new AMap.ToolBar({ direction: true }));
      map.addControl(new AMap.Scale({ position: 'LB' }));
    })
  }

  return (
    <>
      <div style={{ height: 650 }} ref={mapEl} />
    </>
  )
}

export {
  lightMapOGs,
  lightMap
}