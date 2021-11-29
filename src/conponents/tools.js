import React from 'react';
import { Card, Col, Row, Input } from 'antd';
const { Search } = Input;

export const AddSwitch = (props) => {
  const onSearch = (value) => {
    const num = parseInt(value.split('.')[0]);
    props.newSwitch(num);
  };
  return (
    <Row justify="space-around" align="middle">
      <Col span={6} size={'large'}>
        <Card hoverable={true}>
          <Search
            addonBefore="172.16."
            size="large"
            enterButton="新建网段"
            onSearch={onSearch}
          />
        </Card>
      </Col>
    </Row>
  );
};

export const AddPc = (props) => {
  const onSearch = (value) => {
    // console.log(value);
    props.addPc(value, props.gataWay);
  };

  return (
    <Col flex={5}>
      <Card title="新加主机" hoverable={true}>
        <Search
          addonBefore={'172.16.' + props.gataWay + '.'}
          enterButton="Submit"
          onSearch={onSearch}
        />
      </Card>
    </Col>
  );
};
