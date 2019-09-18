## 2019

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