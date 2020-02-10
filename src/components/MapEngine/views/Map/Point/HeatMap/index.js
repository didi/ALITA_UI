import AMap from 'AMap'
// HeatMap
export function draw(props) {
  const { data = {}, map } = props
  const { payload = [] } = data
  let heatPointsOG
  AMap.plugin(["AMap.Heatmap"], () => {
    heatPointsOG = new AMap.Heatmap(map, {
      radius: 15,
      opacity: [0, 0.8]
    })
    heatPointsOG.setDataSet({
      data: payload.map(item => { return { lng: parseFloat(item.longitude), lat: parseFloat(item.latitude) } }),
      max: 4
    })
    heatPointsOG.clearOverlays = ()=>{
      heatPointsOG.setDataSet({data:[],max:100})
    }
    window.heatPointsOG = heatPointsOG
  })
  return heatPointsOG
}

export default {
  view: 4,
  draw
}