//这种玩意，当然是路由器来处理，一个函数就解决
export const sendData = (state, action) => {
  let { switchList, msg, Mapping } = state;
  let { SenderMACAddress, SenderIPAddress, TargetIPAddress } = action.payload;
  let TargetMACAddress = Mapping[SenderIPAddress][TargetIPAddress];
  let SenderSegements = getSegements(SenderIPAddress);
  let NUllUsedMacAddress = 'FF:FF:FF:FF:FF:FF';
  //交换机接收帧
  msg[switchList[SenderSegements]['MACAddress']].push({
    ...action.payload,
    TargetMACAddress: TargetMACAddress || NUllUsedMacAddress,
  });
  //交换机映射刷新发送方ip地址对应的mac地址
  Mapping[SenderSegements][SenderIPAddress] = SenderMACAddress;
  //先处理已知的情况
  if (TargetMACAddress) {
    let TargetSegements = getSegements(TargetIPAddress);
    //同网段交流
    if (TargetSegements === SenderSegements) {
      //对方接收
      msg[TargetMACAddress].push({
        ...action.payload,
      });
      //对方映射刷新发送方ip地址对应的mac地址
      Mapping[TargetIPAddress][SenderIPAddress] = SenderMACAddress;
      //结束
      return {
        ...state,
        msg,
        Mapping,
      };
    } else {
      //跨网段，这里应该直接发送给路由器的
      let TargetSegements = getSegements(TargetIPAddress);
      //发送方路由器记录
      msg[Mapping[SenderSegements]].push({
        ...action.payload,
      });
      //接收方路由器记录
      msg[Mapping[TargetSegements]].push({
        ...action.payload,
      });
      //最后对方接收
      msg[Mapping[TargetIPAddress]].push({
        ...action.payload,
      });
      //对方映射刷新发送方ip地址对应的mac地址
      Mapping[TargetIPAddress][SenderIPAddress] = SenderMACAddress;
      //结束
      return {
        ...state,
        msg,
        Mapping,
      };
    }
  } else {
    //未知情况，分为同网段和跨网段
    let TargetSegements = getSegements(TargetIPAddress);
    //同网段，进行广播
    if (TargetSegements === SenderSegements) {
      //进行广播
      for (const item of switchList[TargetSegements]['PCList']) {
        //自己不接收这个帧
        if (item['IPAddress'] !== SenderIPAddress) {
          //主机接收帧
          msg[item['MACAddress']].push({
            ...action.payload,
            Message: 'where are you',
            TargetMACAddress: NUllUsedMacAddress,
          });
          Mapping[item['IPAddress']][SenderIPAddress] = SenderMACAddress;
          //是目标ip
          if (item['IPAddress'] === TargetIPAddress) {
            //主机发送反馈帧，走路由器，路由器接收帧
            msg[switchList[SenderSegements]['MACAddress']].push({
              SenderIPAddress: TargetIPAddress,
              SenderMACAddress: item['MACAddress'],
              TargetIPAddress: SenderIPAddress,
              TargetMACAddress: SenderMACAddress,
              Message: 'I am here',
            });
            //路由器映射刷新发送方ip地址对应的mac地址
            Mapping[SenderSegements][TargetIPAddress] = item['MACAddress'];
            //最初发送方接收
            msg[SenderMACAddress].push({
              SenderIPAddress: TargetIPAddress,
              SenderMACAddress: item['MACAddress'],
              TargetIPAddress: SenderIPAddress,
              Message: 'I am here',
            });
            //最初发送方刷新映射
            Mapping[SenderIPAddress][TargetIPAddress] = item['MACAddress'];
            //最后接收方接收帧
            msg[item['MACAddress']].push({
              ...action.payload,
            });
          }
        }
      }
      return {
        ...state,
        msg,
        Mapping,
      };
    } else {
      //只剩下跨网段广播了
      //先丢给对方的交换机
    }
  }
};

const getSegements = (ipAddress) => {
  let item = ipAddress.split('.');
  item[3] = 1;
  return item.join('.');
};
