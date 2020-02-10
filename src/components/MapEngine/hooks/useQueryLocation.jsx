import React, { useEffect, useState } from "react";
/* eslint-disable no-param-reassign */
import * as API from "../utils/service";
import { Select } from "antd";
import useLocationMarker from "./useLocationMarker";
export default function useQueryLocation(props) {
  const { curCity, resetFields } = props;
  const { longitude, latitude, cityId, cityName } = curCity;
  const [poiList, setPoiList] = useState([]);
  const [location, setLocation] = useState({});
  let [query, setQuery] = useState("");
  useLocationMarker({
    location
  });
  useEffect(() => {
    query = query.replace(/\s/g, "");
    if (!query || !latitude || !longitude) {
      setPoiList([]);
      resetFields && resetFields(["location"]);
    } else {
      const params = {
        cityId,
        query,
        longitude,
        latitude
      };
      API.fetchLocations(params)
        .then(tmpData => {
          const { poiList: tmpPoiList = [] } = tmpData;
          setPoiList(tmpPoiList);
        })
        .catch(exp => {
          setPoiList([]);
        });
    }
  }, [query, curCity]);

  return (
    <Select
      style={{
        minWidth: "80px"
      }}
      showSearch
      allowClear
      size="default"
      placeholder="请输入位置"
      onSearch={e => {
        setQuery(e);
      }}
      filterOption={false}
      onChange={id => {
        const location = poiList.find(item => item.id === id);
        setLocation(location);
      }}
    >
      {" "}
      {poiList.map(d => (
        <Select.Option key={d.id} value={d.id} title={d.name}>
          {" "}
          {d.name}{" "}
        </Select.Option>
      ))}{" "}
    </Select>
  );
}
