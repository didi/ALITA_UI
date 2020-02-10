import React, { Component } from "react";
import CitySelector from "@/components/CitySelector";
import T from "prop-types";
import FilterDrawer from "../FilterDrawer";
import { gMap } from "..";
const { Collapse } = FilterDrawer;
const { Panel } = Collapse;
const { Card } = Panel;

export default class extends Component {
  static propTypes = {
    title: T.any,
    children: T.any,
    onSubmit: T.func,
    onCancel: T.func,
    width: T.number
  };

  constructor(props) {
    super(props);
    this.state = {
      curCity: {
        cityId: "5",
        longitude: 120.15507,
        latitude: 30.274085,
        areacode: 3301
      },
      pointChecked: false,
      lineChecked: false,
      planeChecked: false
    };
  }

  handleCityChange = data => {
    this.setState({ curCity: data });
    const { longitude, latitude } = data;
    gMap.setZoomAndCenter(14, [longitude, latitude]);
  };

  onSubmit = data => {
    const { pointChecked, lineChecked, planeChecked, curCity } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: "dataSource/triggerLoadData",
      payload: {
        pointChecked,
        lineChecked,
        planeChecked,
        cityId: curCity.cityId
      }
    });
  };

  render() {
    const { title, width, children, onCancel } = this.props;
    const { curCity, pointChecked, lineChecked, planeChecked } = this.state;
    const provinceInfo = [
      {
        id: 29,
        name: "浙江省",
        alias: "浙江",
        priority: 0,
        cityInfo: [
          {
            id: 5,
            name: "杭州市",
            alias: "杭州",
            areacode: 3301,
            longitude: 120.15507,
            latitude: 30.274085,
            priority: 0
          },
          {
            id: 20,
            name: "宁波市",
            alias: "宁波",
            areacode: 3302,
            longitude: 121.550357,
            latitude: 29.874557,
            priority: 0
          },
          {
            id: 85,
            name: "温州市",
            alias: "温州",
            areacode: 3303,
            longitude: 120.699367,
            latitude: 27.994267,
            priority: 0
          },
          {
            id: 86,
            name: "金华市",
            alias: "金华",
            areacode: 0,
            longitude: 119.647445,
            latitude: 29.079059,
            priority: 0
          },
          {
            id: 88,
            name: "嘉兴市",
            alias: "嘉兴",
            areacode: 0,
            longitude: 120.755486,
            latitude: 30.746129,
            priority: 0
          },
          {
            id: 89,
            name: "绍兴市",
            alias: "绍兴",
            areacode: 3306,
            longitude: 120.580232,
            latitude: 30.029753,
            priority: 0
          }
        ]
      },
      {
        id: 11,
        name: "河北省",
        alias: "河北",
        priority: 0,
        cityInfo: [
          {
            id: 22,
            name: "石家庄市",
            alias: "石家庄",
            areacode: 1301,
            longitude: 114.51486,
            latitude: 38.042307,
            priority: 0
          },
          {
            id: 40,
            name: "唐山市",
            alias: "唐山",
            areacode: 1302,
            longitude: 118.180194,
            latitude: 39.630867,
            priority: 0
          },
          {
            id: 46,
            name: "廊坊市",
            alias: "廊坊",
            areacode: 1310,
            longitude: 116.683752,
            latitude: 39.538047,
            priority: 0
          },
          {
            id: 59,
            name: "沧州市",
            alias: "沧州",
            areacode: 1309,
            longitude: 116.838835,
            latitude: 38.304477,
            priority: 0
          },
          {
            id: 60,
            name: "邯郸市",
            alias: "邯郸",
            areacode: 1304,
            longitude: 114.538962,
            latitude: 36.625657,
            priority: 0
          },
          {
            id: 61,
            name: "秦皇岛市",
            alias: "秦皇岛",
            areacode: 1303,
            longitude: 119.600493,
            latitude: 39.935385,
            priority: 0
          },
          {
            id: 62,
            name: "保定市",
            alias: "保定",
            areacode: 1306,
            longitude: 115.464806,
            latitude: 38.873891,
            priority: 0
          },
          {
            id: 67,
            name: "邢台市",
            alias: "邢台",
            areacode: 1305,
            longitude: 114.504844,
            latitude: 37.070589,
            priority: 0
          },
          {
            id: 72,
            name: "承德市",
            alias: "承德",
            areacode: 1308,
            longitude: 117.962411,
            latitude: 40.954071,
            priority: 0
          },
          {
            id: 78,
            name: "张家口市",
            alias: "张家口",
            areacode: 1307,
            longitude: 114.887543,
            latitude: 40.824418,
            priority: 0
          },
          {
            id: 80,
            name: "衡水市",
            alias: "衡水",
            areacode: 1311,
            longitude: 115.670177,
            latitude: 37.73892,
            priority: 0
          }
        ]
      },
      {
        id: 15,
        name: "辽宁省",
        alias: "辽宁",
        priority: 0,
        cityInfo: [
          {
            id: 8,
            name: "沈阳市",
            alias: "沈阳",
            areacode: 2101,
            longitude: 123.432253,
            latitude: 41.805865,
            priority: 0
          },
          {
            id: 14,
            name: "大连市",
            alias: "大连",
            areacode: 2102,
            longitude: 121.614682,
            latitude: 38.914003,
            priority: 0
          }
        ]
      }
    ];
    return (
      <FilterDrawer
        title={title}
        width={width}
        onSubmit={this.onSubmit}
        onCancel={onCancel}
      >
        <CitySelector
          defaultValue={curCity}
          data={provinceInfo}
          onChange={this.handleCityChange}
        />
        <Card
          title="点数据"
          onChange={checked => {
            this.setState({ pointChecked: checked });
          }}
          checked={pointChecked}
        ></Card>
        <Card
          title="线数据"
          onChange={checked => {
            this.setState({ lineChecked: checked });
          }}
          checked={lineChecked}
        ></Card>
        <Card
          title="面数据"
          onChange={checked => {
            this.setState({ planeChecked: checked });
          }}
          checked={planeChecked}
        ></Card>
        {children}
      </FilterDrawer>
    );
  }
}
