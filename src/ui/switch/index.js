import { React, useState } from 'react';
import { List, Card } from 'antd';
import { connect } from 'umi';
import { Add } from './addswitch';

const mapStateToProps = (state) => ({
  Switch: state.network.switchList,
  msg: state.network.msg,
  mapping: state.network.Mapping,
});

const Item = (props) => {
  const { Switch, ipAddress, msg, mapping } = props;
  //显示列表
  const tabList = [
    {
      key: '设备信息',
      tab: '设备信息',
    },
    {
      key: '报文信息',
      tab: '报文信息',
    },
    {
      key: '路由器映射表',
      tab: '路由器映射表',
    },
  ];
  //tab切换
  const [activeTabKey, setActiveTabKey] = useState('设备信息');
  const onTabChange = (key) => {
    setActiveTabKey(key);
  };
  const contentList = {
    设备信息: (
      <div>
        <p>ipAddress：{ipAddress}</p>
        <p>macAddress：{Switch[ipAddress]['MACAddress']}</p>
      </div>
    ),
    报文信息: (
      <List
        dataSource={msg[Switch[ipAddress]['MACAddress']]}
        renderItem={(item, index) => (
          <List.Item key={index}>
            <p>发送方ip:{item['SenderIPAddress']}</p>
            <p>发送方mac:{item['SenderMACAddress']}</p>
            <p>目标方ip:{item['TargetIPAddress']}</p>
            <p>目标方mac:{item['TargetMACAddress']}</p>
            <p>
              类型:
              {item['TargetMACAddress'] === 'FF:FF:FF:FF:FF:FF'
                ? '广播'
                : '单播'}
            </p>
          </List.Item>
        )}
      ></List>
    ),
    路由器映射表: (
      <div>
        <List
          dataSource={Object.keys(mapping[ipAddress])}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <p>{item}</p>
              <p>{mapping[ipAddress][item]}</p>
            </List.Item>
          )}
        ></List>
      </div>
    ),
  };
  return (
    <Card
      style={{ backgroundColor: 'LightSteelBlue' }}
      hoverable={true}
      title={'交换机网段：' + ipAddress.split('.')[2]}
      tabList={tabList}
      activeTabKey={activeTabKey}
      onTabChange={onTabChange}
    >
      {contentList[activeTabKey]}
    </Card>
  );
};

export const SwitchItem = connect(mapStateToProps)(Item);
export const AddSwitch = Add;
