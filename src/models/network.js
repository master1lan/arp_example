import reducer from '../reducers';
import MACSet from '../conponents/mac';
/**
 * 我们的state是怎样的？
 */
export default {
  namespace: 'network',
  state: {
    /**
     * 172.10.22.0:{
     * MACAddress:string,
     * PCList:[{
     *   IPAddress:string,
     *   MACAddress:string
     *      }]
     * }
     */
    switchList: {
      '172.16.10.1': {
        MACAddress: 'BB:05:72:C4:A7:45',
        PCList: [
          {
            IPAddress: '172.16.10.2',
            MACAddress: '71:51:00:C4:35:62',
          },
        ],
      },
    },
    /**
     * 'MACAddress':[msg]
     */
    msg: {
      'BB:05:72:C4:A7:45': [],
      '71:51:00:C4:35:62': [],
    },
    /**
     * 'ipaddress':{
     * 'ipaddress':'MACAddress'
     * }
     */
    Mapping: {
      '172.16.10.1': {
        ipaddress: 'macAddress',
        '172.16.10.2': '71:51:00:C4:35:62',
      },
      '172.16.10.2': {
        ipaddress: 'macAddress',
        '172.16.10.1': 'BB:05:72:C4:A7:45',
      },
    },
    macUsed: MACSet,
  },

  reducers: { ...reducer },
};
