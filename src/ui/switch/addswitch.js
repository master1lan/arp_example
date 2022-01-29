import React from 'react';
import { Card, Col, Row, Input } from 'antd';
const { Search } = Input;
import { connect } from 'umi';

const mapDispatchToProps = {
  add: (payload) => ({ type: 'network/addSwitch', payload }),
};

const Item = (props) => {
  const { add } = props;
  const addSwitch = (value) => {
    value = '172.16.' + value + '.1';
    add(value);
  };
  return (
    <Row justify="space-around" align="middle">
      <Col span={6} size={'large'}>
        <Card hoverable={true}>
          <Search
            addonBefore="172.16."
            size="large"
            enterButton="新建网段"
            onSearch={addSwitch}
          />
        </Card>
      </Col>
    </Row>
  );
};

export const Add = connect(null, mapDispatchToProps)(Item);
