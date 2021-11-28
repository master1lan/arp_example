//主机设置
import React, { useState } from 'react';
import { Card, List } from 'antd';
import { FormStyle } from './dataFromat';

//这里渲染单个主机
export default class PC extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //映射表
      reflectMap: {},
    };
  }

  render() {
    const state = this.state;
    return (
      <>
        <PcItem
          ipAddress={this.props.ipAddress}
          macAddress={this.props.macAddress}
          msg={this.props.msg}
          deleteMsg={this.props.deleteMsg}
        />
      </>
    );
  }
}

const PcItem = (props) => {
  const tabList = [
    {
      key: '设备信息',
      tab: '设备信息',
    },
    {
      key: '发送消息',
      tab: '发送消息',
    },
    {
      key: '收到的消息',
      tab: '收到的消息',
    },
    {
      key: '映射表',
      tab: '映射表',
    },
  ];
  const contentList = {
    设备信息: (
      <div>
        <p>ip地址:{props.ipAddress}</p>
        <p>mac地址:{props.macAddress}</p>
      </div>
    ),
    发送消息: (
      <FormStyle ipAddress={props.ipAddress} macAddress={props.macAddress} />
    ),
    收到的消息: <MsgItem items={props.msg} deleteMsg={props.deleteMsg} />,
    映射表: <div></div>,
  };
  const [activeTabKey, setActiveTabKey] = useState('设备信息');
  const onTabChange = (key) => {
    setActiveTabKey(key);
  };
  return (
    <Card
      title={'主机' + props.ipAddress.split('.')[3]}
      tabList={tabList}
      activeTabKey={activeTabKey}
      onTabChange={onTabChange}
    >
      {contentList[activeTabKey]}
    </Card>
  );
};

//这里渲染主机收到的message，只需要修改样式
const MsgItem = (props) => {
  return (
    <List
      dataSource={props.items}
      renderItem={(item, index) => (
        <List.Item key={index}>
          <p>发送方ip：{item['SenderIPAddress']}</p>
          <p>发送方mac：{item['SenderMACAddress']}</p>
          <p>消息：{item['Message']}</p>
          <button onClick={() => props.deleteMsg(index)}>X</button>
        </List.Item>
      )}
    />
  );
};
