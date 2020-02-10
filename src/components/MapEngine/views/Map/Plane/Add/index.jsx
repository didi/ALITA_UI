import React, { useState, useEffect } from 'react'
import {
  Modal,
  Form,
  Input
} from 'antd'
import { fromJS } from 'immutable'
import { polygonMouseTool } from '../../index'

function AddPlaneView(props) {
  const {
    form: { validateFieldsAndScroll, getFieldDecorator },
    onClick,
    map
  } = props

  const formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  }
  const [overlays, setOverlays] = useState([])
  useEffect(() => {
    polygonMouseTool && polygonMouseTool.on('draw', function (e) {
      const { path } = e.obj.getOptions()
      overlays.push(e.obj)
      setOverlays(overlays)
      const latLngList = path.map(({ lng, lat }) => [lng, lat])
      setAddData({ visible: true, data: fromJS(latLngList), checked: false })
    })
  }, [polygonMouseTool])

  const [addData, setAddData] = useState({
    visible: false,
    data: null
  })

  const handleCancel = () => {
    setAddData({ ...addData, visible: false })
    map.remove(overlays)
  }

  const handleOk = () => {
    const { data } = addData
    validateFieldsAndScroll(['name'], async (err, values) => {
      if (err) return
      const { name } = values
      const e = {
        extra: {
          key: 'addPlane',
          name,
          data
        }
      }
      onClick(e)
      setAddData({ ...addData, visible: false })
      map.remove(overlays)
    })
  }

  return (
    <Modal
      title="新增区块"
      className="add-block-page"
      visible={addData.visible}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <Form>
        {addData.visible &&
            <Form.Item
              label="区块名称"
              {...formLayout}
            >
              {getFieldDecorator('name', {
                initialValue: '',
                rules: [{
                  required: true,
                  message: '请输入名称',
                }],
              })(
                <Input />
              )}
            </Form.Item>
        }
      </Form>
    </Modal>
  )
}

export default Form.create()(AddPlaneView)