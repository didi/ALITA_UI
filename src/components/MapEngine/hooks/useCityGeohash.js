/* eslint-disable no-param-reassign */

import {
    useState,
    useEffect
} from "react";
import * as API from '../utils/service'
export default function useCityList(props) {
    const {
        cityId,
        type
    } = props
    const [geohash, setGeohash] = useState([])
    useEffect(() => {
        API.fetchCityGeohashList({
                cityId,
                type
            }).then(
                data => setGeohash(data.payload)
            )
            .catch(exp => {
                setGeohash([])
            })
    }, [cityId, type])
    return geohash;
}