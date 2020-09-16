import Api from "./four-operations.js";

import { scienceNum, expandNTenfold } from "@/utils/number-helper.js";

/**
 * 默认toFixed方法为四舍六入五成双算法
 * 重写toFixed方法调整为四舍五入算法
 */
Number.prototype.myFixed = function(d) {
  var s = this + "";
  if (!d) d = 0;
  if (typeof d == "string") {
    d = Number(d);
  }
  if (s.indexOf(".") == -1) {
    s += ".";
  }
  s = scienceNum(s); //处理e+、e-情况
  s += new Array(d + 1).join("0");
  if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
    var _s = "0" + RegExp.$2,
      pm = RegExp.$1,
      a = RegExp.$3.length,
      b = true;
    if (a == d + 2) {
      a = _s.match(/\d/g);
      if (parseInt(a[a.length - 1]) > 4) {
        for (var i = a.length - 2; i >= 0; i--) {
          a[i] = parseInt(a[i]) + 1;
          if (a[i] == 10) {
            a[i] = 0;
            b = i != 1;
          } else break;
        }
      }
      _s = a
        .join("")
        .replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");
    }
    if (b) {
      _s = _s.substr(1);
    }
    return (pm + _s).replace(/\.$/, "");
  }
  return this + "";
};

/**
 * 银行家舍入算法
 */
function roundHalfEven(num, scale) {
  if (!num) num = 0;
  if (typeof num == "string") {
    num = Number(num);
  }
  var arr = num.toString().split(".");
  if (arr.length == 1) {
    return num;
  }
  var tail = arr[1];
  if (tail.length <= scale) {
    return num;
  }

  var n0 = tail.substr(scale - 1, 1); // 舍入位的前一位
  var n1 = tail.substr(scale, 1); // 舍入位
  var pow = Math.pow(10, scale | 0);

  // 将num扩大至pow倍
  var num2 = expandNTenfold(num, scale);
  //舍去位为5 && 舍去位后无数字 && 舍去位前一位是偶数
  if (n1 === "5" && tail % (pow * 10) === Number(tail) && n0 % 2 === 0) {
    return Math.floor(num2) / pow;
  } else {
    return Math.round(num2) / pow;
  }
}

class IMath {
  static HALF_EVEN = "HALF_EVEN";
  static HALF_UP = "HALF_UP";
  static DEFAULT_MODEL = IMath.HALF_UP;

  static add(x, y, acc, roundingMode) {
    const result = Api.add(x, y, 0);
    return IMath.toRoundInMode(result, acc, roundingMode);
  }

  static subtract(x, y, acc, roundingMode) {
    const result = Api.subtract(x, y, 1);
    return IMath.toRoundInMode(result, acc, roundingMode);
  }

  static multiply(x, y, acc, roundingMode) {
    const result = Api.multiply(x, y, 2);
    return IMath.toRoundInMode(result, acc, roundingMode);
  }

  static divide(x, y, acc, roundingMode) {
    const result = Api.divide(x, y, 3);
    return IMath.toRoundInMode(result, acc, roundingMode);
  }

  static toRoundInMode(num, acc, roundingMode = IMath.DEFAULT_MODEL) {
    if (!acc) {
      return num;
    }
    switch (roundingMode) {
      case IMath.HALF_UP:
        return +num.myFixed(acc);
      case IMath.HALF_EVEN:
        return roundHalfEven(num, acc);
      default:
        return num;
    }
  }
}

export { IMath };
