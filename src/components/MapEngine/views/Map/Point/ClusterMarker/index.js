import AMap from 'AMap'

export function draw(props) {
  const { data = {}, map } = props
  const { payload = [] } = data
  let clustererPointsOG = {}; let markers = []
  AMap.plugin(["AMap.MarkerClusterer"], () => {
    for (let { longitude, latitude } of payload) {
      const marker = new AMap.Marker({
        position: [longitude, latitude]
      })
      markers.push(marker)
    }
    clustererPointsOG.markers = markers
    clustererPointsOG.cluster = new AMap.MarkerClusterer(
      map,
      markers,
      {
        gridSize: 80,
        averageCenter: true
      })
  })
  clustererPointsOG.hide = ()=>{
    clustererPointsOG.cluster.clearMarkers()
  }
  clustererPointsOG.clearOverlays = ()=>{
    clustererPointsOG.cluster.clearMarkers()
  }
  clustererPointsOG.show = ()=>{
    clustererPointsOG.cluster.addMarkers(markers)
  }
  
  return clustererPointsOG
}

export default {
  view: 3,
  draw
}