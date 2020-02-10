function getDOMPOS(target: any) {
  let actualLeft = target.offsetLeft;
  let current = target.offsetParent;
  while (current !== null) {
    actualLeft += current.offsetLeft;
    current = current.offsetParent;
  }
  let actualTop = target.offsetTop;
  current = target.offsetParent;
  while (current !== null) {
    actualTop += current.offsetTop;
    current = current.offsetParent;
  }
  return {
    x: actualLeft,
    y: actualTop
  };
}

export { getDOMPOS };
