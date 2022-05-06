export const cleanStr = (str) => {
  while (str.indexOf("\n") > -1) {
    str = str.replace("\n", " ");
  }
  while (str.indexOf("  ") > -1) {
    str = str.replace("  ", " ");
  }
  return str;
};
