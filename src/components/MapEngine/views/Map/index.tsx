/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import AMap from "AMap";
import AMapUI from "AMapUI";
import { OG } from "../../utils/OG";
import { useMapHook } from "./hook/";
import AddPlaneView from "./Plane/Add";

export interface MapProps {
  dataSource: {
    [propName: string]: any;
  };
  data?: {
    [propName: string]: any;
  };
  onClick: () => {};
  dispatch?: Function;
  restProps?: any;
}

let gMap: any;
let districtExplorer;
let rangingTool;
let OGs: Array<any> = [];
let operationStatus = {};
let polygonMouseTool;

export default function View(props: MapProps) {
  const { dataSource, onClick, restProps, dispatch } = props;
  const mapEl = useRef(null);
  const onClickRef: React.MutableRefObject<Function> = useRef(() => {});
  useEffect(() => {
    onClickRef.current = onClick;
  }, [onClick]);
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
    gMap = map;
    gMap.extra = {
      target: "gMap"
    };
    // 渲染测距工具
    initRangingTool();
    // 缩放工具
    AMap.plugin(["AMap.ToolBar", "AMap.Scale", "AMap.RangingTool"], () => {
      map.addControl(new AMap.ToolBar({ direction: true }));
      map.addControl(new AMap.Scale({ position: "LB" }));
    });
    // 行政区域边界
    AMapUI.loadUI(["geo/DistrictExplorer"], (DistrictExplorer: any) => {
      districtExplorer = new DistrictExplorer({
        map: map
      });
    });
    // 多边形绘制工具
    polygonMouseTool = new AMap.MouseTool(gMap);
    // 地图点击事件
    map.on("click", (e: any) => {
      e.extra = { key: "map", status: operationStatus };
      onClickRef.current && onClickRef.current(e);
    });
    console.log("执行");
  };

  useEffect(() => {
    initMap();
  }, []);
  useMapHook({ ...props, map: gMap, OGs, dispatch });

  // 渲染测距工具
  const initRangingTool = () => {
    gMap.plugin(["AMap.RangingTool"], () => {
      rangingTool = new AMap.RangingTool(gMap);
    });
  };

  return (
    <>
      {/* 地图 */}
      <div
        style={{
          height: document.body.clientHeight * 0.9
        }}
        ref={mapEl}
      />
      {/* 新增面模态框 */}
      <AddPlaneView
        dataSource={dataSource}
        onClick={onClickRef.current}
        {...{ ...restProps, map: gMap }}
      />
    </>
  );
}

export {
  gMap,
  districtExplorer,
  OGs,
  OG,
  rangingTool,
  operationStatus,
  polygonMouseTool
};
