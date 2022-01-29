import React from 'react';
import { connect } from 'umi';
import { Button } from 'antd';

const hello = (props) => {
  const { count, add, minus } = props;
  return (
    <div>
      <ul>
        {count.map((item, index) => {
          return <li key={index}>{item}</li>;
        })}
      </ul>
      <Button
        onClick={() => {
          add(Math.floor(Math.random() * 10));
        }}
      >
        +
      </Button>
      <Button
        onClick={() => {
          minus();
        }}
      >
        -
      </Button>
    </div>
  );
};

const mapStatetoprops = (state) => ({
  count: state.count,
});

const actionCreater = {
  add: (payload) => ({ type: 'count/add', payload }),
  minus: (payload) => ({ type: 'count/minus', payload }),
};

export default connect(mapStatetoprops, actionCreater)(hello);
