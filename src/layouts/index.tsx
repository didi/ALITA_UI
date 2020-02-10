import React, { ReactNode, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "dva";
import { Layout, Menu } from "antd";
import { ConnectProps } from "@/models/connect";
import { toJS } from "@/utils/hoc";
import styles from "./index.less";
const { Header } = Layout;

export interface LayoutProps extends ConnectProps {
  children?: ReactNode;
  capp?: any;
}

const App: React.FC = ({
  dispatch,
  children,
  location,
  ...restProps
}: LayoutProps) => {
  const { capp = {} } = restProps;
  const { pages = [] } = capp;
  const { pathname }: any = location;
  const matchPage = pages.filter((page: any) => {
    const pathnames = pathname.split("/");
    return page.id == pathnames[pathnames.length - 1];
  });
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: "dataSource/triggerLoadData"
      });
      dispatch({
        type: "application/fetchApplication",
        payload: { id: 1 }
      });
    }
  }, [dispatch]);
  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <Menu
          mode="horizontal"
          theme="dark"
          style={{ lineHeight: "64px" }}
          defaultOpenKeys={["designer"]}
        >
          {pages &&
            pages.map((page: any) => (
              <Menu.Item key={page.id}>
                <Link to={`/preview/1/${page.id}`}>{page.name}</Link>
              </Menu.Item>
            ))}
          <Menu.Item key="designer">
            <Link
              to={`/designer/1/${matchPage &&
                matchPage.length > 0 &&
                matchPage[0].id}`}
            >
              设计区
            </Link>
          </Menu.Item>
          {/* <Menu.Item key="preview">
            <Link
              to={`/preview/1/${matchPage &&
                matchPage.length > 0 &&
                matchPage[0].id}`}
            >
              预览区
            </Link>
          </Menu.Item> */}
        </Menu>
      </Header>
      <>{children}</>
    </Layout>
  );
};

export default withRouter(
  connect(({ application }: { application: any }) => ({
    capp: application.get("capp")
  }))(toJS(App))
);
