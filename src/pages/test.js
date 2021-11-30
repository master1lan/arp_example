import React from 'react';
import { Segment } from '../conponents/segment';
import { newMAC, ArpFormat, isSameSeg } from '../conponents/dataFromat';
import { message, Layout } from 'antd';
import { AddSwitch } from '../conponents/tools';

// const { Header, Footer, Sider, Content } = Layout;

export default class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * gataWay保存网段，也仅仅保存网段
       */
      gataWay: new Set([10]),
      /**
       * 仅仅用来查重mac
       */
      macAddress: new Set(['BB:05:72:C4:A7:45']),
      /**
       * 交换机映射表，每一个对象是一个交换机，通过mac查找
       */
      switch: {
        'BB:05:72:C4:A7:45': {
          macAddress: 'ipaddress',
          'BB:05:72:C4:A7:45': '172.16.10.1',
        },
      },
      /**
       * 为了方便多使用一个array保存交换机的mac表
       */
      switchMac: ['BB:05:72:C4:A7:45'],
      /**
       * 交换机mac只知道主机的mac地址
       */
      switchOwnMac: {
        'BB:05:72:C4:A7:45': ['71:51:00:C4:35:62'],
      },
      /**
       * 已使用的ip
       */
      gataNum: {
        '172.16.10.1': new Set([1, 2]),
      },
      /**
       * 消息表，通过mac确定
       */
      msg: {
        'BB:05:72:C4:A7:45': [],
        '71:51:00:C4:35:62': [],
      },
      /**
       * 主机映射表，通过mac确定
       */
      pcMacToIp: {
        '71:51:00:C4:35:62': {
          ipaddress: 'macAddress',
          '172.16.10.2': '71:51:00:C4:35:62',
        },
      },
      /**
       * 特别说明，绝对正确表
       */
      ipToMac: {
        '172.16.10.1': 'BB:05:72:C4:A7:45',
        '172.16.10.2': '71:51:00:C4:35:62',
      },
      /**
       * 特别说明，绝对正确表
       */
      macToIp: {
        'BB:05:72:C4:A7:45': '172.16.10.1',
        '71:51:00:C4:35:62': '172.16.10.2',
      },
    };
    this.newSwitch = this.newSwitch.bind(this);
    this.newPC = this.newPC.bind(this);
    this.sendData = this.sendData.bind(this);
    this.knownSendData = this.knownSendData.bind(this);
    this.whereAreYou = this.whereAreYou.bind(this);
  }
  newSwitch(num) {
    //创建一个新交换机应该同时注册mac地址、ip地址以及将交换机设置为网关
    const state = this.state;
    if (state.gataWay.has(num) || num > 254 || num < 0) {
      message.error('网段不可用！！！');
      return;
    }
    state.gataWay.add(num);

    let ipaddress = '172.16.' + num + '.1';
    let mac = newMAC(state.macAddress);
    state.macAddress.add(mac);
    //新添加的交换机应该知道其他交换机的地址
    state.switch[mac] = {
      macAddress: 'ipaddress',
    };
    state.ipToMac[ipaddress] = mac;
    state.macToIp[mac] = ipaddress;
    state.gataWay.forEach(
      (item) => (
        //每台交换机新加一个地址
        (state.switch[state.ipToMac['172.16.' + item + '.1']][mac] = ipaddress),
        //新加交换机添加每台交换机的地址
        (state.switch[mac][state.ipToMac['172.16.' + item + '.1']] =
          '172.16.' + item + '.1')
      ),
    );
    // state.switch[mac][mac] = ipaddress;
    state.switchMac.push(mac);
    state.switchOwnMac[mac] = [];
    state.gataNum[ipaddress] = new Set([1]);
    state.msg[mac] = [];
    this.setState(state);
  }
  newPC(num, gataWay) {
    if (
      this.state.gataNum['172.16.' + gataWay + '.1'].has(num) ||
      num > 254 ||
      num < 0
    ) {
      message.error('此ip不可用！');
      return;
    }
    //不设置ip冲突查询
    const state = this.state;
    let ipaddress = '172.16.' + gataWay + '.' + num;
    let mac = newMAC(state.macAddress);
    state.macAddress.add(mac);
    let gataMac = state.ipToMac['172.16.' + gataWay + '.1'];
    state.switchOwnMac[gataMac].push(mac);
    state.msg[mac] = [];
    state.pcMacToIp[mac] = {
      ipaddress: 'macAddress',
    };
    state.pcMacToIp[mac][ipaddress] = mac;
    state.ipToMac[ipaddress] = mac;
    state.macToIp[mac] = ipaddress;
    this.setState(state);
  }

  knownSendData(arpFormat) {
    const state = this.state;
    //已知mac地址，先发到交换机
    let gataip = arpFormat['SenderIPAddress'].split('.');
    gataip[3] = '1';
    gataip = gataip.join('.');
    //交换机消息加载
    state.msg[state.ipToMac[gataip]].push(arpFormat);
    //交换机刷新映射表，当然不能把自己的刷新了
    if (arpFormat['SenderIPAddress'] != gataip) {
      state.switch[state.ipToMac[gataip]][arpFormat['SenderMACAddress']] =
        arpFormat['SenderIPAddress'];
    }
    if (arpFormat['TargetIPAddress'] != gataip) {
      state.switch[state.ipToMac[gataip]][arpFormat['TargetMACAddress']] =
        arpFormat['TargetIPAddress'];
    }
    //假如要通过不止一个交换机，在这里它最多通过两个交换机，那么我们就可以
    let anothergataip = arpFormat['TargetIPAddress'].split('.');
    anothergataip[3] = '1';
    anothergataip = anothergataip.join('.');
    if (anothergataip != gataip) {
      if (arpFormat['SenderIPAddress'] != anothergataip) {
        state.switch[state.ipToMac[anothergataip]][
          arpFormat['SenderMACAddress']
        ] = arpFormat['SenderIPAddress'];
      }
      if (arpFormat['TargetIPAddress'] != anothergataip) {
        state.switch[state.ipToMac[anothergataip]][
          arpFormat['TargetMACAddress']
        ] = arpFormat['TargetIPAddress'];
      }
      state.msg[state.ipToMac[anothergataip]].push(arpFormat);
    }
    //然后对应的主机接收这个消息
    state.msg[arpFormat['TargetMACAddress']].push(arpFormat);
    //然后对应主机刷新映射表
    console.log(arpFormat);
    state.pcMacToIp[arpFormat['TargetMACAddress']][
      arpFormat['SenderIPAddress']
    ] = arpFormat['SenderMACAddress'];
    this.setState(state);
  }
  /**
   * 传入网关
   */
  whereAreYou(gataip, arpFormat) {
    const state = this.state;
    //得到网关的物理表
    if (gataip.split('.')[2] != arpFormat['SenderIPAddress'].split('.')[2]) {
      // 当不在同一个网关下面时，交换机之间转发给相应网段的交换机就可以了
      let anothergataip = arpFormat['SenderIPAddress'].split('.');
      anothergataip[3] = '1';
      anothergataip = anothergataip.join('.');
      //现在a网关显示
      state.msg[state.ipToMac[gataip]].push(arpFormat);
      //再在b网关显示
      state.msg[state.ipToMac[anothergataip]].push(arpFormat);
      //最后在目标主机上显示
      state.msg[state.ipToMac[arpFormat['TargetIPAddress']]].push(arpFormat);
    } else {
      let macarray = state.switchOwnMac[state.ipToMac[gataip]];
      //同一个网关下面
      for (let i = 0; i < macarray.length; i++) {
        let everyip = ArpFormat(
          arpFormat['TargetMACAddress'],
          arpFormat['TargetIPAddress'],
          arpFormat['SenderMACAddress'],
          arpFormat['SenderIPAddress'],
          arpFormat['Message'],
        );
        if (macarray[i] != arpFormat['SenderMACAddress']) {
          everyip['TargetIPAddress'] = state.macToIp[macarray[i]];
          //先在交换机上面显示
          state.msg[state.ipToMac[gataip]].push(everyip);
          //然后在每一个主机上显示
          state.msg[macarray[i]].push(everyip);
          //如果是对应主机
          if (state.macToIp[macarray[i]] == arpFormat['TargetIPAddress']) {
            let reply = ArpFormat(
              arpFormat['TargetMACAddress'],
              arpFormat['TargetIPAddress'],
              arpFormat['SenderMACAddress'],
              arpFormat['SenderIPAddress'],
              arpFormat['Message'],
            );
            //回应报文
            reply['SenderIPAddress'] = arpFormat['TargetIPAddress'];
            reply['SenderMACAddress'] = macarray[i];
            reply['TargetIPAddress'] = arpFormat['SenderIPAddress'];
            reply['TargetMACAddress'] = arpFormat['SenderMACAddress'];
            //主机显示
            state.msg[macarray[i]].push(reply);
            this.knownSendData(reply);
            state.msg[arpFormat['SenderMACAddress']].push(reply);
            //还有刷新
            state.pcMacToIp[macarray[i]][arpFormat['SenderIPAddress']] =
              arpFormat['SenderMACAddress'];
          }
        }
      }
    }
    this.setState(state);
  }

  /**
   * 接收这个数据包
   * @param {arpFormat} arpFormat
   */
  sendData(arpFormat) {
    // console.log(arpFormat);
    let SenderMACAddress = arpFormat['SenderMACAddress'];
    let SenderIPAddress = arpFormat['SenderIPAddress'];
    let TargetIPAddress = arpFormat['TargetIPAddress'];
    let TargetMACAddress =
      this.state.pcMacToIp[SenderMACAddress][TargetIPAddress];
    //如果主机映射表内存在对应ip地址的mac地址
    if (TargetMACAddress != undefined) {
      arpFormat['TargetMACAddress'] = TargetMACAddress;
      this.knownSendData(arpFormat);
      return;
    }
    //映射表内没有，将进行广播
    arpFormat['TargetMACAddress'] = '00:00:00:00:00:00';
    let gataip = arpFormat['SenderIPAddress'].split('.');
    gataip[3] = '1';
    gataip = gataip.join('.');
    this.whereAreYou(gataip, arpFormat);
  }
  render() {
    const state = this.state;
    return (
      <>
        {state.switchMac.map((item, index) => (
          <Layout key={index}>
            <Segment
              switch={{
                macAddress: item,
                ipAddress: state.switch[item][item],
                msg: state.msg[item],
                filtermap: state.switch[item],
                addPc: this.newPC,
              }}
              pc={state.switchOwnMac[item].map((mac) => ({
                ipAddress: state.macToIp[mac],
                macAddress: mac,
                msg: state.msg[mac],
                filtermap: state.pcMacToIp[mac],
                deleteMsg: 1,
                sendData: this.sendData,
              }))}
            />
          </Layout>
        ))}
        <AddSwitch newSwitch={this.newSwitch} />
      </>
    );
  }
}
