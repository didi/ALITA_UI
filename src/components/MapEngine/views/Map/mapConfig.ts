export interface ChildrenNode{
  syn?: boolean;
  view?: number,
  draw?: Function,
  children?: Array<ChildrenNode>
}

const root:ChildrenNode = {
  view: 1,
  children: [
    require('./Point').default,
    require('./Line').default,
    require('./Plane').default,
  ],
}

export function findNode(view: string):ChildrenNode{
  const viewPath = Array.from(view)
  viewPath.shift()
  let curNode: ChildrenNode = {};
  let children:Array<ChildrenNode> = root.children || []
  while (viewPath.length > 0) {
    const curView = viewPath.shift();
    const filterNodes = children.filter(item => item.view === curView);
    if (viewPath.length === 0) {
      curNode = filterNodes[0]
    } else {
      children = (filterNodes[0] && filterNodes[0].children) || []
    }
  }
  return curNode;
}

export default root