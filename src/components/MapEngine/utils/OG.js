const find = (key, OGs) => {
  const temps = [];
  for (const cur of OGs) {
    const curKey = cur.key.split("-")[0]
    if (curKey === key) {
      temps.push(cur.OG)
    }
  }
  return temps;
}

const getIndex = (key, OGs) => {
  for (let i = 0; i < OGs.length; i++) {
    if (OGs[i].key.split("-")[0] === key) {
      return i
    }
  }
  return -1
}

const remove = (key, OGs) => {
  let index = getIndex(key, OGs)
  if (index > -1) {
    OGs.splice(index, 1)
  }
}

const clearAll = (OGs) => {
  for (const cur of OGs) {
    cur.OG.clearOverlays()
  }
}

let OG = {
  hide: (key, OGs) => {
    for (let item of find(key, OGs)) {
      item.hide()
    }
  },
  show: (key, OGs) => {
    for (let item of find(key, OGs)) {
      item.show()
    }
  },
  clear: (key, OGs) => {
    if (key) {
      for (let item of find(key, OGs)) {
        item.clearOverlays()
      }
      remove(key, OGs)
    } else {
      clearAll(OGs)
      OGs.splice(0, OGs.length)
    }
  },
  find: (key, OGs) => find(key, OGs)
}

export {
  OG
}