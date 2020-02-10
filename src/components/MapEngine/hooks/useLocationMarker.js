import {
    useEffect
} from "react";
import {
    gMap
} from '@/components';
import AMap from 'AMap'
import {
    focusZoomAndCenterByLongLat
} from '../utils';
let locationMarker
export default function useLocationMarker(props) {
    const {
        location = {}
    } = props
    useEffect(() => {
        const {
            longitude,
            latitude
        } = location;
        if (longitude && latitude) {
            focusZoomAndCenterByLongLat({
                ...location,
                map: gMap
            });
            if (!locationMarker) {
                locationMarker = new AMap.Marker({
                    icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png',
                    position: [longitude, latitude],
                    zIndex: 1000
                })
                locationMarker.setMap(gMap);
            } else {
                locationMarker.setPosition(new AMap.LngLat(longitude, latitude));
            }
        }
    }, [location])
}