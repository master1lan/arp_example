# arp-example
## 目标
### pages
https://master1lan.github.io/arp_example/
### 同网段下不同主机之间的交流是这样的
* 当主机arp表内没有对应ip主机的mac地址时，应该通过交换机进行广播，仅目标主机回应
* 当主机arp表内存在目标ip主机的mac地址时，直接交流
* 交换机记录每一次报文
### 不同网段下主机之间的交流
* 同上，不过增加交换机的mac地址，源mac地址为交换机的mac地址
## 页面结构与数据流向
### 页面结构
* 每一个网段为整一个结构，可增加网段；每一个网段最大页面为clientwidth*clientheight；所以应该注意单独网段里面主机的数量
* 网段结构左边展示主机群，右边展示交换机
* 当主机收到消息应该在下面显示，点击主机显示发送modal
* 发送modal包含mac地址，ip地址，内容；其中前两项默认，但是可以修改
* 交换机接受所有的报文并显示，点击交换机显示内部mac表
### 数据流向
* 所有设备都有一个单独的mac地址和至少一个ip地址
* 主机收到arp广播自动相应
* 不能对交换机进行处理
## 数据结构
* gataway:网关集合，最重要的对象，应该是array,每一项是一个对象{'macAddress':,'ipAddress':,'msg':}