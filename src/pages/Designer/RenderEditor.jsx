import React, { Component, useEffect } from "react";
import { fromJS, List } from "immutable";
import classnames from "classnames";
import NativeListener from "react-native-listener";
import { connect } from "dva";
import { getDOMPOS } from "@/utils/common";
import { toJS } from "./utils/hoc";
const { default: antd } = require("../../components/index.jsx");

function RenderEditor(props) {
  const { configTree, dispatch, draggingData, layerDragging, design } = props;
  const data = configTree;

  useEffect(() => {
    if (design) {
      localStorage.setItem(
        "configTreeCache",
        JSON.stringify(configTree.toJS())
      );
    }
  }, [configTree, design]);
  function findCanDropTarget(target) {
    if (target.className.indexOf("draggable") != -1) {
      return target;
    } else {
      return findCanDropTarget(target.parentNode);
    }
  }
  function generateUIControlId() {
    return `uiControl_${Number(
      Math.random()
        .toString()
        .substr(3, 0) + Date.now()
    )
      .toString(36)
      .toUpperCase()}`;
  }
  function _getComponent(types) {
    if (types.length === 1) {
      return antd[types[0]];
    } else if (types.length > 1) {
      const lastT = types.pop();
      const com = _getComponent(types)[lastT];
      return com;
    } else {
      return null;
    }
  }
  function showLayer(target, d) {
    if (target.offsetParent) {
      const pos = getDOMPOS(target);
      if (dispatch) {
        dispatch({
          type: "page/setMarkOverlay",
          payload: fromJS({
            x: pos.x,
            y: pos.y,
            width: target.offsetWidth,
            height: target.offsetHeight,
            show: true,
            isTop: true
          })
        });
        dispatch({
          type: "page/setActiveTargetCom",
          payload: fromJS(d)
        });
      }
      document.getElementById("dragdiv").style.left =
        target.offsetWidth + pos.x - 10 + "px";
      document.getElementById("dragdiv").style.top =
        target.offsetHeight + pos.y - 10 + "px";
    }
  }

  function hideLayer() {
    if (dispatch) {
      dispatch({
        type: "page/setMarkOverlay",
        payload: fromJS({
          show: false
        })
      });
    }
  }

  function renderJSON(json) {
    return json.map((d, i) => {
      if (d.get("hasDelete")) return null;
      var component;
      if (d.get("isNativeDom")) {
        component = d.get("type");
      } else {
        component = _getComponent(d.get("type").split("."));
      }

      const draggableProps = {};
      if (d.get("isContainer")) {
        draggableProps.className = "draggable";
        draggableProps.onDragOver = e => {
          e.preventDefault();
        };
        draggableProps.onDrop = e => {
          e.preventDefault();
          e.stopPropagation();
          findCanDropTarget(e.target).className = findCanDropTarget(
            e.target
          ).className.replace("isdroping", "");
          const keyPath = List(d.get("keyPath")).concat(
            d.get("childrens") ? d.get("childrens").count() : List([0])
          );
          let com = fromJS(draggingData);
          com = com.set("id", generateUIControlId());
          com = com.set("keyPath", keyPath);

          if (com.get("sub_type") === "tableContainer") {
            // @todo 后续支持
            com = com.updateIn(["props", "columns"], (columns = List()) => {
              return columns.map(column => {
                return column.set(
                  "childrens",
                  column.get("childrens").map((item, index) => {
                    let itemNew = item.set("id", generateUIControlId());
                    itemNew = item.set(
                      "keyPath",
                      List(keyPath).concat([index])
                    );
                    return itemNew;
                  })
                );
              });
            });
          } else {
            com = com.update("childrens", (childrens = List()) => {
              return childrens.map((item, index) => {
                let itemNew = item.set("id", generateUIControlId());
                itemNew = item.set("keyPath", List(keyPath).concat([index]));
                return itemNew;
              });
            });
          }

          if (dispatch) {
            dispatch({
              type: "page/addCompToConfigTree",
              payload: {
                keyPath: d.get("keyPath"),
                com
              }
            });
          }
        };
        draggableProps.onDragOver = e => {
          e.preventDefault();
          if (
            findCanDropTarget(e.target).className.indexOf("isdroping") == -1
          ) {
            findCanDropTarget(e.target).className += " isdroping";
          }
        };
        draggableProps.onDragLeave = e => {
          e.preventDefault();
          findCanDropTarget(e.target).className = findCanDropTarget(
            e.target
          ).className.replace("isdroping", "");
        };
      }
      var outerProps = {};
      if (design) {
        outerProps.onMouseOver = e => {
          e.stopPropagation();
          e.preventDefault();
          if (!layerDragging) {
            showLayer(e.target, d);
          }
        };
        outerProps.onMouseLeave = e => {
          e.stopPropagation();
          if (!layerDragging) {
            hideLayer();
          }
        };
        outerProps.onClick = e => {
          e.preventDefault();
          e.stopPropagation();
          dispatch({
            type: "page/setCurEditCom",
            payload: d.toJS()
          });
        };
      }

      var realProps = Object.assign({}, d.get("props").toJS());
      Object.keys(realProps).forEach(key => {
        if (realProps.hasOwnProperty(key)) {
          if (
            typeof realProps[key] === "object" &&
            realProps[key].type === "relative"
          ) {
            realProps[key] = realProps[realProps[key].target]
              ? realProps[key].true
              : realProps[key].false;
          }
        }
      });
      if (d.get("sub_type") === "tableContainer") {
        realProps.columns = realProps.columns.map(c => {
          if (c.childrens) {
            c.render = () => {
              return renderJSON(fromJS(c.childrens));
            };
          } else if (c.type === "图文") {
            c.render = () => {
              return (
                <div>
                  <img
                    alt="alt"
                    src={
                      "http://img.souche.com/20170406/jpg/9f9728decb009c757729c4fb712c0a6e.jpg"
                    }
                    style={{
                      width: 53,
                      height: 40,
                      verticalAlign: "top"
                    }}
                  />{" "}
                  <span
                    style={{
                      verticalAlign: "top",
                      lineHeight: "40px",
                      display: "inline-block",
                      marginLeft: 10
                    }}
                  >
                    {" "}
                    {c.title}{" "}
                  </span>{" "}
                </div>
              );
            };
          } else if (c.type === "图片") {
            c.render = () => {
              return (
                <img
                  alt=""
                  src={
                    "http://img.souche.com/20170406/jpg/9f9728decb009c757729c4fb712c0a6e.jpg"
                  }
                  style={{
                    width: 53,
                    height: 40,
                    verticalAlign: "top"
                  }}
                />
              );
            };
          } else if (c.type === "链接") {
            c.render = () => {
              return <a> 动作 </a>;
            };
          }
          return c;
        });
      }
      const { className } = realProps;
      if (className) {
        realProps.className = classnames(className, { design: design });
      } else {
        realProps.className = classnames({ design: design });
      }
      if (d.get("wrap_inner")) {
        return (
          <NativeListener {...outerProps}>
            {" "}
            {React.createElement(component, realProps, [
              <div
                {...draggableProps}
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: 20,
                  minWidth: 20
                }}
              >
                {" "}
                {realProps.content
                  ? [realProps.content]
                  : d.get("childrens")
                  ? renderJSON(d.get("childrens"))
                  : null}{" "}
              </div>
            ])}{" "}
          </NativeListener>
        );
      } else if (d.get("wrap")) {
        function getDisplayName(component) {
          return component.displayName || component.name || "Component";
        }
        const hoc = function(componentName) {
          return class extends Component {
            static displayName = `HOC(${getDisplayName(componentName)})`;
            render() {
              const {
                childrensData,
                content,
                dispather,
                uiControlProps,
                ...restProps
              } = this.props;
              const { dispatch, id } = this.props;
              const rtListenerProps = {};
              // @todo 目前先支持modal
              if (!design) {
                rtListenerProps.onCancel = () => {
                  if (dispatch) {
                    const payload = fromJS({
                      id,
                      data: {
                        visible: false
                      }
                    });
                    dispatch({
                      type: "page/updateUiControl",
                      payload
                    });
                  }
                };
              }
              return (
                <>
                  <NativeListener {...outerProps}>
                    <div
                      {...draggableProps}
                      style={{
                        position: "fixed",
                        zIndex: 10000,
                        display: "none",
                        top: "50px",
                        width: "200px",
                        height: "35px",
                        minHeight: 20,
                        minWidth: 20
                      }}
                    >
                      {" "}
                      {React.createElement(
                        component,
                        { ...restProps, ...rtListenerProps, ...uiControlProps },
                        content
                          ? [content]
                          : childrensData && childrensData.length > 0
                          ? renderJSON(fromJS(childrensData))
                          : null
                      )}
                    </div>{" "}
                  </NativeListener>
                </>
              );
            }
          };
        };

        const Comp = connect(state => {
          const uiControlProps = state.page.uiControls.get(d.get("id"));
          return {
            ...realProps,
            uiControlProps,
            keyPath: d.get("keyPath"),
            id: d.get("id"),
            childrensData: d.get("childrens")
          };
        })(toJS(hoc(component)));
        return <Comp />;
      } else {
        Object.assign(realProps, draggableProps);

        function getDisplayName(component) {
          return component.displayName || component.name || "Component";
        }
        const hoc = function(componentName) {
          return class extends Component {
            static displayName = `HOC(${getDisplayName(componentName)})`;
            render() {
              const {
                childrensData,
                content,
                dispather,
                uiControlProps,
                asyncData,
                ...restProps
              } = this.props;
              let data;
              if (asyncData) {
                data = asyncData;
              } else {
                data = this.props.data;
              }
              const rtListenerProps = {};
              const { dispatch } = this.props;
              if (dispather && !design) {
                rtListenerProps.onClick = () => {
                  const payload = fromJS({
                    id: dispather,
                    data: {
                      visible: true
                    }
                  });
                  dispatch({
                    type: "page/updateUiControl",
                    payload
                  });
                };
              }
              return (
                <>
                  <NativeListener {...outerProps}>
                    {React.createElement(
                      component,
                      {
                        ...restProps,
                        ...rtListenerProps,
                        ...uiControlProps,
                        data
                      },
                      content
                        ? [content]
                        : childrensData && childrensData.length > 0
                        ? renderJSON(fromJS(childrensData))
                        : null
                    )}
                  </NativeListener>
                </>
              );
            }
          };
        };
        const Comp = connect(state => {
          const uiControlProps = state.page.uiControls.get(d.get("id"));
          const ascynIndentify = d.getIn(["props", "asyncData"]);
          const asyncData = state.dataSource.get(ascynIndentify);
          return {
            ...realProps,
            uiControlProps,
            keyPath: d.get("keyPath"),
            id: d.get("id"),
            asyncData,
            childrensData: d.get("childrens")
          };
        })(toJS(hoc(component)));
        return <Comp />;
      }
    });
  }
  return <> {renderJSON(data)} </>;
}

export default connect(({ page }) => ({
  configTree: page.get("configTree"),
  editCom: page.get("curEditCom"),
  layerDragging: page.get("layerDragging")
}))(RenderEditor);
