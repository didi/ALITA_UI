/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from "react";
import { usePrevious } from "../Map/hook/";
import DetailModal from "./LocationPlan/Detail";

import AMap from "AMap";
import { Icon, Popover, Form, Select, Modal } from "antd";
import { FilterCard } from "@/components";
import {
  MAP_GRID_SERVICE_RADIUS_LIST,
  MAP_GRID_SERVICE_RADIUS_5KM
} from "../../configs";
import { map } from "../../utils";
import { gMap, districtExplorer, rangingTool, operationStatus } from "../Map";
import "./index.less";
import GeoAddress from "./GeoAddress";
import LocationPlan from "./LocationPlan";

const { renderGrid } = map;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 11 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 13 }
  }
};
const Option = Select.Option;

let edge = MAP_GRID_SERVICE_RADIUS_5KM; // 默认初始边长
let gridOG; // 网格工具

function AssistantToolView(props) {
  const {
    dataSource,
    form: { getFieldDecorator },
    assist = false
  } = props;
  // let { curCity = {} } = dataSource;

  const assistType = assist === false ? 1 : Array.isArray(assist) ? 2 : 3;
  let curCity = {
    cityId: "5",
    longitude: 120.15507,
    latitude: 30.274085,
    areacode: 3301
  };
  const {
    cityId = "5",
    longitude = 120.15507,
    latitude = 30.274085,
    areacode = 3301
  } = curCity;
  const [status, setStatus] = useState({
    mapGridChecked: false,
    cityDistrictChecked: false,
    chooseSiteChecked: false,
    rulerToolChecked: false,
    geoCodeChecked: false,
    locationPlanChecked: false
  });
  const [geoAddressShow, setGeoAddressShow] = useState({ display: "none" });
  const preDataSource = usePrevious(dataSource) || {};

  // 切换城市时，重新渲染地图网格/行政区边界
  useEffect(() => {
    const { curCity: preCurCity = {} } = preDataSource;
    const { cityId: preCityId } = preCurCity;
    if (cityId !== preCityId) {
      if (status["cityDistrictChecked"]) {
        renderDistrict(areacode);
      }
      if (status["mapGridChecked"]) {
        renderGrids(longitude, latitude);
      }
    }
  }, [
    areacode,
    cityId,
    dataSource,
    latitude,
    longitude,
    preDataSource,
    status
  ]);
  // 开关
  const onChangeHandler = (checkedStatus = {}) => {
    Object.keys(checkedStatus).forEach(key => {
      if (checkedStatus.hasOwnProperty(key)) {
        const checked = checkedStatus[key];
        // 选址评估
        if (key === "chooseSiteChecked") {
          operationStatus.chooseSiteChecked = checked;
        }
        // 地图网格
        else if (key === "mapGridChecked") {
          if (checked) {
            renderGrids(longitude, latitude);
          } else {
            gridOG && gridOG.clearOverlays();
          }
        }
        // 测距工具
        else if (key === "rulerToolChecked") {
          if (checked) {
            rangingTool && rangingTool.turnOn();
          } else {
            rangingTool && rangingTool.turnOff();
          }
        }
        // 行政区边界
        else if (key === "cityDistrictChecked") {
          if (checked) {
            renderDistrict(areacode);
          } else {
            districtExplorer.clearFeaturePolygons();
          }
        }
        //地址转经纬度
        else if (key === "geoCodeChecked") {
          if (checked) {
            setGeoAddressShow({ display: "block" });
          } else {
            setGeoAddressShow({ display: "none" });
          }
        }
        //选址规划
        else if (key === "locationPlanChecked") {
          //
        }
      }
    });
    setStatus({
      ...status,
      ...checkedStatus
    });
  };

  const mapGridEdgeOnChange = value => {
    edge = value;
    renderGrids(longitude, latitude);
  };

  const renderGrids = (longitude, latitude) => {
    gridOG && gridOG.clearOverlays();
    const intervalLng = 0.01172;
    const intervalLat = 0.00898;
    const gridOverlays = renderGrid({
      edge,
      centralLng: longitude,
      centralLat: latitude,
      intervalLng,
      intervalLat
    });
    gridOG = new AMap.OverlayGroup(gridOverlays);
    gMap.add(gridOG);
  };

  const renderDistrict = areacode => {
    areacode = areacode + "00";
    // 北京
    if (areacode === "110100") {
      areacode = "110000";
    }
    // 上海
    if (areacode === "310100") {
      areacode = "310000";
    }
    // 重庆
    if (areacode === "500100") {
      areacode = "500000";
    }
    // 天津
    if (areacode === "120100") {
      areacode = "120000";
    }
    const colors = [
      "#3366cc",
      "#dc3912",
      "#ff9900",
      "#109618",
      "#990099",
      "#0099c6",
      "#dd4477",
      "#66aa00"
    ];

    if (areacode === "441900") {
      areacode = "440000";
      districtExplorer.loadAreaNode(areacode, function(error, areaNode) {
        // 清除已有的绘制内容
        districtExplorer.clearFeaturePolygons();
        // 绘制子级区划
        districtExplorer.renderSubFeatures(areaNode, function(feature, i) {
          if (i === 16) {
            const fillColor = colors[i % colors.length];
            const strokeColor = colors[colors.length - 1 - (i % colors.length)];
            return {
              cursor: "default",
              bubble: true,
              strokeColor: strokeColor, // 线颜色
              strokeOpacity: 1, // 线透明度
              strokeWeight: 1, // 线宽
              fillColor: fillColor, // 填充色
              fillOpacity: 0.35 // 填充透明度
            };
          }
        });
      });
    } else {
      districtExplorer.loadAreaNode(areacode, function(error, areaNode) {
        // 清除已有的绘制内容
        districtExplorer.clearFeaturePolygons();
        // 绘制子级区划
        districtExplorer.renderSubFeatures(areaNode, function(feature, i) {
          const fillColor = colors[i % colors.length];
          const strokeColor = colors[colors.length - 1 - (i % colors.length)];
          return {
            cursor: "default",
            bubble: true,
            strokeColor: strokeColor, // 线颜色
            strokeOpacity: 1, // 线透明度
            strokeWeight: 1, // 线宽
            fillColor: fillColor, // 填充色
            fillOpacity: 0.35 // 填充透明度
          };
        });
        // 绘制父级区划，仅用黑色描边
        districtExplorer.renderParentFeature(areaNode, {
          cursor: "default",
          bubble: true,
          strokeColor: "black", // 线颜色
          fillColor: null,
          strokeWeight: 1 // 线宽
        });
      });
    }
  };
  const closeAlgoModal = () => {
    onChangeHandler({ locationPlanChecked: false });
  };
  const content = (
    <div style={{ width: "250px" }} className="map-engine-tool-content">
      {assistType === 2 &&
        assist.map(cur => {
          switch (cur) {
            case 1:
              return (
                <FilterCard
                  key={cur.toString()}
                  title="选址评估"
                  onChange={checked =>
                    onChangeHandler({ chooseSiteChecked: checked })
                  }
                  checked={status["chooseSiteChecked"]}
                ></FilterCard>
              );
            case 2:
              return (
                <FilterCard
                  key={cur.toString()}
                  title="地图网格"
                  onChange={checked =>
                    onChangeHandler({ mapGridChecked: checked })
                  }
                  checked={status["mapGridChecked"]}
                >
                  <Form.Item {...formItemLayout} label="网格边长">
                    {getFieldDecorator("gridEdge", {
                      initialValue: MAP_GRID_SERVICE_RADIUS_5KM
                    })(
                      <Select
                        size="small"
                        style={{ minWidth: "120px" }}
                        onChange={mapGridEdgeOnChange}
                      >
                        {MAP_GRID_SERVICE_RADIUS_LIST.map(cur => (
                          <Option
                            value={cur.value}
                            key={`oilToElectricityConversionRate-${cur.value}`}
                          >
                            {cur.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </FilterCard>
              );
            case 3:
              return (
                <FilterCard
                  key={cur.toString()}
                  title="测距工具"
                  onChange={checked =>
                    onChangeHandler({ rulerToolChecked: checked })
                  }
                  checked={status["rulerToolChecked"]}
                ></FilterCard>
              );
            case 4:
              return (
                <FilterCard
                  key={cur.toString()}
                  title="行政区域边界"
                  onChange={checked =>
                    onChangeHandler({ cityDistrictChecked: checked })
                  }
                  checked={status["cityDistrictChecked"]}
                ></FilterCard>
              );
            case 5:
              return (
                <FilterCard
                  key={cur.toString()}
                  title="地址经纬度查询/互转"
                  onChange={checked =>
                    onChangeHandler({ geoCodeChecked: checked })
                  }
                  checked={status["geoCodeChecked"]}
                ></FilterCard>
              );
            case 6:
              return (
                <FilterCard
                  key={cur.toString()}
                  title="选址规划"
                  curCity={curCity}
                  onChange={checked =>
                    onChangeHandler({ locationPlanChecked: checked })
                  }
                  checked={status["locationPlanChecked"]}
                ></FilterCard>
              );
            default:
              return null;
          }
        })}
    </div>
  );

  return (
    <div>
      <div className="map-engine-tool">
        <Popover
          content={assistType === 3 ? assist.content : content}
          title={assistType === 3 ? assist.header : "辅助工具"}
        >
          <div className="helper-container">
            <div className="helper">
              <span className="icon-container">
                <Icon
                  type="plus-circle"
                  theme="outlined"
                  style={{
                    color: "rgba(255,255,255,.8)",
                    fontSize: "2em",
                    lineHeight: "1.7em"
                  }}
                />
              </span>
              <span style={{ marginLeft: "4em", fontSize: "12px" }}>
                {assistType === 3 ? assist.title : "辅助功能"}
              </span>
            </div>
          </div>
        </Popover>
      </div>
      <div
        className="geo-address-tool"
        style={{ display: geoAddressShow.display }}
      >
        <GeoAddress curCity={curCity} />
      </div>
      <Modal
        title="选址规划算法"
        visible={status["locationPlanChecked"]}
        footer={null}
        closable={true}
        // onClose={closeAlgoModal}
        onCancel={closeAlgoModal}
      >
        <LocationPlan
          curCity={curCity}
          closeAlgoModal={closeAlgoModal}
        ></LocationPlan>
      </Modal>
      <DetailModal />
    </div>
  );
}

export default Form.create()(AssistantToolView);
