import { Reducer } from "redux";
import { fromJS } from "immutable";
import { Effect } from "dva";
import * as API from "@/services";

export interface ApplicationDataState {
  [propName: string]: any;
}

export interface PageModelType {
  namespace: "application";
  state: ApplicationDataState;
  reducers: {
    setApplication: Reducer<ApplicationDataState>;
  };
  effects: {
    fetchApplication: Effect;
  };
}

const ApplicationModel: PageModelType = {
  namespace: "application",
  state: fromJS({}),
  reducers: {
    setApplication(state: any, { payload }) {
      const key = payload.get("key");
      return state.setIn([key], payload.get("data"));
    }
  },
  effects: {
    *fetchApplication({ payload }, { call, put }) {
      const { id } = payload;
      const app = yield call(API.fetchApplication, { id });
      yield put({
        type: "application/setApplication",
        payload: fromJS({ key: "capp", data: app })
      });
    }
  }
};

export default ApplicationModel;
