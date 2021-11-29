import React from 'react';
import { Form, Input, Button, message } from 'antd';

/**
 * arp报文格式,destination为目标方，source为发送方
 * @param {String} destination_mac
 * @param {String} destination_ip
 * @param {String} source_mac
 * @param {String} source_ip
 * @param {String} message
 * @returns {Object}
 */
export const ArpFormat = (
  destination_mac,
  destination_ip,
  source_mac,
  source_ip,
  message,
) => {
  return {
    SenderMACAddress: source_mac,
    SenderIPAddress: source_ip,
    TargetMACAddress: destination_mac,
    TargetIPAddress: destination_ip,
    // 'Type': 'arp',
    Message: message,
    // 'Key':new Date().getTime()
  };
};

export const FormStyle = (props) => {
  const [form] = Form.useForm();
  const submit = () => {
    const formData = form.getFieldsValue();
    if (
      formData['TargetIPAddress'] == undefined ||
      formData['TargetIPAddress'].split('.').length < 4
    ) {
      message.error('请输入正确格式的ip地址！');
      return;
    } else {
      const check = formData['TargetIPAddress'].split('.');
      for (let i = 0; i < 4; i++) {
        if (!(check[i] < 256) && !(check[i] > 0)) {
          message.error('请输入正确格式的ip地址！');
          return;
        }
      }
    }
    if (
      formData['SenderIPAddress'] == undefined ||
      formData['SenderIPAddress'].split('.').length < 4
    ) {
      message.error('请输入正确格式的ip地址！');
      return;
    } else {
      const check = formData['SenderIPAddress'].split('.');
      for (let i = 0; i < 4; i++) {
        if (!(check[i] < 256) && !(check[i] > 0)) {
          message.error('请输入正确格式的ip地址！');
          return;
        }
      }
    }
    props.sendData(formData);
  };
  return (
    <Form
      name="arp_from"
      form={form}
      initialValues={{
        SenderIPAddress: props.ipAddress,
        SenderMACAddress: props.macAddress,
      }}
      autoComplete="off"
    >
      <Form.Item
        label="本机ip地址"
        name="SenderIPAddress"
        rules={[
          {
            required: true,
            message: 'need your ipaddress!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="本机mac地址"
        name="SenderMACAddress"
        rules={[
          {
            required: true,
            message: 'need your macaddress!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="ip地址"
        name="TargetIPAddress"
        rules={[
          {
            required: true,
            message: 'need your target ipaddress!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="消息" name="Message">
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={submit}>
          发送
        </Button>
      </Form.Item>
    </Form>
  );
};

/**
 * 'FF:FF:FF:FF:FF:FF'
 * @param {Set} MACset
 * @returns {String}
 */

export const newMAC = (MACset) => {
  var hexDigits = '0123456789ABCDEF';
  var macAddress = '';
  do {
    for (var i = 0; i < 6; i++) {
      macAddress += hexDigits.charAt(Math.round(Math.random() * 15));
      macAddress += hexDigits.charAt(Math.round(Math.random() * 15));
      if (i != 5) macAddress += ':';
    }
  } while (MACset.has(macAddress));
  return macAddress;
};

/**
 *
 * @param {String} a
 * @param {String} b
 * @return {Boolean}
 */
export const isSameSeg = (a, b) => {
  return a.split('.')[2] == b.split('.')[2];
};
