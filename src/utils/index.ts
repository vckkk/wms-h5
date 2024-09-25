export const getRealStr = (str:string) => {
  const strList = str.split(",");
  const len = strList.length;
  return strList[len-1]
}