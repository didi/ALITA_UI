import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
import { TableProps, ColumnProps } from 'antd/lib/table'
import './index.styl'

export interface BaseTableProps<T> extends TableProps<T>{
  config: [] | { config: []},
}

function TableView<T>(props:BaseTableProps<T>) {
  const { dataSource, bordered, ...restProps } = props
  let { config } = props
  const [columns, setColumns] = useState<Array<ColumnProps<T>>>([])

  useEffect(() => {
    if (config && dataSource) {
      let tempColumns:Array<ColumnProps<T>> = []
      if(!Array.isArray(config)){
        config = config.config
      }
      for (let item of config) {
        const { key, value, status, align = 'center' } = item
        if (status) {
          tempColumns.push({
            title: value,
            dataIndex: key,
            key,
            align,
            render: (text: string | number) => (text !== 0 && text !== '0' && !text) ? '-' : text
          })
        }
      }
      setColumns(tempColumns)
    }
  }, [dataSource])

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      bordered={bordered}
      {...restProps}
    />
  )
}

export default {
  view: 4,
  Component: TableView
}