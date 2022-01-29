import { React, useState } from 'react';
import { List, Card } from 'antd';
import { FormStyle } from './dataFormat';
import { MsgItem } from './msg';
import { connect } from 'umi';

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
    key: '报文',
    tab: '报文',
  },
  {
    key: '映射表',
    tab: '映射表',
  },
];

const mapStateToProps = (state) => ({
  // msg:state.network.msg,
  mapping: state.network.Mapping,
});

const Item = (props) => {
  const { ipAddress, macAddress, mapping } = props;
  const contentList = {
    设备信息: (
      <div>
        <p>ip地址:{ipAddress}</p>
        <p>mac地址:{macAddress}</p>
      </div>
    ),
    发送消息: <FormStyle ipAddress={ipAddress} macAddress={macAddress} />,
    报文: <MsgItem macAddress={macAddress} />,
    映射表: (
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
  const [activeTabKey, setActiveTabKey] = useState('设备信息');
  const onTabChange = (key) => {
    setActiveTabKey(key);
  };
  return (
    <Card
      style={{ backgroundColor: 'SeaShell' }}
      hoverable={true}
      title={
        '网段' +
        props.ipAddress.split('.')[2] +
        ' 主机' +
        props.ipAddress.split('.')[3]
      }
      tabList={tabList}
      activeTabKey={activeTabKey}
      onTabChange={onTabChange}
    >
      {contentList[activeTabKey]}
    </Card>
  );
};

export const PcItem = connect(mapStateToProps)(Item);
