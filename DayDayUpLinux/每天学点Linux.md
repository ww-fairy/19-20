## 2019

### 0  记录此文档之前的事情

1. #### 无法在这个大型工作区中监视文件更改。请按照说明链接来解决此问题。

http://www.deadnine.com/somehow/2019/0208/1481.html

kill -s -9 pid号

ps aux| grep 想杀死进程

yum rpm包管理工具

**ssh:notty**：被黑客暴力破解ssh

https://blog.csdn.net/gammey/article/details/80404375

lastb

#### 1.conda 没法找到

安装好了anaconda但是没办法用conda命令怎么办.

```cmd
step1: 查看环境变量 
env
step2: 添加环境变量
export PATH=$PATH:/home/jingtian17/anaconda3
用户名改成自己的 
step3: 设置永久有效
source ~/.bashrc
如果不退出，这次设置的环境变量退出bash就没了
```

#### 2.jupyter 使用

```cmd
step1: 复制 url 到本机浏览器
jupyter notebook   

step2:本机
ssh -N -L localhost:xxxx:localhost:xxxx username@223.3.89.188
```

#### 3.安装pytorch

```cmd
conda install pytorch torchvision cudatoolkit=10.0 -c pytorch
```

#### 4. 删除环境变量

https://www.cnblogs.com/zhangwuji/p/7899075.html

#### 5. Ubuntu下~/.bashrc文件的恢复方法

2018年02月18日 17:33:38 [yucicheung](https://me.csdn.net/yucicheung) 阅读数 7886



 版权声明：如要转载，请在本帖的评论中声明，并且在转载后文章中保留原文链接。 https://blog.csdn.net/yucicheung/article/details/79334998

##### 问题描述

如果不小心在更改环境变量文件`~/.bashrc`时出现将文件内容覆盖的情况，比如`echo hello world > ~/.bashrc`没有使用添加模式而是覆盖模式． 
**NOTE：非覆盖情况下，不推荐本文的方法．**

##### 解决方案

用系统中存储的`.bashrc`备份文件恢复到`~/`目录下，执行：

```
cp  /etc/skel/.bashrc   ~/1
```

其中，`/etc/skel`是Ubuntu的各种初始配置文件的存放目录.

### 9

#### 1.conda 换源

vim ~/.condarc

```
channels:
  - defaults
show_channel_urls: true
default_channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r
custom_channels:
  conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  msys2: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  bioconda: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  menpo: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
```

​	详见清华大学TUNA景镜像站

#### 2.vi 删除所有

命令为：`ggdG`

其中，gg为跳转到文件首行；dG为删除光标所在行以及其下所有行的内容；

再细讲，d为删除，G为跳转到文件末尾行；

#### 3. 前后台运行

**不挂断后台运行**

`nohup ./text &`

**查看前后台运行进程**

`jobs` : 查看当前终端后台运行的任务, 

`jobs -l`: (显示PID等信息)   （+：表示当前任务    - ：表示后一个任务）

`ps` : ` ps -aux|grep pid 端口号`  a:（all）显示所有进程    u ：以用户为主的格式     x : 所有的进程不以终端区分。

`lsof -i:端口号` 

`ps -aux/ef | grep 服务名称`

 **结束进程**            

`kill -9 % PID（or jobnum）` 

 **前后台进程的切换和控制**

`fg % PID（or jobnum）`

`bg % PID（or jobnum）:将后台暂停的进程，运行起来。`

#### 4.conda命令

**查看环境**

`conda info -e`

#### 5.pytorch 使用不同版本的cuda

https://www.cnblogs.com/yhjoker/p/10972795.html

#### 6. deb 安装

dpkg -i 安装包名字