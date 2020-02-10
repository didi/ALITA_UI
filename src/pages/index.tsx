import React, { ReactNode } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import Designer from "./Designer/";
import Preview from "./Preview";
import { connect } from "dva";
import { ConnectProps } from "@/models/connect";
export interface LayoutProps extends ConnectProps {
  children?: ReactNode;
}
const View: React.FC = function({ dispatch }: LayoutProps) {
  return (
    <Switch>
      <Route exact path="/preview/:appId/:pageId" component={Preview} />
      <Route exact path="/designer/:appId/:pageId" component={Designer} />
    </Switch>
  );
};

export default withRouter(connect()(View));
