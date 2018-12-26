---
layout: default
title: Hyperledger Fabric开发资料收集
---

* [超级账本Fabric - 开发模式（devmode）](https://zhuanlan.zhihu.com/p/33704154)

基于官方的`chaincode-docker-devmode`，用go语言来开发chaincode。

> nodejs版本执行效率总感觉很低下。。。

经常会用到的一些命令：

```
# 启动nodejs编写的chaincode
CORE_CHAINCODE_ID_NAME="mycc:v0" node --inspect mycc.js --peer.address grpc://localhost:7051

# OR
CORE_CHAINCODE_ID_NAME="mycc:v0" node main-chaincode.js --peer.address peer:7052

# 查看已经instantiated的链码
CORE_PEER_LOCALMSPID=Org1MSP CORE_PEER_MSPCONFIGPATH=/path/to/crypto-config/peerOrganizations/org1.example.com/users/Admin\@org1.example.com/msp peer chaincode list --instantiated -C mychannel

# invoke
CORE_PEER_LOCALMSPID=Org1MSP CORE_PEER_MSPCONFIGPATH=/path/to/crypto-config/peerOrganizations/org1.example.com/users/Admin\@org1.example.com/msp peer chaincode invoke -n mycc -C mychannel -c '{"Args": ["transfer", "A", "B", 100]}' -o localhost:7050

# install
CORE_PEER_LOCALMSPID=Org1MSP CORE_PEER_MSPCONFIGPATH=/path/to/crypto-config/peerOrganizations/org1.example.com/users/Admin\@org1.example.com/msp peer chaincode install -l node -n mycc -v v0 -p /User/xxx/nodejs-cc/

# instantiate
CORE_PEER_LOCALMSPID=Org1MSP CORE_PEER_MSPCONFIGPATH=/path/to/crypto-config/peerOrganizations/org1.example.com/users/Admin\@org1.example.com/msp peer instaniate -l node -n mycc -v v0 -C mychannel -c '{"args": ["init", "A", 100, "B", 100]}' -o localhost:7050

# 查看channel列表
CORE_PEER_LOCALMSPID=Org1MSP CORE_PEER_MSPCONFIGPATH=/path/to/crypto-config/peerOrganizations/org1.example.com/users/Admin\@org1.example.com/msp peer channel list

# 删除全部镜像（如channel存在的情况)
docker rm -f $(docker ps -aq)

# 删除chaincode镜像
docker rmi -f $(docker images | grep dev | awk '{print $3}')
```

* [Fabric-Node-SDK官方文档](https://fabric-sdk-node.github.io)

* [Go语言在线学习](https://go-tour-zh.appspot.com)

* [Docker命令查询](https://yeasy.gitbooks.io/docker_practice/appendix/command/)

* [Docker配置文件详解](https://www.jianshu.com/p/00c5939a64af)

* [Hyperledger Fabric 基于Kafka的多机部署](https://www.jianshu.com/p/9c84673374a5)

* [Fabric-Shim官方文档](https://fabric-shim.github.io)

* [更丰富，更多功能的chaincode例子](https://github.com/introclass/hyperledger-fabric-chaincodes/blob/master/demo/main.go)

* [99元的Hyperledger Fabric进阶实战课](https://study.163.com/course/introduction.htm?courseId=1005359012&_trace_c_p_k2_=baee0632f5b942ee93225f786954094c)

* [超级账本HyperLedger：Fabric的Chaincode（智能合约、链码）开发、使用演示](https://www.lijiaocn.com/%E9%A1%B9%E7%9B%AE/2018/07/17/hyperledger-fabric-chaincodes-example.html)

* [Fabric基于Kafka的共识机制剖析](https://zhuanlan.zhihu.com/p/29671493)
