---
order: 0
title:
  zh-CN: 基本
  en-US: Type
---

## zh-CN

省份、城市级联功能

## en-US

Province, city cascade.

````jsx
import { CitySelector } from 'fui'

 const cities = [
  {
    id: 29,
    name: "浙江省",
    cityInfo:[
      {
        id: 5,
        name: "杭州市"
      },
      {
        id: 20,
        name: "宁波市"
      }
    ]
  },
  {
    id: 18,
    name: "江苏省",
    cityInfo:[
      {
        id: 11,
        name: "南京市"
      },
      {
        id: 23,
        name: "苏州市"
      }
    ]
  }
]

handleCityChange = (data) =>{
console.log(data)
}

defaultCity = {
  provinceName: "浙江省",
  cityName: "杭州市"
}

ReactDOM.render(
  <div>
    <CitySelector 
      data={cities} 
      onChange={handleCityChange} 
      disabled={false} 
      defaultValue={defaultCity}
      size = "default"
    />
  </div>,
  mountNode);

````


