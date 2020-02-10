import React, { useEffect, useState } from 'react'
import rootConfig, { ChildrenNode } from './Analysis/analysisConfig'
export interface AnalysisEngineProps{
  dataSource:{
    config: {
      config: [],
      view: []
    },
    payload: []
  }
}

function AnalysisEngineView(props:AnalysisEngineProps) {
  const {
    dataSource,
    ...restProps
  } = props
  const [ curComp, setCurComp] = useState<any>()
  const { config, payload } = dataSource
 
  useEffect(()=>{
    if (config && payload) {
      const { view = [] } = config
      const viewPath = Array.from(view)
      viewPath.shift()
      let curNode:ChildrenNode = {}
      let children = rootConfig.children || []
      while (viewPath.length > 0) {
        const curView = viewPath.shift();
        const filterNodes = children.filter(item => item.view === curView)
        if (viewPath.length === 0) {
          curNode = filterNodes[0]
        } else {
          children = (filterNodes[0] && filterNodes[0].children) || []
        }
      }
      if (curNode) {
        setCurComp(<curNode.Component dataSource={payload} config={config} {...restProps} />)
      }
    }
    
  },[dataSource])
  
  return <>{curComp}</>
}

export default AnalysisEngineView