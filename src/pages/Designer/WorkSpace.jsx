import React, { useState, useEffect } from "react";
import antComponents from "./dragRegion";
import { withRouter } from "react-router-dom";
import { fromJS } from "immutable";
import {
  Collapse,
  Form,
  Table,
  Button,
  Tag,
  Input,
  InputNumber,
  Alert,
  Select,
  Checkbox,
  Affix
} from "antd";
import { connect } from "dva";
import _ from "lodash";
import NativeListener from "react-native-listener";
import ColorPicker from "rc-color-picker";
import { Rnd } from "react-rnd";
import FilterDrawer from "@/components/FilterDrawer";
import divCom from "./comsConfig/div";
import RenderEditor from "./RenderEditor";
import "rc-color-picker/assets/index.css";
import styles from "./WorkSpace.less";
const Panel = Collapse.Panel;

function Editor(props) {
  const [draggingData, setDraggingData] = useState(null);
  const [showAddList, setShowAddList] = useState(false);
  const [hasBeginEdit, setHasBeginEdit] = useState(false);
  const [addListData, setAddListData] = useState({});
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const {
    dispatch,
    markOverlay,
    editCom,
    activeTargetCom,
    layerDragging,
    match = {}
  } = props;
  const {
    params: { pageId }
  } = match;
  const {
    x: markOverlayX,
    y: markOverlayY,
    show: markOverlayShow,
    width: markOverlayWidth,
    height: markOverlayHeight,
    isTop: markOverlayIsTop
  } = markOverlay;
  const propsHandlerChange = (keyPath, value) => {
    if (dispatch) {
      let curEditCom = fromJS(editCom);
      curEditCom = curEditCom.setIn(keyPath, value);
      dispatch({
        type: "page/updateCompProps",
        payload: curEditCom
      });
      dispatch({
        type: "page/setCurEditCom",
        payload: curEditCom.toJS()
      });
    }
  };
  useEffect(() => {
    dispatch({
      type: "page/fetchConfigTree",
      payload: {
        id: pageId
      }
    });
  }, [dispatch, pageId]);
  useEffect(() => {
    divCom.id = `uiControl_${Number(
      Math.random()
        .toString()
        .substr(3, 0) + Date.now()
    )
      .toString(36)
      .toUpperCase()}`;
    divCom.keyPath = [0];
    if (dispatch) {
      dispatch({
        type: "page/setConfigTree",
        payload: [divCom]
      });
    }
    setTimeout(() => {
      setHasBeginEdit(true);
    }, 3000);
  }, [dispatch]);
  const onMouseUpHandler = () => {
    dispatch({
      type: "page/setLayerDragging",
      payload: false
    });
  };
  const onMouseMoveHandler = e => {
    if (layerDragging) {
      e.stopPropagation();
      setMouseX(e.clientX);
      setMouseY(e.clientY);
      document.getElementById("dragdiv").style.left = mouseX - 5 + "px";
      document.getElementById("dragdiv").style.top = mouseY - 5 + "px";
      if (!activeTargetCom.getIn(["props", "style"]) && dispatch) {
        dispatch({
          type: "page/setActiveTargetCom",
          payload: activeTargetCom.setIn(["props", "style"], fromJS({})).toJS()
        });
      }
      const width = mouseX + 5 - markOverlayX;
      const height = mouseY + 5 - markOverlayY;
      if (dispatch) {
        const activeTargetComTemp = activeTargetCom
          .setIn(["props", "style", "height"], height)
          .setIn(["props", "style", "width"], width);
        dispatch({
          type: "page/updateCompProps",
          payload: activeTargetComTemp
        });
        dispatch({
          type: "page/setMarkOverlay",
          payload: fromJS({
            width,
            height
          })
        });
      }
    }
  };
  function renderEnumObject(editcom, key) {
    const props = _.cloneDeep(editcom.props[key]);
    let config = editcom.config[key].enumobject;
    if (config.type === "relativePropsObject") {
      config = editcom.props[config.target];
    }
    return (
      <div>
        <div
          style={{
            marginTop: 10,
            marginBottom: 10,
            fontWeight: "bold",
            fontSize: 20
          }}
        >
          {editcom.config[key].text}
        </div>
        <Table
          pagination={false}
          bordered={true}
          size={"small"}
          columns={config.concat([
            {
              key: "xx",
              dataIndex: "xx",
              title: "操作",
              render: (text, record, index) => {
                return (
                  // eslint-disable-next-line jsx-a11y/anchor-is-valid
                  <a
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      props.splice(index, 1);
                      propsHandlerChange(["props", key], props);
                    }}
                  >
                    删除
                  </a>
                );
              }
            }
          ])}
          dataSource={props}
        />
        <Button
          icon="plus"
          style={{ marginTop: 10 }}
          onClick={() => {
            setAddListData({});
            setShowAddList(true);
          }}
        >
          添加一项
        </Button>
        {showAddList ? (
          <Form layout={"horizontal"}>
            {config.map(c => {
              return (
                <Form.Item label={c.title} style={{ marginBottom: 5 }}>
                  {(() => {
                    if (c.type === "String")
                      return (
                        <Input
                          placeholder={c.title}
                          onInput={v => {
                            addListData[c.dataIndex] = v.target.value + "";
                          }}
                        ></Input>
                      );
                    if (c.type === "Number")
                      return (
                        <InputNumber
                          onChange={v => {
                            addListData[c.dataIndex] = v;
                          }}
                        ></InputNumber>
                      );
                    if (c.type === "Boolean")
                      return (
                        <Checkbox
                          onChange={v => {
                            addListData[c.dataIndex] = v;
                          }}
                        ></Checkbox>
                      );
                    else
                      return (
                        <Input
                          placeholder={c.title}
                          onInput={v => {
                            addListData[c.dataIndex] = v.target.value + "";
                          }}
                        ></Input>
                      );
                  })()}
                </Form.Item>
              );
            })}
            <Form.Item label="" style={{ marginBottom: 5 }}>
              <Button
                type="primary"
                onClick={() => {
                  setShowAddList(false);
                  if (editcom.sub_type === "tableContainer") {
                    addListData.childrens = [
                      {
                        type: "div",
                        title: "通用布局块",
                        isNativeDom: true,
                        isContainer: true,
                        props: {
                          style: {
                            minHeight: 20,
                            padding: "0px"
                          }
                        },
                        config: {
                          padding: {
                            text: "内间距",
                            type: "boundary"
                          },
                          margin: {
                            text: "外边距",
                            type: "boundary"
                          },
                          backgroundColor: {
                            text: "背景色"
                          }
                        }
                      }
                    ];
                  }
                  props.push(addListData);
                  setAddListData({});
                  propsHandlerChange(["props", key], props);
                }}
              >
                提交
              </Button>
            </Form.Item>
          </Form>
        ) : null}
      </div>
    );
  }

  return (
    <>
      <div className={styles.editor}>
        <Rnd
          default={{
            x: 50,
            y: 150,
            width: 320,
            height: 200
          }}
          className={styles.compContainers}
        >
          <div className={styles.compDragContainer}>
            <header className={styles.header}>组件拖控区</header>
            <Collapse
              className={styles.container}
              defaultActiveKey={["0", "output"]}
              onChange={() => {}}
            >
              {antComponents.map((group, i) => {
                return (
                  <>
                    {group.coms.map((com, i2) => {
                      return (
                        <Tag
                          onDragStart={ev => {
                            setHasBeginEdit(true);
                            setDraggingData(com);
                          }}
                          draggable={true}
                          key={i + "" + i2}
                        >
                          {com.type} {com.title}
                        </Tag>
                      );
                    })}
                  </>
                );
              })}
            </Collapse>
          </div>
        </Rnd>
      </div>
      <Affix>
        <Button
          type="primary"
          onClick={() => {
            dispatch({
              type: "page/updateConfigTree",
              payload: {
                id: pageId
              }
            });
          }}
        >
          保存
        </Button>
      </Affix>
      <div
        style={{ display: "flex" }}
        className={styles.editor}
        onMouseMove={e => {
          onMouseMoveHandler(e);
        }}
        onMouseUp={() => {
          onMouseUpHandler();
        }}
      >
        <div
          className={styles.editLayer}
          onClick={e => {
            console.log(1, e);
          }}
          style={{
            zIndex: markOverlayIsTop ? 1000 : -10,
            display: markOverlayShow ? "block" : "none",
            width: markOverlayWidth,
            height: markOverlayHeight,
            left: markOverlayX,
            top: markOverlayY,
            pointerEvents: "none"
          }}
        >
          <div
            color="#f50"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              padding: "3px 10px",
              backgroundColor: "#999",
              color: "#fff"
            }}
          >
            {activeTargetCom.get("title")}
          </div>
        </div>
        <NativeListener
          onMouseDown={e => {
            e.stopPropagation();
            dispatch({
              type: "page/setLayerDragging",
              payload: true
            });
          }}
        >
          <div
            id="dragdiv"
            style={{
              width: 10,
              height: 10,
              background: "#aaa",
              position: "absolute",
              zIndex: 100000
            }}
          ></div>
        </NativeListener>
        <div style={{ flex: 1, position: "relative" }}>
          {!hasBeginEdit ? (
            <div
              style={{
                position: "absolute",
                top: 25,
                width: "100%",
                textAlign: "center",
                fontSize: 20,
                color: "#aaa"
              }}
            >
              设计板，拖拽元素到此，点击元素可以编辑属性，红色虚线区域可以放置子组件
            </div>
          ) : null}
          <RenderEditor draggingData={draggingData} design={true} />
        </div>

        <FilterDrawer
          className={styles.designerFilterDrawer}
          title={`${editCom.title || ""}-[${editCom.id || ""}]`}
          width={350}
        >
          <div style={{ minHeight: "30px", background: "#fff" }}>
            {editCom.type ? (
              <Button
                onClick={() => {
                  editCom.hasDelete = true;
                  dispatch({
                    type: "page/setCurEditCom",
                    payload: editCom
                  });
                  propsHandlerChange(["hasDelete"], true);
                }}
                style={{ marginRight: 20 }}
              >
                删除此元素
              </Button>
            ) : null}
            {editCom && editCom.config ? (
              Object.keys(editCom.config).map(key => {
                if (key === "style") {
                  var style = editCom.config.style;

                  return Object.keys(editCom.config.style).map(s => {
                    if (style[s].type === "color") {
                      return (
                        <Form.Item
                          label={editCom.config[key][s].text}
                          style={{ marginBottom: 5 }}
                        >
                          <ColorPicker
                            color={editCom.props.style[s] || "#fff"}
                            onChange={c => {
                              propsHandlerChange(
                                ["props", "style", s],
                                c.color
                              );
                            }}
                            placement="topRight"
                          />
                        </Form.Item>
                      );
                    } else if (style[s].type === "boundary") {
                      let value4EditResult = {};
                      const defaultValue = editCom.props.style[s] || "0";
                      if (defaultValue.toString().indexOf(" ") === -1) {
                        value4EditResult[s] = [
                          defaultValue,
                          defaultValue,
                          defaultValue,
                          defaultValue
                        ];
                      } else {
                        value4EditResult[s] = defaultValue.split(" ");
                      }
                      return (
                        <Form.Item
                          label={editCom.config.style[s].text}
                          style={{ marginBottom: 5 }}
                        >
                          上：
                          <Input
                            defaultValue={value4EditResult[s][0]}
                            onChange={v => {
                              value4EditResult[s][0] = v.target.value;
                              propsHandlerChange(
                                ["props", "style", s],
                                value4EditResult[s].join(" ")
                              );
                            }}
                            style={{ width: 50, marginRight: 5 }}
                          ></Input>
                          右：
                          <Input
                            defaultValue={value4EditResult[s][1]}
                            onChange={v => {
                              value4EditResult[s][1] = v.target.value;
                              propsHandlerChange(
                                ["props", "style", s],
                                value4EditResult[s].join(" ")
                              );
                            }}
                            style={{ width: 50, marginRight: 5 }}
                          ></Input>
                          下：
                          <Input
                            defaultValue={value4EditResult[s][2]}
                            onChange={v => {
                              value4EditResult[s][2] = v.target.value;
                              propsHandlerChange(
                                ["props", "style", s],
                                value4EditResult[s].join(" ")
                              );
                            }}
                            style={{ width: 50, marginRight: 5 }}
                          ></Input>
                          左：
                          <Input
                            defaultValue={value4EditResult[s][3]}
                            onChange={v => {
                              value4EditResult[s][3] = v.target.value;
                              propsHandlerChange(
                                ["props", "style", s],
                                value4EditResult[s].join(" ")
                              );
                            }}
                            style={{ width: 50 }}
                          ></Input>
                        </Form.Item>
                      );
                    } else {
                      return (
                        <Form.Item
                          label={editCom.config[key][s].text}
                          style={{ marginBottom: 5 }}
                        >
                          <Input
                            defaultValue={editCom.props[key][s]}
                            onChange={v => {
                              propsHandlerChange(
                                ["props", key, s],
                                v.target.value
                              );
                            }}
                          ></Input>
                        </Form.Item>
                      );
                    }
                  });
                } else if (editCom.config[key].enumobject) {
                  return renderEnumObject(editCom, key);
                } else if (editCom.config[key].dispather) {
                  return (
                    <Form.Item
                      label={editCom.config[key].text}
                      style={{ marginBottom: 5 }}
                    >
                      <Input
                        defaultValue={editCom.props[key].uiControlId}
                        onChange={v => {
                          propsHandlerChange(
                            ["props", key, "uiControlId"],
                            v.target.value
                          );
                        }}
                      ></Input>
                    </Form.Item>
                  );
                } else {
                  return (
                    <Form.Item
                      label={editCom.config[key].text}
                      style={{ marginBottom: 5 }}
                    >
                      {(() => {
                        if (editCom.config[key].enum) {
                          return (
                            <Select
                              defaultValue={editCom.props[key]}
                              style={{ width: 120 }}
                              onChange={v => {
                                propsHandlerChange(
                                  ["props", key],
                                  v === "true"
                                    ? true
                                    : v === "false"
                                    ? false
                                    : v
                                );
                              }}
                            >
                              {editCom.config[key].enum.map(n => {
                                return (
                                  <Select.Option value={n}>{n}</Select.Option>
                                );
                              })}
                            </Select>
                          );
                        } else if (editCom.config[key].type === "Boolean") {
                          return (
                            <Checkbox
                              checked={editCom.props[key]}
                              onChange={v => {
                                propsHandlerChange(
                                  ["props", key],
                                  v.target.checked
                                );
                              }}
                            />
                          );
                        } else if (key === "content") {
                          return (
                            <Input
                              defaultValue={editCom.props[key]}
                              onChange={v => {
                                propsHandlerChange(
                                  ["props", key],
                                  v.target.value
                                );
                              }}
                            ></Input>
                          );
                        } else {
                          return (
                            <Input
                              defaultValue={editCom.props[key]}
                              onChange={v => {
                                propsHandlerChange(
                                  ["props", key],
                                  v.target.value
                                );
                              }}
                            ></Input>
                          );
                        }
                      })()}
                    </Form.Item>
                  );
                }
              })
            ) : (
              <Alert
                message="此组件无可编辑属性"
                type="warning"
                style={{ marginTop: 20 }}
              ></Alert>
            )}
          </div>
        </FilterDrawer>
      </div>
    </>
  );
}
export default withRouter(
  connect(({ page }) => ({
    configTree: page.get("configTree"),
    markOverlay: page.get("markOverlay").toJS(),
    editCom: page.get("curEditCom"),
    activeTargetCom: page.get("activeTargetCom"),
    layerDragging: page.get("layerDragging")
  }))(Editor)
);
