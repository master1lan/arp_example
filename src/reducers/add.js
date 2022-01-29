import { message } from 'antd';
import { checkSegmentFormat, checkIPFormat } from '../conponents/check';

export const addSwitch = (state, action) => {
  if (!checkSegmentFormat(action.payload)) {
    message.error('非法网段');
    return state;
  }
  if (action.payload in state.switchList) {
    message.error('网段已存在');
    return state;
  }
  let { switchList, msg, Mapping } = state;
  switchList[action.payload] = {
    MACAddress: state.macUsed.addMacAddress(),
    PCList: [],
  };
  msg[switchList[action.payload]['MACAddress']] = [];
  Mapping[action.payload] = {
    ipaddress: 'macAddress',
  };
  message.success('创建成功');
  return { ...state, switchList, msg, Mapping };
};

export const addPC = (state, action) => {
  if (!checkIPFormat(action.payload)) {
    message.error('ip地址格式错误');
    return state;
  }

  let { switchList, msg, Mapping } = state;
  let segements = action.payload.split('.');
  segements[3] = 1;
  segements = segements.join('.');
  if (segements === action.payload) {
    message.error('该IP地址不可用');
    return state;
  }
  for (const item of switchList[segements]['PCList']) {
    if (item['IPAddress'] == action.payload) {
      message.error('ip已存在');
      return state;
    }
  }
  let macAddress = state.macUsed.addMacAddress();
  switchList[segements]['PCList'].push({
    IPAddress: action.payload,
    MACAddress: macAddress,
  });
  msg[macAddress] = [];
  Mapping[action.payload] = {
    ipaddress: 'macAddress',
    [segements]: switchList[segements]['MACAddress'],
  };
  return { ...state, switchList, msg, Mapping };
};
