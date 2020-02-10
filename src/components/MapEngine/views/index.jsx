import React, { useState } from "react";
import { Modal } from "antd";
import FullMapView from "./Map";
import { CardInfo } from "@/components/AnalysisEngine";
import AssistantToolView from "./AssistantTool";
function View(props) {
  const [detailVisable, setDetailVisable] = useState(false);
  const [detailInfo, setDetailInfo] = useState({});
  const { assist } = props;
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
  };

  return (
    <div className="map-engine">
      <FullMapView
        {...props}
        onClick={e => {
          console.info(e);
          const { target, config, key } = e.extra;
          if (key === "pointList") {
            config.key = key;
            setDetailVisable(true);
            setDetailInfo({
              payload: {
                [key]: target
              },
              config: [config]
            });
          }
        }}
      />
      <Modal
        title="详情"
        visible={detailVisable}
        onCancel={() => {
          setDetailVisable(false);
        }}
        footer={null}
      >
        <CardInfo layout={layout} data={detailInfo} />
      </Modal>
      {assist === false ? null : <AssistantToolView {...props} />}
    </div>
  );
}

export default View;

export * from "./Map";
