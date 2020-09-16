/**
 * From: https://github.com/StevenLikeWatermelon/high-precision-four-fundamental-rules
 */

import { science } from "./number-helper.js";

/**
 * 四则运算
 *
 * @param x
 * @param y
 * @param op 操作符，0：加；1：减；2：乘；3：除
 */
function _execute(x, y, op) {
  var xx = Number(x == undefined ? 0 : x);
  var yy = Number(y == undefined ? 0 : y);

  //
  var a = science(xx);
  var b = science(yy);

  var na = a.r1;
  var nb = b.r1;

  var ta = a.r2;
  var tb = b.r2;
  var maxt = Math.max(ta, tb);

  //精度值处理
  var result = 0;
  switch (parseInt(op, 10)) {
    case 0: //加
      result = (xx * maxt + yy * maxt) / maxt;
      break;
    case 1: //减
      result = (xx * maxt - yy * maxt) / maxt;
      break;
    case 2: // 乘
      result = (na * nb) / (ta * tb);
      break;
    case 3: // 除
      result = (na / nb) * (tb / ta);
  }
  return result;
}

export default {
  //加法运算
  add: function(x, y) {
    return _execute(x, y, 0);
  },

  //减法运算
  subtract: function(x, y) {
    return _execute(x, y, 1);
  },

  //乘法运算
  multiply: function(x, y) {
    return _execute(x, y, 2);
  },

  //除法运算
  divide: function(x, y) {
    return _execute(x, y, 3);
  }
};
