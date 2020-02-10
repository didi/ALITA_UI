---
category: Components
type: 组合组件
title: CitySelector
subtitle: 城市选择
cols: 1
---

提供省份和城市的级联选择器

## 何时使用

 * 从一组相关联的省市数据集合进行城市选择。 
 * 从一个较大的省市数据集合中进行选择时，用多级分类进行分隔，方便选择。

## 如何使用

 * 指定表格的数据源 `data` 为一个数组。 
 * 城市信息封装在 `cityInfo` 数组内。
 * 默认城市信息封装在包含 `provinceName` 和 `cityName` 属性的 `defaultValue` 对象内。


````jsx
cities = [
  {
    id: 29,
    name: "浙江省",
    cityInfo:[
      {
        id: 5,
        name: "杭州市"
      }
    ]
  }
]

defaultCity = {
  provinceName: "浙江省",
  cityName: "杭州市"
}

<CitySelector data={cities} defaultValue={defaultCity} />

````

## API

参数   |  说明   |  类型  |  默认值
----- | -----  | -----  | -----
data  | 可选项数据源  | object | 无
defaultCity  | 默认的选中项  | object | 无
size  | 输入框大小，可选 `large` `default` `small`  | string | 无
disabled  | 禁用  | boolean |false
onChange  | 选择完成后的回调 | (data) => void | 无




