
## 以下主要是自己踩过的坑，浪费大把时间，解决起来却很简单的问题：

#### 1.
首页滚动太快页面卡屏(出现半截，或者整个页面白屏在1秒左右恢复正常)

![1.png](https://upload-images.jianshu.io/upload_images/13029931-b3ce1cbe6240699a.png)
经过研究与分析，估计是房源列表导致，
通过以前的数据列表发现不会卡屏，定位为图片导致，卡屏的图片地址无图片格式后缀，图片也略大，达到了100kb-200kb，对比其他同类型网站图片在几十kb之间。还有一种可能阿里云oss配置可能有问题。

#### 2.
页面报错：
(以前的服务器能正常访问，部署到新服务器就报如下错误)

![1.png](https://upload-images.jianshu.io/upload_images/13029931-db708ed070048479.png)

开始一直以为环境不一致导致，因为旧服务器重新部署都能正常运行，新服务器始终不行。然后把新服务器node、npm、pm2都调整和旧服务器一致，然后重新部署还是出现该错误。
最后把nuxt.js配置依赖文件改为最新版本，发现还是无济于事。

最后只能把报错的页面页面全部注释掉，发现不会报错了，最后一步步排查，发现是ant-vue 的面包屑导航所致；

最后注释掉<span slot="separator">></span>错误DOMException: Failed to execute 'appendChild' on 'Node': This node type does not support this method.消失。

6f93dd10224baeea5975.js:2 TypeError: Cannot read property '_transitionClasses' of undefined错误是在create生命周期调用接口导致，放在mountd错误消失


#### 3.

react native 上传图片到oss始终失败
关闭debugger即可，打开debugger不能上传！
