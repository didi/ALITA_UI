import { Reducer } from "redux";
import { fromJS } from "immutable";
import { Effect } from "dva";
import * as API from "@/services";

export interface DataSourceDataState {
  [propName: string]: any;
}

export interface PageModeActiveTargetComState {
  [propName: string]: any;
}

export interface PageModelType {
  namespace: "dataSource";
  state: DataSourceDataState;
  reducers: {
    injectData: Reducer<DataSourceDataState>;
  };
  effects: {
    triggerLoadData: Effect;
  };
}

const DataSourceModel: PageModelType = {
  namespace: "dataSource",
  state: fromJS({}),
  reducers: {
    injectData(state: any, { payload }) {
      const key = payload.get("key");
      return state.setIn([key], payload.get("data"));
    }
  },
  effects: {
    *triggerLoadData({ payload }, { call, put }) {
      const { pointChecked, lineChecked, planeChecked, cityId } = payload || {};
      let polygons = {},
        pointList = {},
        heatLines = {};
      const data = yield call(API.fetchData, {
        url: "/alita/data/select",
        type: "get",
        cityId
      });
      yield put({
        type: "dataSource/injectData",
        payload: fromJS({ key: "selectData", data: data })
      });
      if (pointChecked)
        pointList = yield call(API.fetchData, {
          url: "/alita/data/point/list/",
          type: "post",
          cityId
        });
      if (planeChecked)
        polygons = yield call(API.fetchData, {
          url: "/alita/data/plane/list/",
          type: "post",
          cityId
        });
      if (lineChecked)
        heatLines = yield call(API.fetchData, {
          url: "/alita/data/line/list/",
          type: "post",
          cityId
        });
      yield put({
        type: "dataSource/injectData",
        payload: fromJS({
          key: "mapEngine",
          data: {
            pointList,
            polygons,
            heatLines
          }
        })
      });

      const brands = yield call(API.fetchData, {
        url: "/alita/data/brands/",
        type: "get"
      });
      yield put({
        type: "dataSource/injectData",
        payload: fromJS({ key: "brands", data: brands })
      });
    }
  }
};

export default DataSourceModel;
