# arp-example
## 介绍
### 效果展示
https://master1lan.github.io/arp_example/
### arp协议介绍以及适应修改
* 作为地址解析协议arp协议建立在局域网相互信任的基础上
* 当无法在内部找到目标方的ip地址对应的mac地址，主机在当前局域网发送一个广播帧，所有收到的主机刷新该ip对应的mac地址，但只有目标ip地址的主机回应
* 当在不同网段下该如何得知对方mac地址？在这里，我们设计一个取巧的方法：只要不是该网段下的目标ip就直接发送给交换机让交换机进行转发
* 这里就引发一个问题：交换机如何得知其他网段交换机的mac地址？进而引发一系列超出arp协议范围的追问，为了简化我们人为规定 
  * 每个网段由一个交换机进行报文的转发
  * 每个网段的交换机知道该网段下的所有主机的mac地址
  * 当在一个网段新加一个主机默认发送一个arp报文通知交换机自己的mac地址和ip地址
  * 当新建一个网段将顺带新建一个交换机和一个主机，并且其他交换机会收到新建交换机的arp报文

* 这样修改后的arp协议执行顺序为：
  * 当主机在自己的mac表没找到目标方ip的mac地址将会在局域网发送一个广播帧
  * 局域网所有的主机(这将包括交换机)刷新发送主机的mac地址，但只有目标ip对应的主机回送一个arp报文告知自己的mac地址
  * 当目标方ip不在一个网段时直接将报文交给交换机(从另一种角度来看这种情况属于找到了目标方ip的mac地址)
  * 交换机将该报文发送给相应网段的交换机，如果对应交换机不知道对应ip的mac地址将进行广播

## 修改数据

