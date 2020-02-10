import React, { useEffect, useState } from 'react'
import { Statistic, Row, Col } from 'antd'
import './index.styl'

function Brand(props) {
  const { style = {}, data = {} } = props
  const { span = [], backgroundImage = [] } = style
  const { config, payload } = data

  const [children, setChildren] = useState(null)

  useEffect(() => {
    if (config && payload) {
      const { config: innerConfig = [] } = config[0]
      const { brand = [] } = payload
      let content = []; let i = 0
      for (const [index, item] of innerConfig.entries()) {
        const { key, value, status } = item
        if (status) {
          content.push(
            <Col span={span[i] || 3} key={index}>
              <div
                className="data-block"
                style={{
                  backgroundImage: backgroundImage[i] || "linear-gradient(rgb(253, 141, 0), rgb(255, 164, 29))"
                }}
              >
                <Statistic
                  title={value}
                  value={brand[key]}
                />
              </div>
            </Col>
          )
          i++
        }
      }
      setChildren(content)
    }
  }, [data])

  return (
    <Row className="fui-brand">
      {children}
    </Row>
  )
}

export default Brand