## ThunderSub
根据 [ThunderSubs](https://github.com/DCjanus/ThunderSubs) 项目中提供的逆向迅雷影音字幕API，使用 Electron Forge 实现的字幕下载器

## 技术栈
- electron
- electron-forge
- react
- react spring
- indexedDB

## v0.0.2
### 使用新接口获取字幕
  
![新接口](https://blog-pic-data.oss-cn-shenzhen.aliyuncs.com/img/微信截图_20241207163759.png)

旧版接口较新的电影已无法获取到字幕，新接口需要额外传 cid 和 gcid 参数，算法参考如下Python代码
```python
import hashlib
import os


def cid_hash_file(path):
    h = hashlib.sha1()
    size = os.path.getsize(path)
    with open(path, 'rb') as stream:
        if size < 0xF000:
            h.update(stream.read())
        else:
            h.update(stream.read(0x5000))
            stream.seek(int(size/3))
            h.update(stream.read(0x5000))
            stream.seek(size-0x5000)
            h.update(stream.read(0x5000))
    return h.hexdigest().upper()

def gcid_hash_file(path):
    h = hashlib.sha1()
    size = os.path.getsize(path)
    psize = 0x40000
    while size / psize > 0x200 and psize < 0x200000:
        psize = psize << 1
    with open(path, 'rb') as stream:
        data = stream.read(psize)
        while data:
            h.update(hashlib.sha1(data).digest())
            data = stream.read(psize)
    return h.hexdigest().upper()
```



