import { Reducer } from "redux";
import React from "react";
import { fromJS, List, Record } from "immutable";
import { Effect } from "dva";
import { notification, Icon } from "antd";
import * as API from "@/services";

interface PageModelState {
  uiControls: PageModelUIControlState;
  configTree: PageModelConfigTreeState;
  markOverlay: PageModeMarkOverlayState;
  curEditCom: PageModeCurEditComState;
  activeTargetCom: PageModeActiveTargetComState;
  layerDragging: boolean;
  comsIndex: Record<PageModelComIndex>;
}

export type PageModelStateType = Record<PageModelState> & PageModelState;

export interface PageModelConfigTreeState {
  [propName: string]: any | [];
  childrens?: [];
}

export interface PageModelComIndex {
  [id: string]: any;
}

export interface PageModelUIControlState {
  [propName: string]: any;
}

export interface PageModeActiveTargetComState {
  [propName: string]: any;
}

export interface PageModeMarkOverlayState {
  x: number;
  y: number;
  show: boolean;
  width: number;
  height: number;
  isTop: boolean;
}

export interface PageModeCurEditComState {
  [propName: string]: any;
}

export interface PageModelType {
  namespace: "page";
  state: PageModelState;
  reducers: {
    setUiControl: Reducer<PageModelStateType>;
    updateUiControl: Reducer<PageModelStateType>;
    setConfigTree: Reducer<PageModelStateType>;
    addCompToConfigTree: Reducer<PageModelStateType>;
    updateCompProps: Reducer<PageModelStateType>;
    setMarkOverlay: Reducer<PageModelStateType>;
    setCurEditCom: Reducer<PageModelStateType>;
    setActiveTargetCom: Reducer<PageModelStateType>;
    setLayerDragging: Reducer<PageModelStateType>;
  };
  effects: {
    fetchConfigTree: Effect;
    updateConfigTree: Effect;
  };
}

const initailRoot: PageModelState = {
  uiControls: fromJS({}),
  configTree: fromJS([]),
  markOverlay: fromJS({
    x: 0,
    y: 0,
    show: false,
    width: 0,
    height: 0,
    isTop: false
  }),
  curEditCom: {},
  activeTargetCom: fromJS({}),
  layerDragging: false,
  comsIndex: fromJS({})
};

// if (localStorage.getItem("configTreeCache")) {
//   initailRoot.configTree = fromJS(
//     JSON.parse(localStorage.getItem("configTreeCache") || "")
//   );
// }

const initialState = Record<PageModelState>(initailRoot)();

const PageModel: PageModelType = {
  namespace: "page",
  state: initialState,
  reducers: {
    setUiControl(state: any, { payload }) {
      // state.uiControls[payload.id] = {
      //   ...state.uiControls[payload.id],
      //   ...payload
      // };
      const var1 = state.getIn(["uiControls", payload.id]).toJS();
      let var2 = { ...var1, ...payload };
      if (payload.type === "switch") {
        var2 = { ...var1, ...payload, visible: !var1 ? true : !var1.visible };
      }
      return state.mergeDeepIn(["uiControls", payload.id], fromJS(var2));
    },
    updateUiControl(state: any, { payload }) {
      const id = payload.get("id");
      // 新增
      const originUiControl = state.getIn(["uiControls", id]);
      const originPayload = payload.toJS();
      if (!originUiControl) {
        return state.setIn(["uiControls", id], payload.get("data"));
      } else {
        //更新
        let data = { ...originUiControl.toJS(), ...originPayload.data };
        return state.updateIn(["uiControls", id], () => {
          return fromJS(data);
        });
      }
    },
    setConfigTree(state: any, { payload }) {
      return state.set("configTree", fromJS(payload));
    },
    setMarkOverlay(state: any, { payload }) {
      return state.setIn(
        ["markOverlay"],
        fromJS({
          ...state.getIn(["markOverlay"]).toJS(),
          ...payload.toJS()
        })
      );
    },
    setCurEditCom(state: any, { payload }) {
      const cur = state.getIn(["curEditCom"]);
      if (cur.id !== payload.id) {
        return state.setIn(["curEditCom"], {
          ...payload
        });
      } else {
        return state.setIn(["curEditCom"], {
          ...state.getIn(["curEditCom"]),
          ...payload
        });
      }
    },
    setActiveTargetCom(state: any, { payload }) {
      return state.set("activeTargetCom", payload);
    },
    setLayerDragging(state: any, { payload }) {
      return state.set("layerDragging", payload);
    },
    addCompToConfigTree(state: any, { payload }) {
      const keyPath: Array<string | number> = payload.keyPath.toJS();
      const keyPathNew: Array<string | number> = [];
      for (const item of keyPath) {
        keyPathNew.push(item);
        keyPathNew.push("childrens");
      }
      const curCom = payload.com;
      const val1 = state.updateIn(
        ["configTree", ...keyPathNew],
        (childrens: any = List()) => {
          return childrens.push(curCom);
        }
      );
      const var2 = val1.updateIn(["comsIndex"], (item: any = Record({})) => {
        return item.set(
          curCom.get("id"),
          Record({
            keyPath: ["configTree", ...keyPathNew],
            title: curCom.get("title"),
            type: curCom.get("type")
          })
        );
      });
      return var2;
    },
    updateCompProps(state: any, { payload }) {
      const keyPath: Array<string | number> = payload.get("keyPath").toJS();
      const keyPathNew: Array<string | number> = [];
      for (let i = 0; i < keyPath.length; i++) {
        keyPathNew.push(keyPath[i]);
        if (i < keyPath.length - 1) {
          keyPathNew.push("childrens");
        }
      }
      return state.updateIn(["configTree", ...keyPathNew], () => {
        return payload;
      });
    }
  },
  effects: {
    *fetchConfigTree({ payload }, { call, put }) {
      const { id } = payload;
      const { pageProps } = yield call(API.fetchPage, { id });
      if (!pageProps) {
        return;
      }
      yield put({
        type: "page/setConfigTree",
        payload: JSON.parse(pageProps)
      });
    },
    *updateConfigTree({ payload }, { call, put, select }) {
      const state = yield select();
      console.info(state);
      const { id } = payload;
      const data = yield call(API.updatePage, {
        id,
        pageProps: JSON.stringify(state.page.get("configTree").toJS())
      });
      if (data === "true") {
        notification.success({
          message: "通知",
          description: "保存成功"
        });
      } else {
        notification.error({
          message: "通知",
          description: "保存失败"
        });
      }
    }
  }
};

export default PageModel;
