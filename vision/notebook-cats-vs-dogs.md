<div class="alert alert-block alert-info"><h1 style="text-align:center;color:black"> Dogs Vs Cats Classification Problem <br>🐱 vs 🐕</h1> </div> 
狗和猫是基本CNN（卷积神经网络）模型的一个基本问题，该模型涉及将图像分类为狗或猫。该数据集可用于学习如何开发、评估和使用卷积深度学习神经网络对图像进行分类。这包括如何开发一个健壮的测试工具来估计模型的性能，通过改变模型的参数来探索模型的改进，保存和加载模型以对新数据进行预测。

<img src="https://ts1.cn.mm.bing.net/th/id/R-C.a4fb4b381e19df488540584dfd49a7b0?rik=VNzQsoMk92ViGA&riu=http%3a%2f%2fpic.616pic.com%2fphotoone%2f00%2f01%2f96%2f618cf161c3ff59689.jpg!%2ffw%2f1120&ehk=xO447Zm4pMtcJMGf1ljvHgVo951HwM9OWbkPsr5kotQ%3d&risl=&pid=ImgRaw&r=0" alt="图片描述">

<div class="alert alert-block alert-warning"><h2 style="text-align:Center;color:black">目录 </h2> </div>

1. [引言 💥](#1)
2. [数据描述](#2)
3. [加载库📖](#3)
4. [数据提取📁](#4)
5. [数据探索📊](#5)
6. [训练测试集分割](#6)
   1. [使用 DataFrame](#7)
   2. [使用目录](#8)
7. [数据准备 🛠️](#9)
   1. [图像数据生成器](#10)
      1. [使用 DataFrame](#11)
      2. [使用目录](#12)
8. [深度学习模型 ⚙️](#13)
   1. [模型层](#14)
   2. [回调函数](#15)
   3. [编译模型](#23)
   4. [拟合模型](#16)
   5. [绘制结果](#17)
   6. [评估](#18)
9. [预测](#19)
   1. [可视化分类图像](#20)
10. [提交](#21)
11. [结论](#22)

<a id='1'></a>
<div class="alert alert-block alert-danger"><h2 style="text-align:center;color:black"> 概要(=•ェ•=)</h2> </div> 

在这篇文章中，我们将发现如何开发一个CNN来对狗和猫的图像进行分类。
读完这篇文章，你会知道：
*如何加载和准备用于训练目的的图像。
*如何为训练和验证目的拆分数据。
*如何将数据增强应用于数据。
*如何使用keras开发CNN模型，以及如何选择各种参数来提高模型的性能。
*如何评估我们模型的性能。
*如何保存和加载模型以进行进一步预测。
*如何为训练好的模型绘制混淆矩阵。

<a id='2'></a>
<div class="alert alert-block alert-info"><h2 style="text-align:center;color:black"> 数据描述 </h2> </div>

训练档案包含25000张狗和猫的图片。
在这些文件上训练算法，并预测test1.zip的标签。
* **1 = dog**
* **0 = cat**


<a id='3'></a>
<div class="alert alert-block alert-info"><h2 style="text-align:center;color:black"> 加载库 </h2> </div> 


```python
# Basic
import os
from os import makedirs
from os import listdir
from shutil import copyfile
from random import seed
from random import random
import numpy as np
import pandas as pd

# visuals
import seaborn as sns
import matplotlib.pyplot as plt
from matplotlib.image import imread
from PIL import Image

# Scikit-learn
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report,confusion_matrix,ConfusionMatrixDisplay

# Tensorflow
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.layers import Dense,MaxPooling2D,Dropout,Flatten,BatchNormalization,Conv2D
from tensorflow.keras.callbacks import ReduceLROnPlateau,EarlyStopping
from tensorflow.keras.models import load_model
```

<a id='4'></a>
<div class="alert alert-block alert-info"><h2 style="text-align:center;color:black"> 数据提取</h2> </div>


```python
train_path = "D:\桌面\非结构化\图像识别大作业/test1.zip"
test_path = "D:\桌面\非结构化\图像识别大作业/train.zip"

files = "D:\桌面\非结构化\图像识别大作业/working/"

import zipfile

with zipfile.ZipFile(train_path, 'r') as zipp:
    zipp.extractall(files)
    
with zipfile.ZipFile(test_path, 'r') as zipp:
    zipp.extractall(files)
```

    
    KeyboardInterrupt
    
    

### 在DataFrame中加载图像


```python
image_dir = "D:\\桌面\\非结构化\\图像识别大作业\\working\\train\\"

filenames = os.listdir(image_dir)
labels = [x.split(".")[0] for x in filenames]

data = pd.DataFrame({"filename": filenames, "label": labels})

data.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>filename</th>
      <th>label</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>cat.0.jpg</td>
      <td>cat</td>
    </tr>
    <tr>
      <th>1</th>
      <td>cat.1.jpg</td>
      <td>cat</td>
    </tr>
    <tr>
      <th>2</th>
      <td>cat.10.jpg</td>
      <td>cat</td>
    </tr>
    <tr>
      <th>3</th>
      <td>cat.100.jpg</td>
      <td>cat</td>
    </tr>
    <tr>
      <th>4</th>
      <td>cat.1000.jpg</td>
      <td>cat</td>
    </tr>
  </tbody>
</table>
</div>



<a id='5'></a>
<div class="alert alert-block alert-info"><h2 style="text-align:center;color:black"> 数据探索 </h2> </div>

首先，我们开始可视化感兴趣的变量。

让我们以网格格式查看更多的图片。

<h5 style="text-align:center;color:Green">我们可视化了一些狗的图片。</h5>


```python
plt.figure(figsize=(20,20)) # 指定整体网格大小
plt.subplots_adjust(hspace=0.4)


for i in range(10):
    
    plt.subplot(1,10,i+1)    # 网格中的图像数量是 10x10（100）
    filename = 'working/'+'train/' + 'dog.' + str(i) + '.jpg'
    image = imread(filename)
    plt.imshow(image)
    plt.title('Dog',fontsize=12)
    plt.axis('off')

plt.show()
```


    
![png](cats-vs-dogs-image-classification-using-cnn-95_files/cats-vs-dogs-image-classification-using-cnn-95_12_0.png)
    


<h5 style="text-align:center;color:Red">我们可视化了一些猫的图片。</h5>


```python
plt.figure(figsize=(20,20)) # 指定整体网格大小
plt.subplots_adjust(hspace=0.4)


for i in range(10):
    
    plt.subplot(1,10,i+1)    # 网格中的图像数量是 10x10（100）
    filename = 'working/'+'train/' + 'cat.' + str(i) + '.jpg'
    image = imread(filename)
    plt.imshow(image)
    plt.title('Cat',fontsize=12)
    plt.axis('off')

plt.show()
```


    
![png](cats-vs-dogs-image-classification-using-cnn-95_files/cats-vs-dogs-image-classification-using-cnn-95_14_0.png)
    


图片大小不一。

每次运行单元格时，都会显示不同的图片集，可以扫描两个类别的图片。一些图片中存在人类可能会对模型进行分类构成挑战。

一些图片中包含多只猫或狗。

<a id='7'></a>
<div class="alert alert-block alert-warning"><h4 style="text-align:center;color:black"> 使用 Dataframe </h4> </div>


```python
# 使用数据框进行训练集和测试集的划分。

labels = data['label']

X_train, X_temp = train_test_split(data, test_size=0.2, stratify=labels, random_state = 42)

label_test_val = X_temp['label']

X_test, X_val = train_test_split(X_temp, test_size=0.5, stratify=label_test_val, random_state = 42)

print('The shape of train data',X_train.shape)
print('The shape of test data',X_test.shape)
print('The shape of validation data',X_val.shape)
```

    The shape of train data (21600, 2)
    The shape of test data (2700, 2)
    The shape of validation data (2700, 2)
    

现在我们将创建一个条形图，以查看训练数据集中的类别分布。


```python
import warnings
import seaborn as sns

# 忽略特定的 FutureWarning
with warnings.catch_warnings():
    warnings.simplefilter("ignore", category=FutureWarning)
    labels = ['Cat','Dog']
    
    label1,count1 = np.unique(X_train.label,return_counts=True)
    label2,count2 = np.unique(X_val.label,return_counts=True)
    label3,count3 = np.unique(X_test.label,return_counts=True)
    
    uni1 = pd.DataFrame(data=count1,index=labels,columns=['Count1'])
    uni2 = pd.DataFrame(data=count2,index=labels,columns=['Count2'])
    uni3 = pd.DataFrame(data=count3,index=labels,columns=['Count3'])
    
    
    plt.figure(figsize=(20,6),dpi=200)
    sns.set_style('darkgrid')
    
    # 绘制训练集分布图，并添加数字
    plt.subplot(131)
    sns.barplot(data=uni1, x=uni1.index, y='Count1', palette='icefire', width=0.2).set_title('Class distribution in Training set', fontsize=15)
    plt.xlabel('Labels', fontsize=12)
    plt.ylabel('Count', fontsize=12)
    for i in range(len(uni1)):
        plt.text(i, uni1.iloc[i]['Count1'], str(uni1.iloc[i]['Count1']), ha='center', va='bottom')
    
    # 绘制验证集分布图，并添加数字
    plt.subplot(132)
    sns.barplot(data=uni2, x=uni2.index, y='Count2', palette='icefire', width=0.2).set_title('Class distribution in validation set', fontsize=15)
    plt.xlabel('Labels', fontsize=12)
    plt.ylabel('Count', fontsize=12)
    for i in range(len(uni2)):
        plt.text(i, uni2.iloc[i]['Count2'], str(uni2.iloc[i]['Count2']), ha='center', va='bottom')
    
    # 绘制测试集分布图，并添加数字
    plt.subplot(133)
    sns.barplot(data=uni3, x=uni3.index, y='Count3', palette='icefire', width=0.2).set_title('Class distribution in Testing set', fontsize=15)
    plt.xlabel('Labels', fontsize=12)
    plt.ylabel('Count', fontsize=12)
    for i in range(len(uni3)):
        plt.text(i, uni3.iloc[i]['Count3'], str(uni3.iloc[i]['Count3']), ha='center', va='bottom')
    
    plt.show()
```


    
![png](cats-vs-dogs-image-classification-using-cnn-95_files/cats-vs-dogs-image-classification-using-cnn-95_19_0.png)
    


<a id='8'></a>
<div class="alert alert-block alert-warning"><h4 style="text-align:center;color:black"> 使用目录 </h4> </div>


```python
# 创建目录
dataset_home = 'D:\\桌面\\非结构化\\图像识别大作业\\dataset_dogs_vs_cats\\'
subdirs = ['train/', 'test/']

for subdir in subdirs:
    # 创建标签子目录
    labeldirs = ['dogs/', 'cats/']
    for labldir in labeldirs:
        newdir = dataset_home + subdir + labldir
        makedirs(newdir, exist_ok=True)
# 设置随机数生成器的种子
seed(1)
# 定义用于验证的图片比例
val_ratio = 0.2
# 将训练数据集的图像复制到子目录中
src_directory = 'D:\\桌面\\非结构化\\图像识别大作业\\working\\train'
for file in listdir(src_directory):
        src = src_directory + '/' + file
        dst_dir = 'train/'
        if random() < val_ratio:
            dst_dir = 'test/'
        if file.startswith('cat'):
            dst = dataset_home + dst_dir + 'cats/' + file
            copyfile(src, dst)
        elif file.startswith('dog'):
            dst = dataset_home + dst_dir + 'dogs/' + file
            copyfile(src, dst)

            
path1 = "D:\桌面\非结构化\图像识别大作业\dataset_dogs_vs_cats/train/cats"
path2 = "D:\桌面\非结构化\图像识别大作业\dataset_dogs_vs_cats/train/dogs"
path3 = "D:\桌面\非结构化\图像识别大作业\dataset_dogs_vs_cats/test/cats"
path4 = "D:\桌面\非结构化\图像识别大作业\dataset_dogs_vs_cats/test/dogs"


print('Then number of cat images in training data is' ,len(os.listdir(path1)))
print('Then number of dog images in training data is' ,len(os.listdir(path2)))
print('Then number of cat images in validation data is' ,len(os.listdir(path3)))
print('Then number of dog images in validation data is' ,len(os.listdir(path4)))

```

    <>:30: SyntaxWarning: invalid escape sequence '\d'
    <>:31: SyntaxWarning: invalid escape sequence '\d'
    <>:32: SyntaxWarning: invalid escape sequence '\d'
    <>:33: SyntaxWarning: invalid escape sequence '\d'
    <>:30: SyntaxWarning: invalid escape sequence '\d'
    <>:31: SyntaxWarning: invalid escape sequence '\d'
    <>:32: SyntaxWarning: invalid escape sequence '\d'
    <>:33: SyntaxWarning: invalid escape sequence '\d'
    C:\Users\Actor.D\AppData\Local\Temp\ipykernel_26244\3468285656.py:30: SyntaxWarning: invalid escape sequence '\d'
      path1 = "D:\桌面\非结构化\图像识别大作业\dataset_dogs_vs_cats/train/cats"
    C:\Users\Actor.D\AppData\Local\Temp\ipykernel_26244\3468285656.py:31: SyntaxWarning: invalid escape sequence '\d'
      path2 = "D:\桌面\非结构化\图像识别大作业\dataset_dogs_vs_cats/train/dogs"
    C:\Users\Actor.D\AppData\Local\Temp\ipykernel_26244\3468285656.py:32: SyntaxWarning: invalid escape sequence '\d'
      path3 = "D:\桌面\非结构化\图像识别大作业\dataset_dogs_vs_cats/test/cats"
    C:\Users\Actor.D\AppData\Local\Temp\ipykernel_26244\3468285656.py:33: SyntaxWarning: invalid escape sequence '\d'
      path4 = "D:\桌面\非结构化\图像识别大作业\dataset_dogs_vs_cats/test/dogs"
    

    Then number of cat images in training data is 10721
    Then number of dog images in training data is 10795
    Then number of cat images in validation data is 2779
    Then number of dog images in validation data is 2705
    

<a id='9'></a>
<div class="alert alert-block alert-info"><h2 style="text-align:center;color:black"> 数据准备 </h2> </div>

首先，我们将列出所有重要参数和各自的值。


```python
# 参数
image_size = 128
image_channel = 3
bat_size = 32
```

<a id='10'></a>
<div class="alert alert-block alert-danger"><h3 style="text-align:center;color:black">I图像数据生成器 </h3> </div>

* 数据将被flow_from_dataframe和flow_from_directory使用。
* 批量大小是32，图像尺寸是(128,128)。



```python
# Creating image data generator
train_datagen = ImageDataGenerator(rescale=1./255,
                                    rotation_range = 15,
                                    horizontal_flip = True,
                                    zoom_range = 0.2,
                                    shear_range = 0.1,
                                    fill_mode = 'reflect',
                                    width_shift_range = 0.1,
                                    height_shift_range = 0.1)

test_datagen = ImageDataGenerator(rescale=1./255)
```

<a id='11'></a>
<div class="alert alert-block alert-warning"><h4 style="text-align:center;color:black"> 使用 Dataframe </h4> </div>


```python
# 将图像数据生成器应用于训练和测试数据

train_generator = train_datagen.flow_from_dataframe(X_train,
                                                    directory = 'D:\\桌面\\非结构化\\图像识别大作业\\working\\train\\',
                                                    x_col= 'filename',
                                                    y_col= 'label',
                                                    batch_size = bat_size,
                                                    target_size = (image_size,image_size)
                                                   )
val_generator = test_datagen.flow_from_dataframe(X_val, 
                                                 directory = 'D:\\桌面\\非结构化\\图像识别大作业\\working\\train\\',
                                                 x_col= 'filename',
                                                 y_col= 'label',
                                                 batch_size = bat_size,
                                                 target_size = (image_size,image_size),
                                                 shuffle=False
                                                )

test_generator = test_datagen.flow_from_dataframe(X_test, 
                                                  directory = 'D:\\桌面\\非结构化\\图像识别大作业\\working\\train\\',
                                                  x_col= 'filename',
                                                  y_col= 'label',
                                                  batch_size = bat_size,
                                                  target_size = (image_size,image_size),
                                                  shuffle=False
                                                 )
```

    Found 21600 validated image filenames belonging to 2 classes.
    Found 2700 validated image filenames belonging to 2 classes.
    Found 2700 validated image filenames belonging to 2 classes.
    

<a id='12'></a>
<div class="alert alert-block alert-warning"><h4 style="text-align:center;color:black"> 使用目录 </h4> </div>


```python
train_gen = train_datagen.flow_from_directory('D:\桌面\非结构化\图像识别大作业\dataset_dogs_vs_cats/train/', 
                                              class_mode='binary',
                                              target_size = (image_size,image_size),
                                              batch_size = bat_size,
                                             )

val_gen = test_datagen.flow_from_directory('D:\桌面\非结构化\图像识别大作业\dataset_dogs_vs_cats/test/', 
                                          class_mode='binary',
                                          batch_size = bat_size,
                                          target_size = (image_size,image_size),
                                          shuffle = False
                                         )
```

    <>:1: SyntaxWarning: invalid escape sequence '\d'
    <>:7: SyntaxWarning: invalid escape sequence '\d'
    <>:1: SyntaxWarning: invalid escape sequence '\d'
    <>:7: SyntaxWarning: invalid escape sequence '\d'
    C:\Users\Actor.D\AppData\Local\Temp\ipykernel_26244\1070582499.py:1: SyntaxWarning: invalid escape sequence '\d'
      train_gen = train_datagen.flow_from_directory('D:\桌面\非结构化\图像识别大作业\dataset_dogs_vs_cats/train/',
    C:\Users\Actor.D\AppData\Local\Temp\ipykernel_26244\1070582499.py:7: SyntaxWarning: invalid escape sequence '\d'
      val_gen = test_datagen.flow_from_directory('D:\桌面\非结构化\图像识别大作业\dataset_dogs_vs_cats/test/',
    

    Found 21516 images belonging to 2 classes.
    Found 5484 images belonging to 2 classes.
    

<a id='13'></a>
<div class="alert alert-block alert-info"><h2 style="text-align:center;color:black"> 深度学习模型 </h2> </div>

<a id='14'></a>
<div class="alert alert-block alert-danger"><h3 style="text-align:center;color:black">模型层 </h3> </div>


### 架构

猫与狗图像分类模型的架构由以下层和组件组成：

####  层 :
* 输入层： 由一个具有32个滤波器和ReLU激活函数的Conv2D组成。
* 模型包含3个卷积块，滤波器数量逐渐增加，激活函数为ReLU。
* 每个卷积块包含批量归一化、最大池化（pool_size = 2）和Dropout（0.2）。
* 全连接层： 包含Flatten层、512个单元的Dense层和Dropout层。
* 输出层： 是一个具有2个单元和softmax激活函数的Dense层。

#### 组件:

* **输入层:** 接收用于分类的输入图像。
* **卷积层:** 通过卷积操作从图像中提取特征。
* **池化层:** 减少特征图的空间维度。
* **Flatten层:** 将2D特征图转换为1D向量。
* **全连接层:** 使用全连接层进行分类。
* **输出层:** 提供猫和狗类别的最终预测概率。


```python
model = Sequential()

# 输入层
model.add(Conv2D(32,(3,3),activation='relu',input_shape = (image_size,image_size,image_channel))) 
model.add(BatchNormalization())
model.add(MaxPooling2D(pool_size=(2,2)))
model.add(Dropout(0.2))

#  1 
model.add(Conv2D(64,(3,3),activation='relu'))
model.add(BatchNormalization())
model.add(MaxPooling2D(pool_size=(2,2)))
model.add(Dropout(0.2))
#  2
model.add(Conv2D(128,(3,3),activation='relu'))
model.add(BatchNormalization())
model.add(MaxPooling2D(pool_size=(2,2)))
model.add(Dropout(0.2))
#  3
model.add(Conv2D(256,(3,3),activation='relu'))
model.add(BatchNormalization())
model.add(MaxPooling2D(pool_size=(2,2)))
model.add(Dropout(0.2))

# 全连接层
model.add(Flatten())
model.add(Dense(512,activation='relu'))
model.add(BatchNormalization())
model.add(Dropout(0.2))

# 输出层
model.add(Dense(2,activation='softmax'))

model.summary()
```

    D:\anaconda\envs\pytorch\Lib\site-packages\keras\src\layers\convolutional\base_conv.py:107: UserWarning: Do not pass an `input_shape`/`input_dim` argument to a layer. When using Sequential models, prefer using an `Input(shape)` object as the first layer in the model instead.
      super().__init__(activity_regularizer=activity_regularizer, **kwargs)
    


<pre style="white-space:pre;overflow-x:auto;line-height:normal;font-family:Menlo,'DejaVu Sans Mono',consolas,'Courier New',monospace"><span style="font-weight: bold">Model: "sequential"</span>
</pre>




<pre style="white-space:pre;overflow-x:auto;line-height:normal;font-family:Menlo,'DejaVu Sans Mono',consolas,'Courier New',monospace">┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┓
┃<span style="font-weight: bold"> Layer (type)                    </span>┃<span style="font-weight: bold"> Output Shape           </span>┃<span style="font-weight: bold">       Param # </span>┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━┩
│ conv2d (<span style="color: #0087ff; text-decoration-color: #0087ff">Conv2D</span>)                 │ (<span style="color: #00d7ff; text-decoration-color: #00d7ff">None</span>, <span style="color: #00af00; text-decoration-color: #00af00">126</span>, <span style="color: #00af00; text-decoration-color: #00af00">126</span>, <span style="color: #00af00; text-decoration-color: #00af00">32</span>)   │           <span style="color: #00af00; text-decoration-color: #00af00">896</span> │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ batch_normalization             │ (<span style="color: #00d7ff; text-decoration-color: #00d7ff">None</span>, <span style="color: #00af00; text-decoration-color: #00af00">126</span>, <span style="color: #00af00; text-decoration-color: #00af00">126</span>, <span style="color: #00af00; text-decoration-color: #00af00">32</span>)   │           <span style="color: #00af00; text-decoration-color: #00af00">128</span> │
│ (<span style="color: #0087ff; text-decoration-color: #0087ff">BatchNormalization</span>)            │                        │               │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ max_pooling2d (<span style="color: #0087ff; text-decoration-color: #0087ff">MaxPooling2D</span>)    │ (<span style="color: #00d7ff; text-decoration-color: #00d7ff">None</span>, <span style="color: #00af00; text-decoration-color: #00af00">63</span>, <span style="color: #00af00; text-decoration-color: #00af00">63</span>, <span style="color: #00af00; text-decoration-color: #00af00">32</span>)     │             <span style="color: #00af00; text-decoration-color: #00af00">0</span> │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ dropout (<span style="color: #0087ff; text-decoration-color: #0087ff">Dropout</span>)               │ (<span style="color: #00d7ff; text-decoration-color: #00d7ff">None</span>, <span style="color: #00af00; text-decoration-color: #00af00">63</span>, <span style="color: #00af00; text-decoration-color: #00af00">63</span>, <span style="color: #00af00; text-decoration-color: #00af00">32</span>)     │             <span style="color: #00af00; text-decoration-color: #00af00">0</span> │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ conv2d_1 (<span style="color: #0087ff; text-decoration-color: #0087ff">Conv2D</span>)               │ (<span style="color: #00d7ff; text-decoration-color: #00d7ff">None</span>, <span style="color: #00af00; text-decoration-color: #00af00">61</span>, <span style="color: #00af00; text-decoration-color: #00af00">61</span>, <span style="color: #00af00; text-decoration-color: #00af00">64</span>)     │        <span style="color: #00af00; text-decoration-color: #00af00">18,496</span> │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ batch_normalization_1           │ (<span style="color: #00d7ff; text-decoration-color: #00d7ff">None</span>, <span style="color: #00af00; text-decoration-color: #00af00">61</span>, <span style="color: #00af00; text-decoration-color: #00af00">61</span>, <span style="color: #00af00; text-decoration-color: #00af00">64</span>)     │           <span style="color: #00af00; text-decoration-color: #00af00">256</span> │
│ (<span style="color: #0087ff; text-decoration-color: #0087ff">BatchNormalization</span>)            │                        │               │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ max_pooling2d_1 (<span style="color: #0087ff; text-decoration-color: #0087ff">MaxPooling2D</span>)  │ (<span style="color: #00d7ff; text-decoration-color: #00d7ff">None</span>, <span style="color: #00af00; text-decoration-color: #00af00">30</span>, <span style="color: #00af00; text-decoration-color: #00af00">30</span>, <span style="color: #00af00; text-decoration-color: #00af00">64</span>)     │             <span style="color: #00af00; text-decoration-color: #00af00">0</span> │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ dropout_1 (<span style="color: #0087ff; text-decoration-color: #0087ff">Dropout</span>)             │ (<span style="color: #00d7ff; text-decoration-color: #00d7ff">None</span>, <span style="color: #00af00; text-decoration-color: #00af00">30</span>, <span style="color: #00af00; text-decoration-color: #00af00">30</span>, <span style="color: #00af00; text-decoration-color: #00af00">64</span>)     │             <span style="color: #00af00; text-decoration-color: #00af00">0</span> │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ conv2d_2 (<span style="color: #0087ff; text-decoration-color: #0087ff">Conv2D</span>)               │ (<span style="color: #00d7ff; text-decoration-color: #00d7ff">None</span>, <span style="color: #00af00; text-decoration-color: #00af00">28</span>, <span style="color: #00af00; text-decoration-color: #00af00">28</span>, <span style="color: #00af00; text-decoration-color: #00af00">128</span>)    │        <span style="color: #00af00; text-decoration-color: #00af00">73,856</span> │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ batch_normalization_2           │ (<span style="color: #00d7ff; text-decoration-color: #00d7ff">None</span>, <span style="color: #00af00; text-decoration-color: #00af00">28</span>, <span style="color: #00af00; text-decoration-color: #00af00">28</span>, <span style="color: #00af00; text-decoration-color: #00af00">128</span>)    │           <span style="color: #00af00; text-decoration-color: #00af00">512</span> │
│ (<span style="color: #0087ff; text-decoration-color: #0087ff">BatchNormalization</span>)            │                        │               │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ max_pooling2d_2 (<span style="color: #0087ff; text-decoration-color: #0087ff">MaxPooling2D</span>)  │ (<span style="color: #00d7ff; text-decoration-color: #00d7ff">None</span>, <span style="color: #00af00; text-decoration-color: #00af00">14</span>, <span style="color: #00af00; text-decoration-color: #00af00">14</span>, <span style="color: #00af00; text-decoration-color: #00af00">128</span>)    │             <span style="color: #00af00; text-decoration-color: #00af00">0</span> │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ dropout_2 (<span style="color: #0087ff; text-decoration-color: #0087ff">Dropout</span>)             │ (<span style="color: #00d7ff; text-decoration-color: #00d7ff">None</span>, <span style="color: #00af00; text-decoration-color: #00af00">14</span>, <span style="color: #00af00; text-decoration-color: #00af00">14</span>, <span style="color: #00af00; text-decoration-color: #00af00">128</span>)    │             <span style="color: #00af00; text-decoration-color: #00af00">0</span> │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ conv2d_3 (<span style="color: #0087ff; text-decoration-color: #0087ff">Conv2D</span>)               │ (<span style="color: #00d7ff; text-decoration-color: #00d7ff">None</span>, <span style="color: #00af00; text-decoration-color: #00af00">12</span>, <span style="color: #00af00; text-decoration-color: #00af00">12</span>, <span style="color: #00af00; text-decoration-color: #00af00">256</span>)    │       <span style="color: #00af00; text-decoration-color: #00af00">295,168</span> │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ batch_normalization_3           │ (<span style="color: #00d7ff; text-decoration-color: #00d7ff">None</span>, <span style="color: #00af00; text-decoration-color: #00af00">12</span>, <span style="color: #00af00; text-decoration-color: #00af00">12</span>, <span style="color: #00af00; text-decoration-color: #00af00">256</span>)    │         <span style="color: #00af00; text-decoration-color: #00af00">1,024</span> │
│ (<span style="color: #0087ff; text-decoration-color: #0087ff">BatchNormalization</span>)            │                        │               │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ max_pooling2d_3 (<span style="color: #0087ff; text-decoration-color: #0087ff">MaxPooling2D</span>)  │ (<span style="color: #00d7ff; text-decoration-color: #00d7ff">None</span>, <span style="color: #00af00; text-decoration-color: #00af00">6</span>, <span style="color: #00af00; text-decoration-color: #00af00">6</span>, <span style="color: #00af00; text-decoration-color: #00af00">256</span>)      │             <span style="color: #00af00; text-decoration-color: #00af00">0</span> │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ dropout_3 (<span style="color: #0087ff; text-decoration-color: #0087ff">Dropout</span>)             │ (<span style="color: #00d7ff; text-decoration-color: #00d7ff">None</span>, <span style="color: #00af00; text-decoration-color: #00af00">6</span>, <span style="color: #00af00; text-decoration-color: #00af00">6</span>, <span style="color: #00af00; text-decoration-color: #00af00">256</span>)      │             <span style="color: #00af00; text-decoration-color: #00af00">0</span> │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ flatten (<span style="color: #0087ff; text-decoration-color: #0087ff">Flatten</span>)               │ (<span style="color: #00d7ff; text-decoration-color: #00d7ff">None</span>, <span style="color: #00af00; text-decoration-color: #00af00">9216</span>)           │             <span style="color: #00af00; text-decoration-color: #00af00">0</span> │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ dense (<span style="color: #0087ff; text-decoration-color: #0087ff">Dense</span>)                   │ (<span style="color: #00d7ff; text-decoration-color: #00d7ff">None</span>, <span style="color: #00af00; text-decoration-color: #00af00">512</span>)            │     <span style="color: #00af00; text-decoration-color: #00af00">4,719,104</span> │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ batch_normalization_4           │ (<span style="color: #00d7ff; text-decoration-color: #00d7ff">None</span>, <span style="color: #00af00; text-decoration-color: #00af00">512</span>)            │         <span style="color: #00af00; text-decoration-color: #00af00">2,048</span> │
│ (<span style="color: #0087ff; text-decoration-color: #0087ff">BatchNormalization</span>)            │                        │               │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ dropout_4 (<span style="color: #0087ff; text-decoration-color: #0087ff">Dropout</span>)             │ (<span style="color: #00d7ff; text-decoration-color: #00d7ff">None</span>, <span style="color: #00af00; text-decoration-color: #00af00">512</span>)            │             <span style="color: #00af00; text-decoration-color: #00af00">0</span> │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ dense_1 (<span style="color: #0087ff; text-decoration-color: #0087ff">Dense</span>)                 │ (<span style="color: #00d7ff; text-decoration-color: #00d7ff">None</span>, <span style="color: #00af00; text-decoration-color: #00af00">2</span>)              │         <span style="color: #00af00; text-decoration-color: #00af00">1,026</span> │
└─────────────────────────────────┴────────────────────────┴───────────────┘
</pre>




<pre style="white-space:pre;overflow-x:auto;line-height:normal;font-family:Menlo,'DejaVu Sans Mono',consolas,'Courier New',monospace"><span style="font-weight: bold"> Total params: </span><span style="color: #00af00; text-decoration-color: #00af00">5,112,514</span> (19.50 MB)
</pre>




<pre style="white-space:pre;overflow-x:auto;line-height:normal;font-family:Menlo,'DejaVu Sans Mono',consolas,'Courier New',monospace"><span style="font-weight: bold"> Trainable params: </span><span style="color: #00af00; text-decoration-color: #00af00">5,110,530</span> (19.50 MB)
</pre>




<pre style="white-space:pre;overflow-x:auto;line-height:normal;font-family:Menlo,'DejaVu Sans Mono',consolas,'Courier New',monospace"><span style="font-weight: bold"> Non-trainable params: </span><span style="color: #00af00; text-decoration-color: #00af00">1,984</span> (7.75 KB)
</pre>



<a id='15'></a>
<div class="alert alert-block alert-danger"><h3 style="text-align:center;color:black"> 回调函数 </h3> </div>
我们将使用两个回调函数： -

* **ReduceLROnPlateau :** 当一个指标停止改善时降低学习率。
* **EarlyStopping :** 当一个监控的指标停止改善时停止训练。


```python
learning_rate_reduction = ReduceLROnPlateau(monitor = 'val_accuracy',
                                            patience=10,
                                            factor=0.9,
                                            min_lr = 0.00000000001,
                                            verbose = 1)

early_stoping = EarlyStopping(monitor='val_loss',patience= 10,restore_best_weights=True,verbose=0)
```

<a id='23'></a>
<div class="alert alert-block alert-danger"><h3 style="text-align:center;color:black"> 编译模型 </h3> </div>

最终我们将编译模型。这里需要提及三件事情：优化器、损失函数和度量指标。

* **优化器** :- 为了最小化成本函数，我们使用不同的方法，例如：梯度下降、随机梯度下降。这些被称为优化器。我们这里使用的是默认的一个，即Adam。
​
* **损失函数** :- 为了改进我们的模型，我们要么最小化损失，要么最大化准确率。神经网络总是最小化损失。为了衡量它，我们可以使用不同的公式，比如'categorical_crossentropy'或'binary_crossentropy'。这里我使用了binary_crossentropy。
*      categorical_crossentropy 和 binary_crossentropy 都是交叉熵损失函数的不同形式，
*      它们在机器学习中用于衡量模型预测的概率分布与真实标签的概率分布之间的差异。它们的主要区别在于适用的场景和标签的表示方式：
*      binary_crossentropy：用于二分类问题，即输出有两个类别（例如，0和1）的情况。
*      categorical_crossentropy：用于多分类问题，即输出有多个类别的情况。
​
* **度量指标** :- 这是用来表示模型的衡量标准。可以是准确率或其他一些指标。


```python
model.compile(optimizer='adam',loss='binary_crossentropy',metrics=['accuracy'])
```

<a id='16'></a>
<div class="alert alert-block alert-danger"><h3 style="text-align:center;color:black"> 拟合模型 </h3> </div>

我们现在将使用训练迭代器（train_generator）来训练我们编译好的模型，并在训练期间使用验证迭代器（val_generator）作为验证数据集。

必须指定训练和验证迭代器的步数。这是构成一个周期的批次数量。这可以通过每个迭代器的长度来指定，并且将是训练和验证目录中的总图片数除以批量大小（32）。

模型将被训练30个周期。


```python
cat_dog = model.fit(train_generator,
                    validation_data = val_generator, 
                    callbacks=[early_stoping,learning_rate_reduction],
                    epochs = 60,
                    #steps_per_epoch = len(train_generator),指定每个周期中训练步骤的数量。
                    # 这个值通常是验证集中的总图片数除以每个批次的大小。Keras会默认使用train_generator提供的所有批次。
                    #validation_steps = len(val_generaotor),指定每个周期中验证步骤的数量。
                    # 这个值通常是验证集中的总图片数除以每个批次的大小。Keras会默认使用val_generator提供的所有批次。
                   )
```

    Epoch 1/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m145s[0m 211ms/step - accuracy: 0.8842 - loss: 0.2671 - val_accuracy: 0.8993 - val_loss: 0.2417 - learning_rate: 0.0010
    Epoch 2/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m146s[0m 216ms/step - accuracy: 0.8903 - loss: 0.2596 - val_accuracy: 0.9033 - val_loss: 0.2336 - learning_rate: 0.0010
    Epoch 3/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m139s[0m 206ms/step - accuracy: 0.8940 - loss: 0.2450 - val_accuracy: 0.9000 - val_loss: 0.2288 - learning_rate: 0.0010
    Epoch 4/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m138s[0m 204ms/step - accuracy: 0.8953 - loss: 0.2489 - val_accuracy: 0.8981 - val_loss: 0.2379 - learning_rate: 0.0010
    Epoch 5/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m139s[0m 206ms/step - accuracy: 0.8953 - loss: 0.2381 - val_accuracy: 0.9044 - val_loss: 0.2241 - learning_rate: 0.0010
    Epoch 6/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m139s[0m 206ms/step - accuracy: 0.8994 - loss: 0.2349 - val_accuracy: 0.9141 - val_loss: 0.2015 - learning_rate: 0.0010
    Epoch 7/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m141s[0m 208ms/step - accuracy: 0.9018 - loss: 0.2286 - val_accuracy: 0.9081 - val_loss: 0.2112 - learning_rate: 0.0010
    Epoch 8/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m141s[0m 209ms/step - accuracy: 0.9072 - loss: 0.2231 - val_accuracy: 0.8789 - val_loss: 0.2784 - learning_rate: 0.0010
    Epoch 9/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m142s[0m 211ms/step - accuracy: 0.9067 - loss: 0.2244 - val_accuracy: 0.9233 - val_loss: 0.1934 - learning_rate: 0.0010
    Epoch 10/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m142s[0m 210ms/step - accuracy: 0.9134 - loss: 0.2082 - val_accuracy: 0.9185 - val_loss: 0.1919 - learning_rate: 0.0010
    Epoch 11/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m144s[0m 213ms/step - accuracy: 0.9177 - loss: 0.2007 - val_accuracy: 0.9330 - val_loss: 0.1738 - learning_rate: 0.0010
    Epoch 12/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m142s[0m 210ms/step - accuracy: 0.9113 - loss: 0.2099 - val_accuracy: 0.9170 - val_loss: 0.1992 - learning_rate: 0.0010
    Epoch 13/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m142s[0m 211ms/step - accuracy: 0.9116 - loss: 0.2104 - val_accuracy: 0.9252 - val_loss: 0.1871 - learning_rate: 0.0010
    Epoch 14/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m142s[0m 210ms/step - accuracy: 0.9183 - loss: 0.1937 - val_accuracy: 0.9230 - val_loss: 0.1950 - learning_rate: 0.0010
    Epoch 15/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m142s[0m 210ms/step - accuracy: 0.9118 - loss: 0.2095 - val_accuracy: 0.9167 - val_loss: 0.2064 - learning_rate: 0.0010
    Epoch 16/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m142s[0m 210ms/step - accuracy: 0.9195 - loss: 0.1913 - val_accuracy: 0.9015 - val_loss: 0.2379 - learning_rate: 0.0010
    Epoch 17/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m142s[0m 211ms/step - accuracy: 0.9211 - loss: 0.1907 - val_accuracy: 0.9237 - val_loss: 0.1901 - learning_rate: 0.0010
    Epoch 18/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m142s[0m 211ms/step - accuracy: 0.9209 - loss: 0.1911 - val_accuracy: 0.9278 - val_loss: 0.1809 - learning_rate: 0.0010
    Epoch 19/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m142s[0m 210ms/step - accuracy: 0.9212 - loss: 0.1911 - val_accuracy: 0.9274 - val_loss: 0.1814 - learning_rate: 0.0010
    Epoch 20/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m142s[0m 210ms/step - accuracy: 0.9214 - loss: 0.1846 - val_accuracy: 0.9348 - val_loss: 0.1737 - learning_rate: 0.0010
    Epoch 21/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m142s[0m 210ms/step - accuracy: 0.9267 - loss: 0.1820 - val_accuracy: 0.9148 - val_loss: 0.2116 - learning_rate: 0.0010
    Epoch 22/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m142s[0m 210ms/step - accuracy: 0.9244 - loss: 0.1811 - val_accuracy: 0.9330 - val_loss: 0.1613 - learning_rate: 0.0010
    Epoch 23/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m145s[0m 214ms/step - accuracy: 0.9251 - loss: 0.1812 - val_accuracy: 0.9233 - val_loss: 0.1917 - learning_rate: 0.0010
    Epoch 24/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m144s[0m 213ms/step - accuracy: 0.9250 - loss: 0.1795 - val_accuracy: 0.9356 - val_loss: 0.1700 - learning_rate: 0.0010
    Epoch 25/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m144s[0m 214ms/step - accuracy: 0.9298 - loss: 0.1772 - val_accuracy: 0.9348 - val_loss: 0.1753 - learning_rate: 0.0010
    Epoch 26/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m143s[0m 212ms/step - accuracy: 0.9285 - loss: 0.1776 - val_accuracy: 0.9344 - val_loss: 0.1694 - learning_rate: 0.0010
    Epoch 27/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m143s[0m 213ms/step - accuracy: 0.9291 - loss: 0.1760 - val_accuracy: 0.9304 - val_loss: 0.1714 - learning_rate: 0.0010
    Epoch 28/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m144s[0m 213ms/step - accuracy: 0.9317 - loss: 0.1671 - val_accuracy: 0.9370 - val_loss: 0.1636 - learning_rate: 0.0010
    Epoch 29/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m144s[0m 213ms/step - accuracy: 0.9274 - loss: 0.1720 - val_accuracy: 0.9189 - val_loss: 0.1859 - learning_rate: 0.0010
    Epoch 30/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m144s[0m 213ms/step - accuracy: 0.9274 - loss: 0.1751 - val_accuracy: 0.9433 - val_loss: 0.1504 - learning_rate: 0.0010
    Epoch 31/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m144s[0m 213ms/step - accuracy: 0.9360 - loss: 0.1585 - val_accuracy: 0.9248 - val_loss: 0.1834 - learning_rate: 0.0010
    Epoch 32/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m144s[0m 213ms/step - accuracy: 0.9362 - loss: 0.1589 - val_accuracy: 0.9307 - val_loss: 0.1670 - learning_rate: 0.0010
    Epoch 33/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m143s[0m 212ms/step - accuracy: 0.9349 - loss: 0.1649 - val_accuracy: 0.9296 - val_loss: 0.1741 - learning_rate: 0.0010
    Epoch 34/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m144s[0m 213ms/step - accuracy: 0.9353 - loss: 0.1567 - val_accuracy: 0.9407 - val_loss: 0.1537 - learning_rate: 0.0010
    Epoch 35/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m144s[0m 213ms/step - accuracy: 0.9357 - loss: 0.1589 - val_accuracy: 0.9393 - val_loss: 0.1573 - learning_rate: 0.0010
    Epoch 36/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m145s[0m 215ms/step - accuracy: 0.9346 - loss: 0.1589 - val_accuracy: 0.9174 - val_loss: 0.2011 - learning_rate: 0.0010
    Epoch 37/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m143s[0m 212ms/step - accuracy: 0.9375 - loss: 0.1539 - val_accuracy: 0.9311 - val_loss: 0.1763 - learning_rate: 0.0010
    Epoch 38/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m144s[0m 213ms/step - accuracy: 0.9349 - loss: 0.1562 - val_accuracy: 0.9433 - val_loss: 0.1547 - learning_rate: 0.0010
    Epoch 39/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m144s[0m 213ms/step - accuracy: 0.9356 - loss: 0.1565 - val_accuracy: 0.9270 - val_loss: 0.1900 - learning_rate: 0.0010
    Epoch 40/60
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 207ms/step - accuracy: 0.9391 - loss: 0.1526
    Epoch 40: ReduceLROnPlateau reducing learning rate to 0.0009000000427477062.
    [1m675/675[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m144s[0m 213ms/step - accuracy: 0.9391 - loss: 0.1526 - val_accuracy: 0.9196 - val_loss: 0.2026 - learning_rate: 0.0010
    

<a id='17'></a>
<div class="alert alert-block alert-danger"><h3 style="text-align:center;color:black"> 绘制结果 </h3> </div>


```python
# 准确率和损失随周期变化的图表

error = pd.DataFrame(cat_dog.history)

plt.figure(figsize=(18,5),dpi=200)
sns.set_style('darkgrid')

plt.subplot(121)
plt.title('Cross Entropy Loss',fontsize=15)
plt.xlabel('Epochs',fontsize=12)
plt.ylabel('Loss',fontsize=12)
plt.plot(error['loss'])
plt.plot(error['val_loss'])

plt.subplot(122)
plt.title('Classification Accuracy',fontsize=15)
plt.xlabel('Epochs',fontsize=12)
plt.ylabel('Accuracy',fontsize=12)
plt.plot(error['accuracy'])
plt.plot(error['val_accuracy'])

plt.show()
```


    
![png](cats-vs-dogs-image-classification-using-cnn-95_files/cats-vs-dogs-image-classification-using-cnn-95_40_0.png)
    


<a id='18'></a>
<div class="alert alert-block alert-danger"><h3 style="text-align:center;color:black"> 评估 </h3> </div>


我们将评估训练和验证数据的准确率和损失。


```python
# 对训练生成器进行评估
loss,acc = model.evaluate(train_generator,batch_size = bat_size, verbose = 0)

print('The accuracy of the model for training data is:',acc*100)
print('The Loss of the model for training data is:',loss)

# 对验证生成器进行评估
loss,acc = model.evaluate(val_generator,batch_size = bat_size, verbose = 0)

print('The accuracy of the model for validation data is:',acc*100)
print('The Loss of the model for validation data is:',loss)
```

    The accuracy of the model for training data is: 94.6481466293335
    The Loss of the model for training data is: 0.13402825593948364
    The accuracy of the model for validation data is: 94.33333277702332
    The Loss of the model for validation data is: 0.15038807690143585
    

最终，我们将训练好的模型进行保存，以便后续的使用。


```python
# 保存模型
model.save("model1.h5")
```

    WARNING:absl:You are saving your model as an HDF5 file via `model.save()` or `keras.saving.save_model(model)`. This file format is considered legacy. We recommend using instead the native Keras format, e.g. `model.save('my_model.keras')` or `keras.saving.save_model(model, 'my_model.keras')`. 
    

<a id='19'></a>
<div class="alert alert-block alert-info"><h2 style="text-align:center;color:black"> 预测 </h2> </div>

现在，我们将在测试数据集上对模型进行预测。


```python
# 预测
result = model.predict(test_generator,batch_size = bat_size,verbose = 0)

y_pred = np.argmax(result, axis = 1)

y_true = test_generator.labels

# 评估
loss,acc = model.evaluate(test_generator, batch_size = bat_size, verbose = 0)

print('The accuracy of the model for testing data is:',acc*100)
print('The Loss of the model for testing data is:',loss)
```

    D:\anaconda\envs\pytorch\Lib\site-packages\keras\src\trainers\data_adapters\py_dataset_adapter.py:121: UserWarning: Your `PyDataset` class should call `super().__init__(**kwargs)` in its constructor. `**kwargs` can include `workers`, `use_multiprocessing`, `max_queue_size`. Do not pass these arguments to `fit()`, as they will be ignored.
      self._warn_if_super_not_called()
    

    The accuracy of the model for testing data is: 93.92592310905457
    The Loss of the model for testing data is: 0.1489168107509613
    

分类报告


```python
labels =['Cat','Dog']
print(classification_report(y_true, y_pred,target_names=labels))
```

                  precision    recall  f1-score   support
    
             Cat       0.93      0.95      0.94      1350
             Dog       0.95      0.93      0.94      1350
    
        accuracy                           0.94      2700
       macro avg       0.94      0.94      0.94      2700
    weighted avg       0.94      0.94      0.94      2700
    
    

混淆矩阵


```python
confusion_mtx = confusion_matrix(y_true,y_pred) 

f,ax = plt.subplots(figsize = (8,4),dpi=200)
sns.heatmap(confusion_mtx, annot=True, linewidths=0.1, cmap = "gist_yarg_r", linecolor="black", fmt='.0f', ax=ax,cbar=False, xticklabels=labels, yticklabels=labels)

plt.xlabel("Predicted Label",fontsize=10)
plt.ylabel("True Label",fontsize=10)
plt.title("Confusion Matrix",fontsize=13)

plt.show()
```


    
![png](cats-vs-dogs-image-classification-using-cnn-95_files/cats-vs-dogs-image-classification-using-cnn-95_50_0.png)
    


<a id='20'></a>
<div class="alert alert-block alert-info"><h2 style="text-align:center;color:black"> 提交 </h2> </div>



```python
size =(128,128)

# loading into dataframe
test_dir = "D:\\桌面\\非结构化\\图像识别大作业\\working\\test1\\"
filenames = os.listdir(test_dir)
test_data = pd.DataFrame({"filename": filenames})
test_data['label'] = 'unknown'

# Create data genenerator for test data
test1_idg =  test_datagen.flow_from_dataframe(test_data, 
                                     test_dir, 
                                     x_col= "filename",
                                     y_col = 'label',
                                     batch_size = bat_size,
                                     target_size=size, 
                                     shuffle = False)

# Test Prediction
test1_predict = model.predict(test1_idg,verbose = 0)

test1_predict_argmax = np.argmax(test1_predict, axis=1)

y_test_pred = test1_predict_argmax

test_data['label'] = y_test_pred

# mapping
label_mapping = {0: 'cat', 1: 'dog'}
test_data['label'] = test_data['label'].map(label_mapping)
test_data.head()

# csv file output for submission
sub = pd.read_csv('D:\桌面\非结构化\图像识别大作业\sampleSubmission.csv',index_col='id')

sub['label'] = y_test_pred

sub.to_csv('D:\桌面\非结构化\图像识别大作业\submission.csv',index=True)
```

    <>:33: SyntaxWarning: invalid escape sequence '\s'
    <>:37: SyntaxWarning: invalid escape sequence '\s'
    <>:33: SyntaxWarning: invalid escape sequence '\s'
    <>:37: SyntaxWarning: invalid escape sequence '\s'
    C:\Users\Actor.D\AppData\Local\Temp\ipykernel_26244\1086223416.py:33: SyntaxWarning: invalid escape sequence '\s'
      sub = pd.read_csv('D:\桌面\非结构化\图像识别大作业\sampleSubmission.csv',index_col='id')
    C:\Users\Actor.D\AppData\Local\Temp\ipykernel_26244\1086223416.py:37: SyntaxWarning: invalid escape sequence '\s'
      sub.to_csv('D:\桌面\非结构化\图像识别大作业\submission.csv',index=True)
    

    Found 12500 validated image filenames belonging to 1 classes.
    

    D:\anaconda\envs\pytorch\Lib\site-packages\keras\src\trainers\data_adapters\py_dataset_adapter.py:121: UserWarning: Your `PyDataset` class should call `super().__init__(**kwargs)` in its constructor. `**kwargs` can include `workers`, `use_multiprocessing`, `max_queue_size`. Do not pass these arguments to `fit()`, as they will be ignored.
      self._warn_if_super_not_called()
    




```python
fig, axes = plt.subplots(1, 10, figsize=(20, 4))
for idx in range(10):
    image_path = os.path.join(test_dir, test_data.iloc[idx]['filename'])
    image = Image.open(image_path)
    axes[idx].imshow(image)
    axes[idx].set_title("Label: " + test_data.iloc[idx]['label'])
    axes[idx].axis('off')
plt.tight_layout()
plt.show()
```


    
![png](cats-vs-dogs-image-classification-using-cnn-95_files/cats-vs-dogs-image-classification-using-cnn-95_54_0.png)
    



<a id='22'></a>
<div class="alert alert-block alert-info"><h2 style="text-align:center;color:black"> 结论 </h2> </div>



我们成功地构建了一个深度神经网络模型，通过实现卷积神经网络（CNN）来对猫和狗的图像进行分类，准确率高达93.93%。

该模型被用来预测独立测试集中图像的类别，并将结果提交以测试预测在新鲜数据上的准确性。

猫与狗图像分类模型展示了卷积神经网络在图像分类任务中成功实现的案例。通过准确区分猫和狗的图像，这个项目展示了深度学习算法在解决涉及图像分析的实际问题中的潜力。通过这个项目，我们旨在激发对CNN及其在各个领域应用的进一步探索。


```python
# 创建一个10x10的子图网格
fig, axes = plt.subplots(10, 10, figsize=(20, 20))  # 调整figsize以适应更多的图像

# 遍历前100个图像
for idx in range(100):
    # 获取图像路径
    image_path = os.path.join(test_dir, test_data.iloc[idx]['filename'])
    # 打开图像
    image = Image.open(image_path)
    # 获取当前子图的行和列索引
    row = idx // 10
    col = idx % 10
    # 在子图中显示图像
    axes[row, col].imshow(image)
    # 设置子图标题为标签
    axes[row, col].set_title("Label: " + test_data.iloc[idx]['label'])
    # 关闭子图的坐标轴
    axes[row, col].axis('off')

# 调整子图间距
plt.tight_layout()
# 显示图像
plt.savefig('output_image_grid.png', bbox_inches='tight', pad_inches=0.1)
plt.show()
```


    
![png](cats-vs-dogs-image-classification-using-cnn-95_files/cats-vs-dogs-image-classification-using-cnn-95_56_0.png)
    



```python
# 加载模型
model = load_model("model1.h5")

# 设置上传目录
upload_dir = "D:\\桌面\\非结构化\\图像识别大作业\\图片\\"
if not os.path.exists(upload_dir):
    os.makedirs(upload_dir)

# 预处理函数
def preprocess_image(img_path, target_size=(128, 128)):
    try:
        img = Image.open(img_path).convert('RGB')
        img = img.resize(target_size)
        img_array = np.array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0  # 归一化
        return img_array
    except Exception as e:
        print(f"Error processing image {img_path}: {e}")
        return None

# 预测函数
def predict_image(img_array, model):
    if img_array is not None:
        prediction = model.predict(img_array)
        return prediction
    else:
        return None

# 显示所有图像和预测概率的网格
def display_all_images_with_probabilities(filenames, predictions, true_labels):
    n_images = len(filenames)
    cols = 4  # 每行显示的图像数量
    rows = (n_images + cols - 1) // cols  # 计算需要的行数

    fig, axes = plt.subplots(rows, cols, figsize=(20, rows * 5))
    axes = axes.flatten()  # 将axes数组转换为一维，方便迭代

    correct_predictions = 0

    for i, ax in enumerate(axes):
        if i < n_images:
            img_path = os.path.join(upload_dir, filenames[i])
            img = Image.open(img_path)
            ax.imshow(img)
            pred = predictions[i]
            cat_prob, dog_prob = pred[0]  # 提取猫和狗的概率
            if max(cat_prob, dog_prob) > 0.65:  # 设置一个更高的阈值
                predicted_label = 'Cat' if cat_prob > dog_prob else 'Dog'
                base_filename = os.path.splitext(filenames[i])[0]  # 移除扩展名
                ax.set_title(f"{predicted_label} ({max(cat_prob, dog_prob):.2f})")
                if predicted_label == true_labels[base_filename]:
                    correct_predictions += 1
            else:
                ax.set_title(f"Not Sure (Cat: {cat_prob:.2f}, Dog: {dog_prob:.2f})")
            ax.axis('off')
        else:
            ax.axis('off')  # 如果没有足够的图像，隐藏多余的子图

    plt.tight_layout()
    plt.show()
    accuracy = correct_predictions / n_images
    print(f"Accuracy: {accuracy:.2f}")

# 用户上传图像并显示预测结果
def upload_and_predict():
    print("请将图像文件放入:", upload_dir)
    filenames = os.listdir(upload_dir)
    if not filenames:
        print("没有找到上传的图像文件。")
        return

    # 创建一个标签字典
    true_labels = {}
    for filename in filenames:
        base_filename = os.path.splitext(filename)[0]  # 移除扩展名
        if base_filename.startswith("cat"):
            true_labels[base_filename] = "Cat"
        elif base_filename.startswith("dog"):
            true_labels[base_filename] = "Dog"
        elif base_filename.startswith("Not Sure"):
            true_labels[base_filename] = "Not Sure"

    img_arrays = [preprocess_image(os.path.join(upload_dir, filename)) for filename in filenames]
    predictions = [predict_image(img_array, model) for img_array in img_arrays]

    display_all_images_with_probabilities(filenames, predictions, true_labels)

# 调用函数
upload_and_predict()
```

    WARNING:absl:Compiled the loaded model, but the compiled metrics have yet to be built. `model.compile_metrics` will be empty until you train or evaluate the model.
    

    请将图像文件放入: D:\桌面\非结构化\图像识别大作业\图片\
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 341ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 20ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 21ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 18ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 19ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 19ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 18ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 19ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 19ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 19ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 18ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 20ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 18ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 17ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 19ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 21ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 20ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 21ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 20ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 21ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 19ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 18ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 22ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 18ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 20ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 21ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 19ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 17ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 17ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 18ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 17ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 18ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 17ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 18ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 18ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 20ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 18ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 20ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 19ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 19ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 18ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 18ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 19ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 16ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 17ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 19ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 18ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 22ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 17ms/step
    [1m1/1[0m [32m━━━━━━━━━━━━━━━━━━━━[0m[37m[0m [1m0s[0m 17ms/step
    


    
![png](cats-vs-dogs-image-classification-using-cnn-95_files/cats-vs-dogs-image-classification-using-cnn-95_57_2.png)
    


    Accuracy: 0.74
    
