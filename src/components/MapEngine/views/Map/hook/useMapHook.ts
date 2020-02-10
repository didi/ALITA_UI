import { useEffect } from "react";
import rootConfig, { ChildrenNode } from "../mapConfig";
import { usePrevious } from "../hook/";
import { OG } from "../../../utils/OG";
import { MapProps } from "../";

interface CMapProps extends MapProps {
  map?: any;
  OGs?: any;
}

export default function(props: CMapProps) {
  const { data = {}, OGs, map, dispatch } = props;
  const dataSource: any = data;
  const preDataSource: any = usePrevious(dataSource) || {};
  useEffect(() => {
    if (!map) {
      return;
    }
    const {
      extra: { target }
    } = map;
    map.clearMap()
    Object.keys(dataSource).forEach(globalKey => {
      if (dataSource.hasOwnProperty(globalKey)) {
        const data = dataSource[globalKey];
        if (data && data.config) {
          if (!data.payload) {
            OG.clear(globalKey, OGs);
            return;
          }
          const {
            config: { view = [] }
          } = data;
          const viewPath = Array.from(view);
          viewPath.shift();
          let curNode: ChildrenNode = {};
          let children: Array<ChildrenNode> = rootConfig.children || [];
          while (viewPath.length > 0) {
            const curView = viewPath.shift();
            const filterNodes = children.filter(item => item.view === curView);
            if (viewPath.length === 0) {
              curNode = filterNodes[0];
            } else {
              children = (filterNodes[0] && filterNodes[0].children) || [];
            }
          }
          if (curNode && (target === "gMap" || target === "lightMap")) {
            const viewPath = `${globalKey}-${view.join("-")}`;
            const params = { ...props, key: globalKey, viewPath, OGs, data };
            if (curNode.syn) {
              curNode.draw && curNode.draw.call(null, params);
            } else {
              //OG.clear(globalKey, OGs);
              const { payload } = data;
              if (payload.length) {
                OGs.push({
                  key: viewPath,
                  OG: curNode.draw && curNode.draw.call(null, params)
                });
              }
            }
          }
        }
      }
    });
  }, [OGs, dataSource, dispatch, map, preDataSource, props]);
}
