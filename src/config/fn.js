//生成随机 GUID 数
export function guid () {
  function S4 () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
}

export function S4 () {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
