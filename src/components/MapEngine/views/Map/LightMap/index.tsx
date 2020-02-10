import React, { useEffect, useRef, useState } from "react";
import AMap from "AMap";
import { useMapHook } from "../hook";

export interface MapProps {
  dataSource: {
    [propName: string]: any;
  };
  onClick: () => {};
  restProps?: any;
}

let lightMap: any;
let lightMapOGs: Array<any> = [];

export default function LightMapView(props: MapProps) {
  const mapEl = useRef(null);
  const mapDynamicEl = useRef(null);
  const [refresh, refreshFn] = useState(0);
  // 初始化地图
  const initMap = () => {
    const map = new AMap.Map(mapEl.current, {
      zoom: 12,
      resizeEnable: true,
      touchZoom: true,
      scrollWheel: true,
      doubleClickZoom: true,
      zoomEnable: true,
      dragEnable: true
    });
    lightMap = map;
    lightMap.extra = {
      target: "lightMap"
    };
    // 缩放工具
    AMap.plugin(["AMap.ToolBar", "AMap.Scale", "AMap.RangingTool"], () => {
      map.addControl(new AMap.ToolBar({ direction: true }));
      map.addControl(new AMap.Scale({ position: "LB" }));
    });
    mapDynamicEl.current = lightMap;
    refreshFn(refresh + 1);
  };
  useEffect(() => {
    initMap();
  }, [initMap]);
  useMapHook({ ...props, map: mapDynamicEl.current, OGs: lightMapOGs });

  return (
    <>
      <div style={{ height: 650 }} ref={mapEl} />
    </>
  );
}

export { lightMapOGs, lightMap };
