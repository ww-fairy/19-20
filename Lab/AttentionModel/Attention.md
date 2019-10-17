LSTM

http://colah.github.io/posts/2015-08-Understanding-LSTMs/

http://karpathy.github.io/2015/05/21/rnn-effectiveness/

numpy实现 siraj raval LSTM

https://www.youtube.com/watch?v=9zhrxE5PQgY

对3d的肝进行LSTM， 按照Z轴切片， CNN找特征， LSTM理解注意力

注意力论文综述

https://blog.csdn.net/xys430381_1/article/details/89323444

图像分类中的注意力机制

https://blog.csdn.net/Wayne2019/article/details/78488142



### **Residual Attention Network for Image Classification**

注意力不仅仅是focus location ， 而且还是 different representation of objects

---

自然图片的文本识别一直是一个热门的研究领域，目前主流的做法由之前的CNN+RNN+CTC变成了CNN+attention-based encoder-decoder framework

![1569585732435](./img/1569585732435.png)

图a所示就是一般的 attention-based 网络结构，图中有一些黄色的十字，这表示在识别每一位字符的时候注意力集中的位置，可以发现前面"8"和"3"的注意力机制还比较好，但到了后面"K"和"M"的时候，注意力已经偏掉了，所以导致最后识别出现错误。而本篇论文提出的Focusing Network能够成功的纠正注意力的偏移，让注意力重新集中到正确的位置，这是本文最大的创新。

[FAN]: https://arxiv.org/pdf/1709.02054.pdf

本篇论文的模型分为两个，第一个是Attention Network，第二个是Focusing Network

---

近几年来，深度学习与视觉注意力机制结合的研究工作，大多数是集中于使用掩码(mask)来形成注意力机制。掩码的原理在于通过另一层新的权重，将图片数据中关键的特征标识出来，通过学习训练，让深度神经网络学到每一张新图片中需要关注的区域，也就形成了注意力。

强注意力： reinforcelearning

Hard attention是一个随机过程: 不是输入所有隐状态导解码器,而是按照概率sisi对隐状态采样.为了进行梯度传播,需要利用Monte Carlo sampling估算梯度.

软注意力：(用image caption作为例子)

![1570770246710](img/1570770246710.png)

其中 < , > 可以变成tanh

注意力模型接受$n$个输入参数$y_1,...,y_n$(在前面的例子中相当于$h$)和一个上下文$c$, 返回一个向量$z$, 逻辑上$z$要是从输入$y_i$中生成的和$c$相关的摘要.更加精确的描述,$z$是$y_i$的算术平均值,权重就是每个$y_i$和上下文$c$的关联度. 
上面的例子中,上下文是生成的句子的开头,$y_i$是子图($h_i$)的CNN特征描述, 输出的是过滤后,而且和当前生成词相关的特征图.

attention model的一个有趣的特性是算术平均值的权重可以可视化,因此前面显示的图表中白色区域显示的就是图中权重较大的区域.

以下图形是image caption加入注意力模型的经典例子

![1570770613203](img/1570770613203.png)

编解码器RNN 英语法语例子

注意力模型暂时基于编解码器

写了个另外一篇MarkDown来看注意力模型在Image Caption上的东西

