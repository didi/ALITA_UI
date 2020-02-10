/* eslint-disable radix */
import AMap from 'AMap';

export function draw(props) {
  const { data = {}, key, viewPath, OGsType, mouseOver, mouseOut, map } = props;
  const {
    payload = [],
    config: { config = [] }
  } = data;
  let textPointsOG = new AMap.OverlayGroup();
  let OGs = [];
  const cattr = config.filter(({ key }) => key === 'text');
  for (let point of payload) {
    const { longitude, latitude, text, label } = point;
    const infoWin = new AMap.InfoWindow();
    const textObj = new AMap.Text({
      text: parseInt(text),
      textAlign: 'center', // 'left' 'right', 'center',
      verticalAlign: 'middle', // middle 、bottom
      cursor: 'pointer',
      position: [longitude, latitude],
      style: {
        backgroundColor: 'green',
        border: '0px',
        color: 'white',
        opacity: 0.7
      },
      zIndex: 500
    });
    textObj.content = label ? `${label}：${text}` : cattr[0] && `${cattr[0].value}：${text}`;
    textObj.on('click', (e) => {
      infoWin.setContent(e.target.content);
      infoWin.open(map, e.target.getPosition());
    });
    textObj.on('mouseover', (e) => {
      e.extra = { key, viewPath, target: point };
      mouseOver && mouseOver(e);
    });
    textObj.on('mouseout', (e) => {
      e.extra = { key, viewPath, target: point };
      mouseOut && mouseOut(e);
    });
    textPointsOG.addOverlay(textObj);
    OGs.push(textObj);
  }
  map.add(textPointsOG);
  if (OGsType === 'array') {
    return OGs;
  }
  return textPointsOG;
}

export default {
  view: 6,
  draw
};
