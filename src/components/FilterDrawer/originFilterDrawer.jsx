import React, { Component } from "react";
import T from "prop-types";
import classNames from "classnames";
import Drawer from "../Drawer";
import "./index.less";

export default class extends Component {
  static defaultProps = {
    title: "",
    type: "default",
    prefixClass: "fui-filter-drawer",
    onSubmit: () => {},
    onCancel: () => {},
    className: ""
  };
  static propTypes = {
    title: T.any,
    children: T.any,
    prefixClass: T.string,
    onSubmit: T.func,
    onCancel: T.func,
    type: T.string,
    className: T.string,
    width: T.number
  };

  render() {
    const {
      type,
      title,
      width,
      children,
      prefixClass,
      className,
      onSubmit,
      onCancel
    } = this.props;
    const classes = classNames(prefixClass, className, {
      [`${prefixClass}-${type}`]: type
    });
    return (
      <Drawer
        title={title}
        width={width}
        className={classes}
        onSubmit={onSubmit}
        onCancel={onCancel}
      >
        {children}
      </Drawer>
    );
  }
}
