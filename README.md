# 小提琴指板图 (Violin Fingerboard)

互动式小提琴指板工具，展示精确的半音位置、音名、频率与弦长百分比，帮助小提琴学习者理解指板与音准关系。

在线体验：<https://violin.chienwen.net/zh-cn/board>

## 功能特性

- **精确指位**：按弦长比例精确标注指板上每个半音位置
- **音名 / 频率 / 弦长百分比**：点击任意音位查看详细参数
- **可自定义音高标准**：支持 A=440Hz、A=442Hz 等常用标准
- **双调律系统**：可切换纯律（Just Intonation）与十二平均律（Equal Temperament）
- **指法学习**：支持显示不同把位与换把练习
- **发音试听**：基于 WebAudioFont 的音色播放，点击指位即可试听音高

## 技术栈

- 静态站点（Nuxt 静态构建产物）
- [Vuetify](https://vuetifyjs.com/) UI 组件库
- [WebAudioFont](https://surikov.github.io/webaudiofont/) 音源播放
- 多语言支持（i18n，40+ 语言）

## 目录结构

```
.
├── index.html                     # 入口页（重定向至指板页）
├── zh-cn/board/index.html         # 小提琴指板图主页面
├── _nuxt/                         # Nuxt 静态构建资源
├── WebAudioFontPlayer.js          # WebAudioFont 播放器
├── 0400_Aspirin_sf2_file.js       # 小提琴音色库（SF2 数据）
└── favicon.* / site.webmanifest   # 站点图标与 PWA 清单
```

## 本地预览

项目为纯静态文件，无需构建。可用任意静态文件服务器托管：

```bash
# 例如使用 Python 内置服务器
python3 -m http.server 8080
```

然后访问 <http://localhost:8080>，页面会自动跳转到指板图。

## 关于指板位置计算

指板上各音的位置根据"弦长百分比"精确定位：开放式空弦为 0%，手指按下位置按振动弦长比计算。配合可选的音高标准（A4 频率）与调律系统（纯律 / 十二平均律），可模拟真实小提琴的音准训练。

## License

本项目仅供学习参考。