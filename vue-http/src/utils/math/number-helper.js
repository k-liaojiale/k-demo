//生成num个0的字符串
function makeZero(num) {
  var str = "";
  for (var i = 0; i < num; i++) {
    str += "0";
  }
  return str;
}

/**
 * 判断是否为整数，字符整数也返回true
 *
 * @param num
 * @returns
 */
function isInteger(num) {
  return Math.floor(num) === Number(num);
}

/**
 * 将数值转为字符串
 *
 * 通过移动小数点  扩大倍数或缩小倍数(解决出现e+、e-的问题)
 *
 * JavaScript在以下情景会自动将数值转换为科学计数法：
 *   1）小数点前的数字多于21位。
 *   2）小数点后的零多于5个
 */
function scienceNum(value) {
  if (!value) {
    return value;
  }
  if (typeof value === "number") {
    value = value + "";
  }
  var eIndex = value.indexOf("E");
  if (eIndex == -1) {
    eIndex = value.indexOf("e");
  }
  if (eIndex != -1) {
    var doubleStr = value.substring(0, eIndex); //e前面的值
    var eStr = parseInt(value.substring(eIndex + 1, value.length)); //e后面的值
    var doubleStrArr = doubleStr.split(".");
    var doubleStr1 = doubleStrArr[0] || "";
    var doubleStr2 = doubleStrArr[1] || "";

    if (eStr < 0) {
      //e- 很小的数
      var str1Len = doubleStr1.length;
      var eStrs = Math.abs(eStr);
      if (str1Len > eStrs) {
        var nums = doubleStr1.substring(0, eStrs);
        var nume = doubleStr1.substring(eStrs, str1Len);
        doubleStr = nums + "." + nume + nume;
      } else if (str1Len < eStrs) {
        var indexNum = eStrs - str1Len;
        var str = makeZero(indexNum); //用0补齐
        doubleStr = "0." + str + doubleStr1 + doubleStr2;
      } else {
        doubleStr = "0." + doubleStr1 + doubleStr2;
      }
    } else {
      //e+ 很大的数
      var str2Len = doubleStr2.length;
      if (str2Len > eStr) {
        var _nums = doubleStr2.substring(0, eStr);
        var _nume = doubleStr2.substring(eStr, str2Len);
        doubleStr = doubleStr1 + _nums + "." + _nume;
      } else if (str2Len < eStr) {
        var _indexNum = eStr - str2Len;
        var _str = makeZero(_indexNum); //用0补齐
        doubleStr = doubleStr1 + doubleStr2 + _str;
      } else {
        doubleStr = doubleStr1 + doubleStr2;
      }
    }
    value = doubleStr;
  }
  return value;
}

/**
 * 将数值升级(10的X的次方)到整数
 */
function science(num) {
  var re = {
    r1: 0, //数字去掉小数点后的值，也就是 r1*r2 的结果
    r2: 1 //小数部分，10的长度次幂
  };
  if (isInteger(num)) {
    //整数直接返回
    re.r1 = num;
    return re;
  }
  var snum = scienceNum(num + ""); //处理0.123e-10类似问题
  var dotPos = snum.indexOf("."); //小数点位置
  var len = snum.substr(dotPos + 1).length; //小数点长度
  re.r2 = Math.pow(10, len);
  re.r1 = parseInt(snum.replace(".", ""));
  return re;
}

/**
 * 将数字扩大至10的n次方倍
 * @param number 扩大的数字
 * @param n 倍数
 */
function expandNTenfold(number, n) {
  var pow = Math.pow(10, n | 0);
  // 此处是为了避免小数运算
  // 转换为整数后，再做运算
  var s = science(number);
  return s.r1 / (s.r2 / pow);
}

module.exports.default = module.exports = {
  makeZero,
  isInteger,
  scienceNum,
  science,
  expandNTenfold
};
