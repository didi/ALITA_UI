import React, { ReactNode } from "react";
import { withRouter } from "react-router-dom";
import { Layout } from "antd";
import { ConnectProps } from "@/models/connect";
import WorkSpace from "./WorkSpace";
import styles from "./index.less";
const { Content } = Layout;
export interface LayoutProps extends ConnectProps {
  children?: ReactNode;
}
const Designer: React.FC = ({ children, history }: LayoutProps) => {
  return (
    <Layout className={styles.layout}>
      <Content
        style={{
          background: "#fff",
          padding: 24,
          margin: 0,
          minHeight: 280
        }}
      >
        <WorkSpace />
      </Content>
    </Layout>
  );
};

export default withRouter(Designer);
