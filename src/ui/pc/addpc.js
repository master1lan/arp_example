import React from 'react';
import { connect } from 'umi';
import { Col, Card, Input } from 'antd';
const { Search } = Input;
const mapDispatchToProps = {
  add: (payload) => ({ type: 'network/addPC', payload }),
};

const Item = (props) => {
  const { add, gataWay } = props;
  const addPC = (value) => {
    value = '172.16.' + gataWay + '.' + value;
    add(value);
  };
  return (
    <Col flex={5}>
      <Card title="新加主机" hoverable={true}>
        <Search
          addonBefore={'172.16.' + gataWay + '.'}
          enterButton="Submit"
          onSearch={addPC}
        />
      </Card>
    </Col>
  );
};
export const add = connect(null, mapDispatchToProps)(Item);
