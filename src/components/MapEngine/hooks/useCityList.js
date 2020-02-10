/* eslint-disable no-param-reassign */

import {
    useState,
    useEffect
} from "react";
import * as API from '../utils/service'
export default function useCityList(props) {
    const {
        payload
    } = props
    const [city, setCity] = useState({})
    useEffect(() => {
        API.fetchCityList(payload).then(data => setCity(data))
            .catch(exp => {
                setCity({})
            })
    }, [payload])
    return city;
}