//交换机设置文件
import React, { useState } from 'react';
import { Row, Col, List, Card } from 'antd';
import PC from './pc';

/**
 * 传递的props需要包括switch{ipaddress,macAddress,msg},pc{{ipaddress,macAddress,msg,deleteMsg}}
 */

export const Segment = (props) => {
  return (
    <Row>
      <Col span={18} push={6}>
        <List
          dataSource={props.pc}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <PC
                ipAddress={item.ipAddress}
                macAddress={item.macAddress}
                msg={item.msg}
                //msg还没有创建
                deleteMsg={item.deleteMsg}
              />
            </List.Item>
          )}
        ></List>
      </Col>
      <Col span={6} pull={18}>
        <SwitchItem switch={props.switch} />
      </Col>
    </Row>
  );
};

/**
 * 传递的props应该为ipaddress,macAddress,msg
 */

const SwitchItem = (props) => {
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
  const [activeTabKey, setActiveTabKey] = useState('设备信息');
  const onTabChange = (key) => {
    setActiveTabKey(key);
  };
  const contentList = {
    设备信息: (
      <div>
        <p>ipAddress：{props.switch.ipAddress}</p>
        <p>macAddress：{props.switch.macAddress}</p>
      </div>
    ),
    报文信息: (
      <List
        dataSource={props.switch.msg}
        renderItem={(item, index) => {
          <List.Item key={index}>
            <p>发送方ip:{item['SenderIPAddress']}</p>
            <p>发送方mac:{item['SenderMACAddress']}</p>
            <p>目标方ip:{item['TargetIPAddress']}</p>
            <p>目标方mac:{item['TargetMACAddress']}</p>
            <p>
              类型:
              {item['TargetMACAddress'] == 'FF:FF:FF:FF:FF:FF'
                ? '广播'
                : '单播'}
            </p>
          </List.Item>;
        }}
      ></List>
    ),
    路由器映射表: 3,
  };
  return (
    <Card
      title={'交换机网段：' + props.switch.ipAddress.split('.')[2]}
      tabList={tabList}
      activeTabKey={activeTabKey}
      onTabChange={onTabChange}
    >
      {contentList[activeTabKey]}
    </Card>
  );
};
