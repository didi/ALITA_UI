import React, { useState, useEffect } from "react";
import { connect } from "dva";
import {
  MAP_LOCATION_PLAN_ALGOS,
  MAP_LOCATION_PLAN_CONSTRAIS
} from "../../../configs";
import "./index.styl";
import FeatureEditor from "./FeatureEditor";

import {
  Input,
  Checkbox,
  Form,
  Select,
  InputNumber,
  Button,
  Modal,
  message
} from "antd";
import WaterDropMarker from "../../Map/Point/WaterDropMarker";
import { OGs, gMap } from "../../Map";

const { Item } = Form;
const demandPrefix = "demandField_";
function LocationPlan(props) {
  const { locationPlan, dispatch, curCity, closeAlgoModal } = props;
  const { registedDataSources, data, submitDisabled } = locationPlan;
  const { results = [] } = data;
  const [editFeature, setEditFeature] = useState({});
  const [editFeatureShowKeys, setEditFeatureShowKeys] = useState({});
  const [editFeatureName, setEditFeatureName] = useState({});
  const [featureVisible, setFeatureVisible] = useState(false);
  const [suppliesShow, setSuppliesShow] = useState("");
  const [taskInitName, setTaskInitName] = useState("");
  const [taskKey, setTaskKey] = useState("");
  const [dataSource, setDataSource] = useState({});
  //注册地图点击事件
  const onClick = e => {
    const { extra = {}, lnglat = {} } = e;
    let { key, target = {}, config = [] } = extra;
    if (key === "planLocationAlgo") {
      //覆盖物事件
      let demandFields = [];
      if (target.demandFieldNames) {
        demandFields = target.demandFieldNames.map((name, index) => {
          return {
            key: `${demandPrefix}${index}`,
            value: `${name}-加权平均距离`,
            status: 1
          };
        });
      }
      config = [
        { key: "name", value: "任务名称", status: 1 },
        ...demandFields,
        { key: "suppliesCost", value: "选址点订单热度-加权平均", status: 1 },
        { key: "objValue", value: "总加权目标值", status: 1 },
        { key: "longitude", value: "经度", status: 1 },
        { key: "latitude", value: "纬度", status: 1 }
      ];
      const params = setDetailInfo(config, target, key);
      dispatch(params);
    }
  };
  //算法返回结果时，需要进行重新渲染。后面需要想办法将算法结果解析逻辑移动到后端或者models里面
  useEffect(() => {
    let payload = [];
    results.map(result => {
      result &&
        result.plan &&
        JSON.parse(result.plan.planPosition).map(location => {
          let demandsValue = JSON.parse(result.plan.result)["meanDemands"];
          let demandsObj = {};
          for (let index = 0; index < demandsValue.length; index++) {
            demandsObj[`${demandPrefix}${index}`] = demandsValue[index];
          }
          let algoResult = JSON.parse(result.plan.result);
          payload.push({
            name: result.plan.planName,
            longitude: location[0],
            latitude: location[1],
            algoType: result.plan.algoType,
            objValue: algoResult["weightedTotal"],
            suppliesCost: algoResult["meanSupplies"],
            demandFieldNames: JSON.parse(result.plan.demandFields),
            ...demandsObj
          });
          return location;
        });
      return result;
    });
    if (results.length > 0) {
      let data = { payload, __config__: results[0].__config__ };
      WaterDropMarker.draw({
        data,
        key: "planLocationAlgo",
        viewPath: "algo/planLocation",
        OGs,
        map: gMap,
        onClick: onClick
      });
    }
  }, [locationPlan, onClick, results]);
  //城市或者数据源变更时，需要重新initial一些数据
  useEffect(() => {
    let task = getFieldValue("task");
    if (task) {
      let tmpDataSource = registedDataSources.filter(d => d.key == task)[0];
      setDataSource(tmpDataSource);
      if (tmpDataSource.features) {
        let supplies = tmpDataSource.features["supplies"];
        dispatch({
          type: "algo/locationPlan/addSupplies",
          payload: {
            key: supplies.key,
            data: supplies.value,
            ratio: supplies.ratio ? supplies.ratio : 1,
            name: supplies.name
          }
        });
      }
      setTaskInitName(
        `${tmpDataSource.bizTaskName}-${getFieldValue("algoType")}`
      );
    }
  }, [dispatch, getFieldValue, registedDataSources, taskKey]);
  useEffect(() => {
    dispatch({
      type: "algo/locationPlan/clearDemandsAndSupplies",
      payload: {}
    });
    props.form.resetFields();
    setTaskKey("");
  }, [curCity, dispatch, props.form]);
  //判断是否要更改任务名称
  useEffect(() => {
    let algo = MAP_LOCATION_PLAN_ALGOS[0];
    setSuppliesShow(algo ? algo.supplies : "");
    setTaskInitName(`${dataSource.bizTaskName}-${algo.name}`);
  }, [dataSource.bizTaskName]);
  const setDetailInfo = (config, payload, key) => {
    return {
      type: "algo/modalData/setData",
      payload: {
        detail: {
          visible: true,
          data: {
            config: [
              {
                key: "columnOne",
                view: [2, 1, 1],
                config: config
              }
            ],
            payload: {
              columnOne: payload
            }
          },
          key
        }
      }
    };
  };

  const checkFeautre = (checked, demand) => {
    if (checked) {
      dispatch({
        type: "algo/locationPlan/addDemands",
        payload: {
          key: demand.key,
          name: demand.name,
          data: demand.value.map(node => ({
            id: node.id,
            weight: node.weight,
            longitude: node.longitude,
            latitude: node.latitude
          })),
          ratio: demand.ratio ? demand.ratio : 1
        }
      });
    } else {
      dispatch({
        type: "algo/locationPlan/deleteDemands",
        payload: {
          key: demand.key
        }
      });
    }
  };
  const handleSubmit = e => {
    e.preventDefault();
    dispatch({
      type: "algo/locationPlan/compute",
      payload: {
        cityId: curCity.cityId,
        taskName: getFieldValue("taskName"),
        algoType: getFieldValue("algoType"),
        supplyCount: getFieldValue("supplyCount"),
        constrains: getFieldValue("constrains")
      }
    });
    closeAlgoModal();
    message.info(`${getFieldValue("taskName")}计算中`);
    props.form.resetFields();
    setTaskKey("");
  };
  const modifyFeautreValue = feature => {
    setEditFeature(feature);
    setFeatureVisible(true);
  };
  const saveFeature = ({ featureName, feature }) => {
    dispatch({
      type: "algo/locationPlan/modifyFeature",
      payload: {
        featureName,
        feature
      }
    });
  };
  const changeAlgoType = value => {
    let algo = MAP_LOCATION_PLAN_ALGOS.filter(a => a.value === value)[0];
    setSuppliesShow(algo ? algo.supplies : "");
    setTaskInitName(`${dataSource.bizTaskName}-${algo.name}`);
  };
  const { getFieldDecorator, getFieldValue } = props.form;
  const tasksSelect = registedDataSources.map(registedDataSource => (
    <Select.Option key={registedDataSource.key} value={registedDataSource.key}>
      {registedDataSource.bizTaskName}
    </Select.Option>
  ));
  let demandsSelect = "";
  let constrainSelect = "";
  let task = getFieldValue("task");
  if (task && dataSource.features) {
    let demands = dataSource.features["demands"];
    let supplies = dataSource.features["supplies"];
    demandsSelect = demands ? (
      getFieldDecorator("demands", { valuePropName: "checked" })(
        <Checkbox.Group style={{ width: "100%" }}>
          {Object.keys(demands).map(key => {
            let demand = demands[key];
            let existDemand = data.demands.filter(
              demand => demand.key == key
            )[0];
            return (
              <div key={key}>
                <Checkbox
                  key={key}
                  value={demand.key}
                  disabled={demand.value ? false : true}
                  onChange={checked => checkFeautre(checked, demand)}
                >
                  {demand.name}
                </Checkbox>
                {demand.value
                  ? existDemand && (
                      <span>
                        <a
                          onClick={() => {
                            setEditFeatureShowKeys([
                              "id",
                              "longitude",
                              "latitude",
                              "weight"
                            ]);
                            setEditFeatureName("demands");
                            modifyFeautreValue(
                              data.demands.filter(
                                demand => demand.key == key
                              )[0]
                            );
                          }}
                        >
                          查看
                        </a>
                      </span>
                    )
                  : "未加载数据"}
              </div>
            );
          })}
        </Checkbox.Group>
      )
    ) : (
      <div>未加载数据</div>
    );
    constrainSelect = supplies ? (
      getFieldDecorator("constrains", { valuePropName: "checked" })(
        <Checkbox.Group style={{ width: "100%" }}>
          {MAP_LOCATION_PLAN_CONSTRAIS.map(constrain => {
            return (
              <div key={constrain}>
                <Checkbox
                  key={constrain.key}
                  value={constrain.key}
                  disabled={!data.supplies[0] || data.supplies[0].length == 0}
                >
                  {constrain.name}
                </Checkbox>
                {data.supplies[0] ? (
                  <span>
                    <a
                      onClick={() => {
                        setEditFeatureShowKeys([
                          "id",
                          "longitude",
                          "latitude",
                          "orderCnt"
                        ]);
                        setEditFeatureName("supplies");
                        modifyFeautreValue(data.supplies[0]);
                      }}
                    >
                      查看
                    </a>
                  </span>
                ) : (
                  "未加载数据"
                )}
              </div>
            );
          })}
        </Checkbox.Group>
      )
    ) : (
      <div>未加载数据</div>
    );
  }

  return (
    <div>
      <Form
        layout="horizontal"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 12 }}
        onSubmit={handleSubmit}
      >
        <div className="base-info">
          <Item label="选址业务" className="base-info-item">
            {getFieldDecorator("task", {
              required: true,
              message: "请选择任务"
            })(
              <Select
                style={{ minWidth: "80px" }}
                showSearch
                size="default"
                placeholder="请选择选址业务"
                filterOption={false}
                onChange={e => {
                  console.log(e);
                  setTaskKey(e);
                }}
              >
                {tasksSelect}
              </Select>
            )}
          </Item>
          <Item label="选址算法" className="base-info-item">
            {getFieldDecorator("algoType", {
              required: true,
              message: "请选择算法",
              initialValue: MAP_LOCATION_PLAN_ALGOS[0].value
            })(
              <Select
                style={{ minWidth: "80px" }}
                showSearch
                size="default"
                placeholder="请选择算法"
                filterOption={false}
                onChange={changeAlgoType}
              >
                {MAP_LOCATION_PLAN_ALGOS.map(algo => (
                  <Select.Option
                    key={algo.key}
                    value={algo.value}
                    title={algo.name}
                  >
                    {algo.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Item>
          <Item label="需求节点" className="base-info-item">
            {demandsSelect}
          </Item>
          <Item label="供给节点" className="base-info-item">
            <div>{suppliesShow}</div>
          </Item>
          <Item label="其他约束" className="base-info-item">
            {constrainSelect}
          </Item>
          <Item label="设施个数" className="base-info-item">
            {getFieldDecorator("supplyCount", { initialValue: 1 })(
              <InputNumber min={1} max={20} />
            )}
          </Item>
          <Item label="任务名称" className="base-info-item">
            {getFieldDecorator("taskName", {
              initialValue: taskInitName,
              required: true,
              message: "请输入任务名称"
            })(<Input placeholder="业务-算法-参数" />)}
          </Item>
          <Item wrapperCol={{ span: 12, offset: 6 }}>
            <Button type="primary" htmlType="submit" loading={submitDisabled}>
              计算
            </Button>
          </Item>
        </div>
      </Form>
      <Modal
        visible={featureVisible}
        okText="保存"
        cancelText="取消"
        footer={null}
        closable
        onCancel={() => setFeatureVisible(false)}
        maskClosable
      >
        <FeatureEditor
          feature={editFeature}
          showKeys={editFeatureShowKeys}
          name={editFeatureName}
          saveFeature={saveFeature}
        />
      </Modal>
    </div>
  );
}

export default connect(state => ({
  locationPlan: state.algo.locationPlan
}))(Form.create()(LocationPlan));
