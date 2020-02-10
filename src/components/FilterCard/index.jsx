/* eslint-disable no-invalid-this */
import React, { Component } from "react";
import { Card, Switch } from "antd";
import T from "prop-types";
import classNames from "classnames";
import "./index.styl";

export default class extends Component {
  static defaultProps = {
    title: "no title",
    prefixClass: "fui-filter-side-bar",
    onChange: () => {},
    type: "default",
    extra: null
  };
  static propTypes = {
    title: T.string,
    children: T.any,
    prefixClass: T.string,
    onChange: T.func,
    extra: T.element,
    type: T.string,
    checked: T.bool
  };
  constructor(props) {
    super(props);
    const { checked } = this.props;
    this.state = {
      expand: checked
    };
  }
  switchOnChangeHandler = checked => {
    this.setState({ expand: checked });
    const { onChange } = this.props;
    onChange(checked);
  };
  render() {
    const {
      title,
      extra,
      children,
      prefixClass,
      className,
      type,
      checked
    } = this.props;
    const classes = classNames(prefixClass, className, {
      [`${prefixClass}-${type}`]: type
    });
    const { expand } = this.state;
    let isSample = false;
    if (type === "sample") {
      isSample = true;
    }
    return (
      <Card
        className={classes}
        title={
          <span className="sub-header">
            <span style={{ fontSize: "14px", fontWeight: 400 }}>{title}</span>
            {!isSample && (
              <Switch
                size="small"
                onChange={this.switchOnChangeHandler}
                checked={checked}
              />
            )}
          </span>
        }
        extra={extra}
        style={{ width: "100%", marginTop: 3 }}
      >
        {(expand || isSample) && children}
      </Card>
    );
  }
}
