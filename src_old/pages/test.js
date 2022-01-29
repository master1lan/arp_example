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
       * 所有映射表，通过mac确定
       */
      pcMacToIp: {
        '71:51:00:C4:35:62': {
          ipaddress: 'macAddress',
          '172.16.10.2': '71:51:00:C4:35:62',
        },
        'BB:05:72:C4:A7:45': {
          ipaddress: 'macAddress',
          '172.16.10.1': 'BB:05:72:C4:A7:45',
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
    state.pcMacToIp[mac] = {
      ipaddress: 'macAddress',
    };
    state.pcMacToIp[mac][ipaddress] = mac;
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

    const state = this.state;
    let ipaddress = '172.16.' + gataWay + '.' + num;
    let mac = newMAC(state.macAddress);
    state.macAddress.add(mac);
    let gataMac = state.ipToMac['172.16.' + gataWay + '.1'];
    state.gataNum['172.16.' + gataWay + '.1'].add(num);
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
  /**
   * 交换机显示一次消息，刷新两次映射表；
   */
  knownSendData(arpFormat) {
    const state = this.state;
    //先发到sender交换机
    let gataip = arpFormat['SenderIPAddress'].split('.');
    gataip[3] = '1';
    gataip = gataip.join('.');
    let anothergataip = arpFormat['TargetIPAddress'].split('.');
    anothergataip[3] = '1';
    anothergataip = anothergataip.join('.');
    //sender交换机消息加载
    state.msg[state.ipToMac[gataip]].push(arpFormat);
    //sender交换机刷新映射表，当然不能把自己的刷新了
    if (arpFormat['SenderIPAddress'] != gataip) {
      state.switch[state.ipToMac[gataip]][arpFormat['SenderMACAddress']] =
        arpFormat['SenderIPAddress'];
      state.pcMacToIp[state.ipToMac[gataip]][arpFormat['SenderIPAddress']] =
        arpFormat['SenderMACAddress'];
    }
    //同网段刷新
    if (arpFormat['TargetIPAddress'] != gataip && anothergataip == gataip) {
      state.switch[state.ipToMac[gataip]][arpFormat['TargetMACAddress']] =
        arpFormat['TargetIPAddress'];
      state.pcMacToIp[state.ipToMac[gataip]][arpFormat['TargetIPAddress']] =
        arpFormat['TargetMACAddress'];

      state.pcMacToIp[arpFormat['TargetMACAddress']][
        arpFormat['SenderIPAddress']
      ] = arpFormat['SenderMACAddress'];
      //然后对应的主机接收这个消息
      state.msg[arpFormat['TargetMACAddress']].push(arpFormat);
    }
    //不同网段刷新，这里需要修改
    if (
      arpFormat['TargetIPAddress'] != anothergataip &&
      anothergataip != gataip
    ) {
      //查询映射表
      if (
        state.pcMacToIp[state.ipToMac[anothergataip]][
          arpFormat['TargetIPAddress']
        ] != undefined
      ) {
        //存在直接发送
        let everyip = ArpFormat(
          state.pcMacToIp[state.ipToMac[anothergataip]][
            arpFormat['TargetIPAddress']
          ],
          arpFormat['TargetIPAddress'],
          arpFormat['SenderMACAddress'],
          arpFormat['SenderIPAddress'],
          arpFormat['Message'],
        );
        //b网关接收
        state.msg[state.ipToMac[anothergataip]].push(everyip);
        //对应ip接收
        state.msg[everyip['TargetMACAddress']].push(everyip);
        state.switch[state.ipToMac[anothergataip]][
          arpFormat['TargetMACAddress']
        ] = arpFormat['TargetIPAddress'];
        state.pcMacToIp[state.ipToMac[anothergataip]][
          arpFormat['TargetIPAddress']
        ] = arpFormat['TargetMACAddress'];
      } else {
        let everyipgata = ArpFormat(
          'FF:FF:FF:FF:FF:FF',
          arpFormat['TargetIPAddress'],
          state.ipToMac[gataip],
          arpFormat['SenderIPAddress'],
          arpFormat['Message'],
        );
        //网关进行接收
        state.msg[state.ipToMac[anothergataip]].push(everyipgata);
        //不存在进行广播
        let everyip = ArpFormat(
          '00:00:00:00:00:00',
          arpFormat['TargetIPAddress'],
          state.ipToMac[anothergataip],
          anothergataip,
          '',
        );
        this.whereAreYou(anothergataip, everyip);
        //然后发送该消息
        state.msg[state.ipToMac[arpFormat['TargetIPAddress']]].push(arpFormat);
      }
    }
    this.setState(state);
  }
  /**
   * 传入网关
   */
  whereAreYou(gataip, arpFormat) {
    const state = this.state;
    let macarray = state.switchOwnMac[state.ipToMac[gataip]];
    //同一个网关下面
    for (let i = 0; i < macarray.length; i++) {
      if (macarray[i] != arpFormat['SenderMACAddress']) {
        let everyip = ArpFormat(
          arpFormat['TargetMACAddress'],
          state.macToIp[macarray[i]],
          arpFormat['SenderMACAddress'],
          arpFormat['SenderIPAddress'],
          arpFormat['Message'],
        );
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
          // state.msg[macarray[i]].push(reply);
          this.knownSendData(reply);
          // state.msg[arpFormat['SenderMACAddress']].push(reply);
          //
          state.pcMacToIp[macarray[i]][arpFormat['SenderIPAddress']] =
            arpFormat['SenderMACAddress'];
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
    let SenderMACAddress = arpFormat['SenderMACAddress'];
    let SenderIPAddress = arpFormat['SenderIPAddress'];
    let TargetIPAddress = arpFormat['TargetIPAddress'];
    let TargetMACAddress =
      this.state.pcMacToIp[SenderMACAddress][TargetIPAddress];
    let gataipSender = arpFormat['SenderIPAddress'].split('.');
    gataipSender[3] = '1';
    gataipSender = gataipSender.join('.');
    let gataipTarget = arpFormat['TargetIPAddress'].split('.');
    gataipTarget[3] = '1';
    gataipTarget = gataipTarget.join('.');
    //如果主机映射表内存在对应ip地址的mac地址或者不在同一个网关
    if (TargetMACAddress != undefined || gataipSender != gataipTarget) {
      arpFormat['TargetMACAddress'] =
        TargetMACAddress == undefined
          ? this.state.ipToMac[gataipSender]
          : TargetMACAddress;
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
      <div style={{ fontSize: '20px !important' }}>
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
      </div>
    );
  }
}
