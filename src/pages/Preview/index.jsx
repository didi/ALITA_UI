import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "dva";
import RenderEditor from "../Designer/RenderEditor";
function Preview(props) {
  const { dispatch, match = {} } = props;
  const {
    params: { pageId }
  } = match;
  useEffect(() => {
    dispatch({
      type: "page/fetchConfigTree",
      payload: {
        id: pageId
      }
    });
  }, [dispatch, pageId]);
  return <RenderEditor />;
}

export default withRouter(connect()(Preview));
