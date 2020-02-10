import { Collapse } from "antd";
import { default as FilterDrawer } from "./originFilterDrawer";
import { default as FilterCard } from "../FilterCard";
import "./index.less";
const { Panel } = Collapse;

FilterDrawer.Collapse = Collapse;
FilterDrawer.Collapse.Panel = Panel;
FilterDrawer.Collapse.Panel.Card = FilterCard;

export default FilterDrawer;
