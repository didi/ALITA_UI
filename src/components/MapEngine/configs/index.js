// 辅助工具
// 地图网格
// 服务半径
export const MAP_GRID_SERVICE_RADIUS_1KM = 1
export const MAP_GRID_SERVICE_RADIUS_3KM = 3
export const MAP_GRID_SERVICE_RADIUS_5KM = 5

export const MAP_GRID_SERVICE_RADIUS_MAP = {
  [MAP_GRID_SERVICE_RADIUS_1KM]: {
    name: '1KM',
    value: 1,
    checked: true,
  },
  [MAP_GRID_SERVICE_RADIUS_3KM]: {
    name: '3KM',
    value: 3,
  },
  [MAP_GRID_SERVICE_RADIUS_5KM]: {
    name: '5KM',
    value: 5,
  },
}
export const MAP_LOCATION_PLAN_ALGOS = {
  0: {
    name: 'SDP',
    value: 0,
    supplies: "全城GeoHash",
    editable: true,
    color: "#00FF00" //绿色
  },
  1: {
    name: 'PSO',
    value: 1,
    supplies: "连续经纬度",
    editable: false,
    color: "#FFFF00" //黄色
  }
}

export const MAP_LOCATION_PLAN_CONSTRAIN_ORDER = 0;
export const MAP_LOCATION_PLAN_CONSTRAIS = [{
  key: MAP_LOCATION_PLAN_CONSTRAIN_ORDER,
  name: "订单热度"
}];

// 默认城市
export const DEFAULT_CITY = {
  provinceId: "29",
  provinceName: "浙江省",
  cityId: "5",
  cityName: "杭州市",
  longitude: 120.15507,
  latitude: 30.274085,
  areacode: 3301
};

// 默认地图缩放级别
export const MAP_ZOOM_SIZE = 12;

export const MAP_GRID_SERVICE_RADIUS_LIST =
  Object.keys(MAP_GRID_SERVICE_RADIUS_MAP).map(cur => ({
    id: cur,
    ...MAP_GRID_SERVICE_RADIUS_MAP[cur],
  }))