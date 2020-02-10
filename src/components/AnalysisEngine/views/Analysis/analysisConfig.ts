export interface ChildrenNode{
  view?: number,
  Component?: React.Component | any,
  children?: Array<ChildrenNode>
}

const root:ChildrenNode = {
  view: 2,
  children: [
    require('./Table').default,
    require('./Brand').default,
  ],
}

export default root