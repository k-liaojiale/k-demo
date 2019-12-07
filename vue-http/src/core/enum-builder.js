/*
 * @Author: 落秋
 * @Date: 2019-12-07 14:50:45
 * @LastEditTime: 2019-12-07 14:51:15
 */
import { Enum } from './enum'

/**
 * 全局公共枚举类
 */
export default {
  // 商户渠道来源
  ChnlSourceEnum: new Enum()
    .add('WXPAY', '微信通道', 'wxpay')
    .add('ALIPAY', '支付宝通道', 'alipay')
    .add('JDPAY', '京东通道', 'jdpayv2')
    .add('POS', 'POS通道', 'pos')
}
