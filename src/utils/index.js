import * as map from './map';

// 地图方法
export {
  map
};

// 下载
export function download(url) {
  const aEl = document.createElement('a');
  aEl.href = url;
  aEl.style.display = 'none';
  document.body.appendChild(aEl);
  aEl.click();
  document.body.removeChild(aEl);
}

// 筛选数据
export function filterAll(value) {
  if (typeof value === 'number') {
    return value === 0 ? undefined : value;
  } else if (typeof value === 'string') {
    return value === '0' ? undefined : value;
  } else if (Array.isArray(value)) {
    return value.length === 0 ? undefined : value;
  } else {
    console.error('筛选类型错误');
    return;
  }
}

// 格式化入参
export function formatParams(obj) {
  let params = [];
  Object.keys(obj).forEach((globalKey) => {
    if (obj.hasOwnProperty(globalKey)) {
      const value = obj[globalKey];
      if (value !== undefined && value !== '') {
        params.push({
          key: globalKey,
          value: value
        });
      }
    }
  });
  return params;
}

// 格式化入参（为0时不传改参数）
export function formatParamsSE(obj) {
  let params = [];
  Object.keys(obj).forEach((globalKey) => {
    if (obj.hasOwnProperty(globalKey)) {
      const value = obj[globalKey];
      if (value) {
        params.push({
          key: globalKey,
          value: value
        });
      }
    }
  });
  return params;
}


export function saveLastUsedCity({
  key,
  payload
}) {

}