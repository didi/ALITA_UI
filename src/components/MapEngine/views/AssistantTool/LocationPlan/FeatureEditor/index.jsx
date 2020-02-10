import React, { useState } from 'react'
import { Input, InputNumber,Row } from 'antd';
import { connect } from 'dva';

const { TextArea } = Input;
const convertDatasToText=(datas,showKeys)=>{
    let values=[]
    for(let data of datas){
        let showValues=showKeys.map(key=>data[key])
        values.push(showValues.join(','))
    }
    return values.join('\n')
}
function FeatureEditor(props){
    let {name,feature,showKeys,saveFeature}=props
    const{ratio,datas,key}=feature
    let value=convertDatasToText(datas,showKeys)
    return(
        <div>
            <Row>系数:<InputNumber value={ratio} 
            onChange={(e)=>{
                feature['ratio']=e
                saveFeature({featureName:name,feature})
            }}></InputNumber></Row>
            <TextArea
                value={value}
                placeholder="所有数据"
                rows={15}
            />
        </div>
    )
}
export default FeatureEditor
