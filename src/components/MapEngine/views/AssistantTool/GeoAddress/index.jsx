import React, { useState } from "react";
import AMap from "AMap";
import "./index.styl";
import { Input, Row, Button, Col, Checkbox } from "antd";
import useLocationMarker from "../../../hooks/useLocationMarker";
const { TextArea } = Input;
let geocoder;
export default function GeoAddress({ curCity }) {
  const [geoAddress, setGeoAddress] = useState({
    address: null,
    location: null
  });
  const [batchMode, setBatchMode] = useState(false);
  const [singleMarker, setSingleMarker] = useState({});
  const geoCodeAddressChange = e => {
    setGeoAddress({ ...geoAddress, address: e.target.value });
  };
  const geoCodeLocationChange = e => {
    setGeoAddress({ ...geoAddress, location: e.target.value });
  };
  const convertLnglatStrToArray = lnglatStr => {
    let oneLnglatStr = lnglatStr.split(",");
    return oneLnglatStr.map(val => parseFloat(val));
  };
  useLocationMarker({ location: singleMarker });
  if (!geocoder) {
    geocoder = new AMap.Geocoder({ city: curCity.cityName, batch: batchMode }); //城市设为北京，默认：“全国”
  }
  const geoDecodeConvert = () => {
    let lnglatStrs = geoAddress.location.split("\n");
    const inputLnglat = lnglatStrs.map(convertLnglatStrToArray);
    let orgLngLat = [];
    Object.assign(orgLngLat, inputLnglat);
    geocoder.getAddress(inputLnglat, function(status, result) {
      let addresses = [];
      let { regeocodes } = result;
      if (regeocodes) {
        for (let regeocode of regeocodes) {
          if (regeocode && regeocode.formattedAddress) {
            const tmpAddress = regeocode.formattedAddress;
            addresses.push(tmpAddress);
          } else {
            addresses.push("NONE");
          }
        }
        if (!batchMode) {
          let tmpLoc = orgLngLat[0];
          setSingleMarker({ longitude: tmpLoc[0], latitude: tmpLoc[1] });
        }
        setGeoAddress({ ...geoAddress, address: addresses.join("\n") });
      } else {
        setGeoAddress({ ...geoAddress, address: "NONE" });
      }
    });
  };

  const geoCodeConvert = () => {
    let address = geoAddress.address.split("\n");
    geocoder.getLocation(address, function(status, result) {
      let locations = [];
      let { geocodes } = result;
      if (geocodes) {
        for (let geocode of geocodes) {
          if (geocode && geocode.location) {
            const { lng, lat } = geocode.location;
            locations.push(lng + "," + lat);
          } else {
            locations.push("NONE");
          }
        }
        if (!batchMode) {
          let tmpLoc = convertLnglatStrToArray(locations[0]);
          setSingleMarker({ longitude: tmpLoc[0], latitude: tmpLoc[1] });
        }
        setGeoAddress({ ...geoAddress, location: locations.join("\n") });
      } else {
        setGeoAddress({ ...geoAddress, location: "NONE" });
      }
    });
  };
  const InputComponent = batchMode ? TextArea : Input;
  const rows = batchMode ? 6 : 1;
  const batchPlacholder = ",批量模式请换行";
  return (
    <div className="geo-address-coder">
      <Row type="flex">
        <Col span={12}>地址经纬度互转</Col>
        <Col span={12} align="right">
          <Checkbox
            onChange={e => {
              setGeoAddress({ address: null, location: null });
              setBatchMode(e.target.checked);
            }}
          >
            批量模式
          </Checkbox>
        </Col>
      </Row>
      <Row className="inputArea">
        <Col span={12}>
          <InputComponent
            addonBefore="地址"
            value={geoAddress.address}
            rows={rows}
            placeholder={`请输入地址${batchMode ? batchPlacholder : ""}`}
            onChange={geoCodeAddressChange}
            className="input-geo-address"
          />
        </Col>
        <Col span={12}>
          <InputComponent
            addonBefore="经纬度"
            placeholder={`请输入经纬度${batchMode ? batchPlacholder : ""}`}
            value={geoAddress.location}
            onChange={geoCodeLocationChange}
            rows={rows}
            className="input-geo-address"
          />
        </Col>
      </Row>
      <Row className="btn" type="flex">
        <Col span={12}>
          <Button size="small" onClick={geoCodeConvert}>
            {"地址->经纬度"}
          </Button>
        </Col>
        <Col span={12} align="right">
          <Button size="small" onClick={geoDecodeConvert}>
            {"地址<-经纬度"}
          </Button>
        </Col>
      </Row>
    </div>
  );
}
