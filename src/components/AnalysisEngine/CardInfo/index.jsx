import React from "react";
import { Row, Col } from "antd";

function Detail(props) {
  const { layout = {}, data = {} } = props;
  const {
    labelCol: { span: labelSpan = 4 },
    wrapperCol: { span: wrapperSpan = 20 }
  } = layout;
  const { config: firstConfig = [], payload = {} } = data;
  const { key: firstKey = "", view = [], config: secondConfig = [] } =
    firstConfig[0] || {};

  let content = secondConfig.map((secondConfigItem, index) => {
    const {
      key: secondKey = "",
      value = "",
      status = 0,
      config: thirdConfig
      // view: thirdView
    } = secondConfigItem;
    if (status) {
      let wrapperContent = payload[firstKey][secondKey];
      let wrapperText = "-";
      if (thirdConfig) {
        wrapperText = "";
        for (let thirdConfigItem of thirdConfig) {
          const {
            key: thirdKey = "",
            value: thirdValue = "",
            status: thirdStatus = 0
          } = thirdConfigItem;
          if (thirdStatus && wrapperContent) {
            for (let thirdPayloadItem of wrapperContent) {
              wrapperText += `${thirdValue}: ${thirdPayloadItem[thirdKey]}; `;
            }
          }
        }
      } else {
        if (wrapperContent !== undefined) wrapperText = wrapperContent;
      }
      switch (view.join("-")) {
        case "1-1-1":
          return (
            <Row key={index} style={{ lineHeight: "2em" }}>
              <Col span={labelSpan}>{value}</Col>
              <Col span={wrapperSpan}>{wrapperText}</Col>
            </Row>
          );
        case "1-1-2":
          return [
            <Col span={labelSpan} key="1">
              {value}
            </Col>,
            <Col span={wrapperSpan} key="2" style={{ paddingRight: "20px" }}>
              {wrapperText}
            </Col>
          ];
        default:
          return <div></div>;
      }
    } else return <div></div>;
  });

  return content;
}

export default Detail;
