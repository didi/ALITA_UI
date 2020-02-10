import * as icon from './icon'
import * as map from './map'
import {
    MAP_ZOOM_SIZE,
    DEFAULT_CITY
} from '../configs';

export {
    icon
}
export {
    map
}

// 设置地图中心点和缩放级别
export function focusZoomAndCenterByLongLat({
    longitude,
    latitude,
    map
}) {
    map.setZoomAndCenter(MAP_ZOOM_SIZE, [longitude, latitude]);
}

export function loadLastUsedCity(key) {
    let savedCity
    try {
        if (!(savedCity.longitude && savedCity.latitude)) {
            throw new Error("longitude or latitude error")
        }
    } catch (e) {
        savedCity = DEFAULT_CITY
        console.warn("not get last city!use default city")
    } finally {
        savedCity = savedCity ? savedCity : DEFAULT_CITY
    }
    return savedCity
}