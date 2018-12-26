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

