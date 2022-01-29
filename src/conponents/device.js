/**
 * redux我准备这样做，数据存储的是每个交换机和主机
 */

/**
 * 交换机也是一个class，有一个macToIp表，ipToMac表，以及该网段下的主机表
 * 交换机
 * 展示部分：ip映射表(映射mac地址)，接收的mac帧表，自身的ip地址mac地址表
 * 数据存储部分：ipToMac，macToIp，frame list
 */
function Switch(ipAddress, mac) {
  this.ipAddress = ipAddress + '.0';
  this.mac = mac;
  this.ipToMac = {};
  this.macToIp = {};
  this.frameList = [];
}

// msg= {targetIPAddress,targetMACAddress,sourceIPAddress,sourceMACAddress,[message]}
Switch.prototype.getMsg = function (msg) {
  this.frameList.push(msg);
  let targetIPSeg = msg.targetIPAddress.split(''),
    targetMACAddress = msg.targetMACAddress;
  let sourceIPSeg = msg.sourceIPAddress.split('');
  targetIPSeg.pop(), sourceIPSeg.pop();
  //broadcast
  if (targetMACAddress == 'FF:FF:FF:FF:FF:FF') {
    // cross segement
    if (targetIPSeg.join('.') !== sourceIPSeg.join('.')) {
    } else {
    }
  } else {
  }
};

//交换机只有在接入网络和被动接收帧的时候才会使用发送函数
// msg= {targetIPAddress,targetMACAddress,sourceIPAddress,sourceMACAddress,[message]}
Switch.prototype.sendMsg = function (msg) {};

/**
 * 主机也是一个class，有一个mac缓存表，mac帧接收表
 * 主机
 * 展示部分：ip映射表(映射mac地址)，接收的mac帧表，自身的ip地址mac地址表
 * 数据存储部分：ipToMac，frame
 * 数据填写部分：目的ip地址，msg，发送方ip地址和发送方mac地址可修改
 */
function PC(ipAddress, mac) {
  this.ipAddress = ipAddress;
  //这个mac地址还可以用来干嘛？
  this.mac = mac;
  this.ipToMac = {};
  this.frameList = [];
}

// msg= {targetIPAddress,targetMACAddress,sourceIPAddress,sourceMACAddress,[message]}
PC.prototype.getMsg = function (msg) {
  this.frameList.push(msg);
  //更新映射表
  this.ipToMac[msg.sourceIPAddress] = sourceMACAddress;
};

// msg= {targetIPAddress,targetMACAddress,sourceIPAddress,sourceMACAddress,[message]}
PC.prototype.sendMsg = function (msg) {};

PC.prototype.deleteMsg = function (index) {
  this.frameList.splice(index, 1);
};
