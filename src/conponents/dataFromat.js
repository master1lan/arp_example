import React from 'react';
import { Form, Input, Button } from 'antd';

/**
 * arp报文格式,destination为目标方，source为发送方
 * @param {String} destination_mac
 * @param {String} destination_ip
 * @param {String} source_mac
 * @param {String} source_ip
 * @param {String} message
 * @returns {Object}
 */
export const arpFormat = (
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
    Type: 'arp',
    Message: message,
    // 'Key':new Date().getTime()
  };
};

export const FormStyle = (props) => {
  const [form] = Form.useForm();

  return (
    <Form
      name="arp_from"
      form={form}
      initialValues={{
        SenderIPAddress: props.ipAddress,
        SenderMACAddress: props.macAddress,
      }}
      onFinish={props.onFinish}
      autoComplete="off"
    >
      <Form.Item label="本机ip地址" name="SenderIPAddress">
        <Input />
      </Form.Item>
      <Form.Item label="本机mac地址" name="SenderMACAddress">
        <Input />
      </Form.Item>
      <Form.Item label="ip地址" name="TargetIPAddress">
        <Input />
      </Form.Item>
      <Form.Item label="消息" name="Message">
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary">发送</Button>
      </Form.Item>
    </Form>
  );
};
