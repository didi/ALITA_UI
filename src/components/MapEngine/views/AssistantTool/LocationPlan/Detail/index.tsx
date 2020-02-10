import React from "react";
import { connect } from "dva";
import { Modal } from "antd";
// import { SupplyDemandPlaneList, ModalDataDetail, CurCity } from '@/models/Location/Rental/interface';
// import { ConnectProps, ConnectState } from '@/models/connect';
import { CardInfo } from "@/components/AnalysisEngine";
import "./index.styl";
// const { CardInfo, AnalysisEngineView } = AnalysisEngine;

// interface DetailModalProps extends ConnectProps {
//   modalData: ModalDataDetail;
// }

function DetailModal(props: any) {
  // const { dispatch, modalData } = props;
  // let { key = "", visible = false, data = {} } = modalData;
  // const { payload = {} } = data;
  // const { columnOne = {} } = payload;
  // const { realBrandList = [] } = columnOne;
  // const layout = {
  //   labelCol: { span: 8 },
  //   wrapperCol: { span: 16 }
  // };
  // // const { config = {} } = supplyDemandPlaneListData;
  // // const { config: planeConfig = [] } = config;
  // // const planeTable = {
  // //   config: planeConfig[18] || {},
  // //   payload: realBrandList
  // // };
  // const handleCancel = () => {
  //   dispatch({
  //     type: "algo/modalData/setData",
  //     payload: { detail: { visible: false, data: {} } }
  //   });
  // };

  return (
    // <Modal
    //   className="detail-modal"
    //   title="详情"
    //   visible={visible}
    //   onCancel={handleCancel}
    //   footer={null}
    // >
    //   <CardInfo layout={layout} data={data} />
    //   {/* 区块 表格 */}
    // </Modal>
    <div></div>
  );
}

export default connect((state: any) => ({
  // modalData: state.algo.modalData.detail,
}))(DetailModal);
