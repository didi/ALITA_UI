/* eslint-disable no-invalid-this */
import React, { Component } from "react";
import T from "prop-types";
import { Drawer, Icon, Button, Row, Col } from "antd";
import styles from "./index.less";

export default class extends Component {
  static propTypes = {
    children: T.any,
    title: T.any,
    onSubmit: T.func,
    onCancel: T.func,
    className: T.string,
    width:T.number
  };

  constructor(props) {
    super(props);
    this.state = {
      collapse: true
    };
  }

  componentDidMount() {
    if (this.divRoot) {
      this.divRoot.addEventListener(
        "scroll",
        e => {
          e.stopPropagation();
        },
        false
      );
    }
  }

  togglerContent = () => {
    const { onCancel } = this.props;
    const { collapse } = this.state;
    this.setState({ collapse: !collapse });
    onCancel();
  };

  onSubmit = () => {
    const { onSubmit } = this.props;
    onSubmit();
  };

  render() {
    const { collapse } = this.state;
    const { children, title, className, width = 450 } = this.props;
    const userAgent = navigator.userAgent;
    const tempWidth =
      userAgent.indexOf("Android") > -1 || userAgent.indexOf("iPhone") > -1
        ? "100%"
        : width;
    return (
      <div
        className="component-drawer"
        ref={el => {
          this.divRoot = el;
        }}
      >
        <Drawer
          visible={collapse}
          width={tempWidth}
          onClose={this.togglerContent}
          placement="right"
          className={className}
          mask={false}
          handler={
            <div
              className="fui-pro-setting-drawer-handle"
              onClick={this.togglerContent}
              style={{ right: tempWidth }}
            >
              <Icon
                type={collapse ? "close" : "filter"}
                style={{
                  color: "#fff",
                  fontSize: 20
                }}
              />
            </div>
          }
          style={{
            zIndex: 999
          }}
        >
          <div className={styles.mainContainer}>
            <div className={styles.customHeaderTitle}>{title}</div>
            {children}
            <div className={styles.customAffix}>
              <Row className="row" gutter={16}>
                <Col span={12}>
                  <Button type="default" block onClick={this.togglerContent}>
                    取消
                  </Button>
                </Col>
                <Col span={12}>
                  <Button type="primary" block onClick={this.onSubmit}>
                    确定
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        </Drawer>
      </div>
    );
  }
}
