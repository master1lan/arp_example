//交换机设置文件
import React, { useState } from 'react';
import { Row, Col, List, Card } from 'antd';
import PC from './pc';
import { AddPc } from '../conponents/tools';
/**
 * 传递的props需要包括switch{ipAddress,macAddress,msg,filtermap},pc{{ipAddress,macAddress,msg,deleteMsg}}
 */

export const Segment = (props) => {
  return (
    <Row align="top">
      {props.pc.length > 0 ? (
        <Col flex={props.pc.length}>
          <List
            grid={{ column: props.pc.length }}
            dataSource={props.pc}
            renderItem={(item, index) => (
              <List.Item key={index}>
                <PC
                  ipAddress={item.ipAddress}
                  macAddress={item.macAddress}
                  msg={item.msg}
                  //msg还没有创建
                  deleteMsg={item.deleteMsg}
                  filterMap={item.filtermap}
                  sendData={item.sendData}
                />
              </List.Item>
            )}
          ></List>
        </Col>
      ) : null}
      {props.pc.length < 3 ? (
        <Col flex={1}>
          <AddPc
            gataWay={props.switch.ipAddress.split('.')[2]}
            addPc={props.switch.addPc}
          />
        </Col>
      ) : null}
      <Col flex={1}>
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

  const objToArray = [];
  for (let i in props.switch.filtermap) {
    objToArray.push(i);
  }

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
        renderItem={(item, index) => (
          <List.Item key={index}>
            <p>发送方ip:{item['SenderIPAddress']}</p>
            <p>发送方mac:{item['SenderMACAddress']}</p>
            <p>目标方ip:{item['TargetIPAddress']}</p>
            <p>目标方mac:{item['TargetMACAddress']}</p>
            <p>
              类型:
              {item['TargetMACAddress'] == '00:00:00:00:00:00'
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
          dataSource={objToArray}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <p>{props.switch.filtermap[item]}</p>
              <p>{item}</p>
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
      title={'交换机网段：' + props.switch.ipAddress.split('.')[2]}
      tabList={tabList}
      activeTabKey={activeTabKey}
      onTabChange={onTabChange}
    >
      {contentList[activeTabKey]}
    </Card>
  );
};
