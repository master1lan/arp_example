import React from 'react';
import { connect } from 'umi';
import { Layout, Row, Col } from 'antd';
import { PCList, AddPC, Switch, NewSwitch } from '../ui';

const test = (props) => {
  let { network } = props;
  // console.log(network.switchList);
  return (
    <div>
      {Object.keys(network.switchList).map((item, index) => {
        return (
          <Layout key={index}>
            <Row align="top">
              {/* 这里显示pc */}
              {network.switchList[item]['PCList'].length > 0 ? (
                <PCList
                  columns={network.switchList[item]['PCList'].length}
                  SwitchIpAddress={item}
                />
              ) : null}
              {network.switchList[item]['PCList'].length < 3 ? (
                <Col flex={1}>
                  <AddPC gataWay={item.split('.')[2]} />
                </Col>
              ) : null}
              <Col flex={1}>
                {/* 这里显示交换机 */}
                <Switch ipAddress={item} />
              </Col>
            </Row>
          </Layout>
        );
      })}
      <NewSwitch />
    </div>
  );
};

const mapStateToProps = (state) => ({
  network: state.network,
});

export default connect(mapStateToProps)(test);
