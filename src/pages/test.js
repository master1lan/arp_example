import React from 'react';
import Segment from '../conponents/segment';

/**
 * 'FF:FF:FF:FF:FF:FF'
 * @param {Array} MACset
 * @returns {String}
 */
const newMAC = (MACset) => {
  var hexDigits = '0123456789ABCDEF';
  var macAddress = '';
  do {
    for (var i = 0; i < 6; i++) {
      macAddress += hexDigits.charAt(Math.round(Math.random() * 15));
      macAddress += hexDigits.charAt(Math.round(Math.random() * 15));
      if (i != 5) macAddress += ':';
    }
  } while (!(macAddress in MACset));
  return macAddress;
};

export default class Page extends React.Component {
  constructor(props) {
    this.state = {
      /**
       * gataWay设置为网关列表，每一项应该为{'macAddress':String,
       * 'ipAddress':String,'msg':[dataFromat],{'ipAddress':[dataFromat]}}
       */
      gataWay: [],
      /**
       * macAddress保存所有注册的mac地址，仅仅用来查询
       */
      macAddress: [],
      /**
       * ipAddress应该设置为可以查询，每一个项应该为网关的集合，例如gataWay:[],
       */
      ipAddress: {},
    };
    this.newSwitch = this.newSwitch.bind(this);
    this.newPC = this.newPC.bind(this);
  }
  newSwitch() {
    //创建一个新交换机应该同时注册mac地址、ip地址以及将交换机设置为网关
    const state = this.state;
    //172.10.xx.1
    let gataway =
      state.gataWay[state.gataWay.length - 1]['ipAddress'].split('.')[2];
    let mac = newMAC(state.macAddress);
    state.ipAddress[gataway] = [gataway];
    this.setState({
      gataWay: [
        ...state.gataWay,
        { macAddress: mac, ipAddress: '172.10.' + gataway + '.1' },
      ],
      macAddress: [...state.macAddress, mac],
      ipAddress: state.ipAddress,
    });
    //在这里创建一个新的交换机意味着创建一个新的网段，自动携带两个主机
    this.newPC(gataway);
    this.newPC(gataway);
  }
  /**
   * 通过网关的ip新加设备
   * @param {String} gataWay
   */
  newPC(gataWay) {
    const state = this.state;
    let mac = newMAC(state.macAddress);
    let IPset = state.ipAddress[gataWay];
    let ipAddress = IPset[IPset.length - 1].split('.');
    ipAddress[3] = String(number(ipAddress[3]) + 1);
    state.ipAddress[gataWay].push(ipAddress.join('.'));
    this.setState({
      macAddress: [...state.macAddress, mac],
      ipAddress: state.ipAddress,
    });
  }
  render() {
    const switch1 = this.newSwitch();
    return (
      <>
        <Segment />
      </>
    );
  }
}
