// export function getIco(category,iconName, status) {
//   if(category==='power'){
//     return getPowerIco(iconName,status)
//   }else if(category==='gas'){

//   }
// }
export function getGasIco(iconName,status){
  if (status === 1) {
    return `${iconName}`;
  }
  else {
    return `${iconName}-非合作`;
  }
}
export function getPowerIco(iconName, status){
  if (status === '1') {
    return `${iconName}-上线`;
  }
  else if (status === '2' || status === '3') {
    return `${iconName}-下线`;
  }
  else {
    return `${iconName}`;
  }
}