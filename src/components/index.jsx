import MapEngine from "./MapEngine/views";
import Brand from "./AnalysisEngine/Brand";
// import FilterDrawer from "./FilterDrawer";
import CombinedFilter from "./CombinedFilter";

var antd = require("antd");

Object.assign(antd, {
  MapEngine,
  Brand,
  CombinedFilter
});
export default antd;

export { default as FilterCard } from "./FilterCard";
export { default as Drawer } from "./Drawer";
export { default as MapEngineView } from "./MapEngine";
export { default as FilterDrawer } from "./FilterDrawer";
export { default as CombinedFilter } from "./CombinedFilter";

export { gMap, lightMap, polygonMouseTool, LightMapView } from "./MapEngine";
