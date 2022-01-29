import React from 'react';
import { connect } from 'umi';
import { List } from 'antd';
import { PcItem } from './item';
import { add } from './addPC';

const mapStateToProps = (state) => ({
  Switch: state.network.switchList,
});

const Item = (props) => {
  const { Switch, SwitchIpAddress, columns } = props;
  return (
    <List
      grid={{ column: columns || 1 }}
      dataSource={Switch[SwitchIpAddress]['PCList']}
      renderItem={(item, index) => (
        <List.Item key={index}>
          <PcItem
            ipAddress={item['IPAddress']}
            macAddress={item['MACAddress']}
          />
        </List.Item>
      )}
    ></List>
  );
};

export const Add = add;
export const PC = connect(mapStateToProps)(Item);
