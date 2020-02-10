import AMap from 'AMap'

export function removeMarker(obj){
  obj.setMap(null);
}
export function hideMarker(obj){
  obj.hide();
}
export function showMarker(obj){
  obj.show();
}

export function drawPolygon({
  centralLng,
  centralLat,
  edge,
  fillColor,
  alpha,
  intervalLng,
  intervalLat,
  map
}){
  const lnglat1 =[centralLng-intervalLng/1000*(edge/2),centralLat-intervalLat/1000*(edge/2)];
  const lnglat2 =[centralLng-intervalLng/1000*(edge/2),centralLat+intervalLat/1000*(edge/2)];
  const lnglat3 =[centralLng+intervalLng/1000*(edge/2),centralLat+intervalLat/1000*(edge/2)];
  const lnglat4 =[centralLng+intervalLng/1000*(edge/2),centralLat-intervalLat/1000*(edge/2)];
  const polygon_obj=new AMap.Polygon({
    path: [
      lnglat1,
      lnglat2,
      lnglat3,
      lnglat4
    ],
    'fillColor':fillColor,
    // 'fillColor':'rgb(255,0,0)',
    'fillOpacity':alpha,
    'strokeColor':'rgb(238,173,14)',
    'strokeOpacity':1,
    'strokeWeight':1,
    map:map,
    cursor:'pointer'
  });
  return polygon_obj;
}

export function drawPolygonByIndex({
  centralLngIndex,
  centralLatIndex,
  centralLng,
  centralLat,
  unit,
  edge,
  fillColor,
  alpha,
  intervalLng,
  intervalLat,
  map
}
){
  // unit:传入区块索引的单位，
  // 1000表示1个索引单位为1000m
  // 5000表示1个索引单位为5000m
  centralLng=(centralLng+(centralLngIndex+1)*intervalLng*unit/1000
  +centralLng+centralLngIndex*intervalLng*unit/1000)/2;
  centralLat=(centralLat+(centralLatIndex+1)*intervalLat*unit/1000
  +centralLat+centralLatIndex*intervalLat*unit/1000)/2;

  const polygon_obj=drawPolygon({
    centralLng,
    centralLat,
    edge,
    fillColor,
    alpha,
    intervalLng,
    intervalLat,
    map
  });
  return polygon_obj;
}

export function drawInfoWindowByIdex({
  centralLngIndex,
  centralLatIndex,
  centralLng,
  centralLat,
  unit,
  intervalLng,
  intervalLat,
  text,
  content,
  map,
}){
  // unit:传入区块索引的单位，
  // 1000表示1个索引单位为1000m
  // 5000表示1个索引单位为5000m
  centralLng=(centralLng+(centralLngIndex+1)*intervalLng*unit/1000
  +centralLng+centralLngIndex*intervalLng*unit/1000)/2;
  centralLat=(centralLat+(centralLatIndex+1)*intervalLat*unit/1000
  +centralLat+centralLatIndex*intervalLat*unit/1000)/2;
  return drawText({
    lng: centralLng,
    lat: centralLat,
    text ,
    backgroundColor: 'green',
    info: content,
    map
  })
}

// 打开信息窗体
export function drawInfoWindow({content,lng,lat,map}){
  const infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -15)});
  infoWindow.setContent(content);
  infoWindow.open(map, [lng,lat]);
  return infoWindow;
}

// 绘制网格
export function renderGrid({
  edge, 
  centralLng,
  centralLat,
  intervalLng,
  intervalLat,
  map,
}){

  let line_cnt=100/edge;
  let index=0;
  const overlays = []
  for(let i=-line_cnt/2;i<=line_cnt/2;i++){
    // 横线
    let overlayH = drawLine([[-179,centralLat+i*edge*intervalLat],[179,centralLat+i*edge*intervalLat]], map);
    overlays.push(overlayH)
    index=index+1;
    // 竖线
    let overlayV = drawLine([[centralLng+i*edge*intervalLng,89],[centralLng+i*edge*intervalLng,-89]], map);
    overlays.push(overlayV)
    index=index+1;
  }
  return overlays;
}

export function drawLine(lineArr, map){
  const polyline = new AMap.Polyline({
    map: map,
    path: lineArr,
    strokeColor: "#00A",  // 线颜色
    strokeOpacity: 0.6,     // 线透明度
    strokeWeight: 2,      // 线宽
    showDir:false
  });
  return polyline;
}

//
export function drawText({
  lng,
  lat,
  text,
  backgroundColor = 'green',
  info,
  map
}){
  const infoWin = new AMap.InfoWindow();
  const textObj = new AMap.Text({
    text:text,
    textAlign:'center', // 'left' 'right', 'center',
    verticalAlign:'middle', // middle 、bottom
    cursor:'pointer',
    position: [lng,lat],
    style:{
      backgroundColor:backgroundColor,
      border:'0px',
      color:'white',
      opacity: 0.7
    },
    map,
    zIndex:500
  });
  textObj.content=info;
  textObj.on("click",(e)=>{
    infoWin.setContent(e.target.content);
    infoWin.open(map, e.target.getPosition());
  });
  return textObj;
}


function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

function getMinOfArray(numArray) {
  return Math.min.apply(null, numArray);
}

export function getBoundByBounds(bounds){
  const lngs = bounds.map(({lng}) => lng)
  const lats = bounds.map(({lat}) => lat)
  return {
    southWest: {lng: getMinOfArray(lngs), lat: getMinOfArray(lats)},
    northEast: {lng: getMaxOfArray(lngs), lat: getMaxOfArray(lats)},
  }
}

export function splitBound(bound, xDenominator, YDenominator){
  const { 
    northEast:{ lng: northEastLng, lat: northEastLat }, 
    southWest:{ lng: southWestLng, lat: southWestLat } 
  } = bound
  const lngDiff = (northEastLng - southWestLng)/xDenominator
  const latDiff = (northEastLat - southWestLat)/YDenominator
  const splitedBounds = []
  for(let i=0; i<YDenominator; i++){
    let curLat = northEastLat - latDiff*i
    let curLng
    for(let j=0; j<xDenominator; j++){
      curLng = northEastLng - lngDiff*j
      splitedBounds.push({
        northEast:{ lng: curLng, lat: curLat },
        southWest:{ lng: curLng - lngDiff, lat: curLat - latDiff }
      })
      if( j+1 === xDenominator){
        curLng = northEastLng
      }
    }
  }
  return splitedBounds
}