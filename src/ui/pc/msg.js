import React from 'react';
import { connect } from 'umi';
import { List } from 'antd';

const mapDispatchToProps = {
  deleteMsg: (payload) => ({ type: 'network/delete', payload }),
};

const mapStateToProps = (state) => ({
  msg: state.network.msg,
});

//这里渲染主机收到的message，只需要修改样式
const Item = (props) => {
  const { msg, macAddress, deleteMsg } = props;
  return (
    <List
      dataSource={msg[macAddress]}
      renderItem={(item, index) => (
        <List.Item key={index}>
          <p>发送方ip：{item['SenderIPAddress']}</p>
          <p>发送方mac：{item['SenderMACAddress']}</p>
          <p>消息：{item['Message']}</p>
          <button onClick={deleteMsg({ macAddress, index })}>X</button>
        </List.Item>
      )}
    />
  );
};

export const MsgItem = connect(mapStateToProps, mapDispatchToProps)(Item);
