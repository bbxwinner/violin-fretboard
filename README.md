# 小提琴工具 (Violin Tools)

面向小提琴学习者的一站式互动工具集，包含**指板图**、**五度圈**与**旋律（MIDI）**三大模块。基于 Nuxt 3 构建，静态生成后部署于 GitHub Pages。

在线体验：<https://bbxwinner.github.io/violin-fretboard/>

## 功能模块

### 1. 小提琴指板图（`/board`）

按弦长比例精确标注指板上每个半音位置的互动指板。

- **多种显示内容**（可自由组合）：音名、唱名、频率、八度音（色块）、弦长 %、半音位置索引、钢琴黑键、琶音高亮
- **调性 / 音阶**：选择大调 / 小调后自动高亮音阶内音；升号调只显示升号、降号调只显示降号，小调使用小写字母（如 `g 小调`）
- **琶音试听**：一键播放当前调性的琶音
- **发音试听**：点击任意指位即可听到对应音符（自托管 WebAudioFont 小提琴音色，不依赖外部域名）
- **五线谱**：选中音符后以 VexFlow 渲染单音五线谱
- **音高标准**：支持 A=440Hz / 442Hz 或任意频率
- **双调律系统**：十二平均律 / 纯律（Just Intonation，3:2 完美五度）
- **主题**：
  - **经典**：简洁白底
  - **古朴小提琴**：CSS 绘制乌木指板（木纹纹理、上窄下宽的真实比例、琴弦按真实角度张开、银灰色琴弦）
- **可调节**：指板宽度、音名字体大小（按主题分别记忆）、弦长、每弦半音数、音量、发音长度
- 所有偏好自动保存到浏览器 `localStorage`

### 2. 五度圈（`/fifths`）

将五度圈叠加到小提琴指板上的可视化。

- 大调 / 小调切换，音级角色（主音、属音等）标注
- 把位标记（第 1–7 把位），可设置起止把位范围
- 小调变体：自然 / 和声 / 旋律（上行 / 下行）
- 可调节移动速度

### 3. 旋律 / MIDI（`/player`、`/melody/:id`）

- 导入 `.mid` / `.midi` / `.smf` 文件，指定调性与大 / 小调后保存
- 旋律保存在浏览器 `localStorage`
- 详情页以 VexFlow 渲染每个音轨的五线谱，显示调号、音符数、时长等概览
- 支持删除

## 技术栈

- [Nuxt 3](https://nuxt.com/)（Vue 3 + Vite，SSR + 静态生成）
- [Vuetify 3](https://vuetifyjs.com/) UI 组件库
- [Pinia 3](https://pinia.vuejs.org/) 状态管理
- [@nuxtjs/i18n](https://i18n.nuxtjs.org/) 国际化（41 种语言）
- [VexFlow 5](https://vexflow-to.github.io/vexflow/) 五线谱渲染
- [WebAudioFont](https://surikov.github.io/webaudiofont/) 音源播放（SF2 音色库已自托管于 `public/`）
- [midi-parser-js](https://github.com/tyc4653/midi-parser-js) MIDI 解析
- [@nuxtjs/sitemap](https://sitemap.nuxtjs.org/) + `nuxt-gtag` 站点地图与分析
- GitHub Actions 自动构建并部署到 GitHub Pages

## 目录结构

```
.
├── app.vue
├── nuxt.config.ts               # Nuxt 配置（模块 / i18n / base / sitemap）
├── layouts/
│   └── default.vue              # 全局布局（顶栏 / 导航 / 底部）
├── pages/
│   ├── index.vue                # 首页（模块入口卡片）
│   ├── board/index.vue          # 小提琴指板图
│   ├── fifths/index.vue         # 五度圈
│   ├── help.vue                 # 帮助 / 反馈 / 版本历史
│   ├── player.vue               # 旋律导入与列表（MIDI）
│   └── melody/[id].vue          # 旋律详情（五线谱渲染）
├── components/
│   ├── board/                   # 指板模块
│   │   ├── Finger.vue           # 指板容器（四根弦）
│   │   ├── VioolString.vue      # 单根弦（含琴弦倾斜）
│   │   ├── FingerPosition.vue   # 指位圆圈 / 八度色块
│   │   ├── FingerPositionLabel.vue
│   │   ├── NoteInfo.vue         # 音符信息 + 五线谱
│   │   └── Preferences.vue      # 偏好设置面板
│   ├── fifths/                  # 五度圈模块
│   └── MelodyTrackSummary.vue   # 旋律音轨概览
├── stores/
│   ├── board.ts                 # 指板状态（Pinia）
│   └── fifth.ts                 # 五度圈状态
├── composables/
│   └── useBoardPreference.ts    # 偏好读写（含按主题偏好）
├── plugins/
│   ├── music.ts                 # 音乐计算（位置 / 音名 / 调性 / 首选拼写）
│   ├── vexflow.client.ts        # VexFlow 客户端初始化
│   ├── melody.ts                # 旋律存取
│   └── ga.ts / vuetify.ts / fifths.ts
├── utils/                       # 音乐算法（指板位置、五度圈、音阶、旋律解析等）
├── i18n/locales/                # 41 种语言 JSON
└── public/                      # 静态资源
    ├── WebAudioFontPlayer.js    # WebAudioFont 播放器（自托管）
    └── 0400_Aspirin_sf2_file.js # 小提琴 SF2 音色库（自托管）
```

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:3000/violin-fretboard/）
npm run dev
```

> 开发时 `baseURL` 默认为 `/violin-fretboard/`，因此本地访问需带上该路径前缀。

## 构建与部署

### 本地构建

```bash
# 静态生成（产物输出到 .output/public/）
npm run generate

# 本地预览构建产物
npm run preview
```

### 部署到 GitHub Pages

部署由 GitHub Actions 自动完成（见 `.github/workflows/deploy.yml`）：向 `main` 分支 push 即触发构建与部署，也可在 Actions 页面手动运行。

**一次性设置**（仓库 Settings → Pages → Build and deployment → Source）：将来源从 “Deploy from a branch” 改为 **GitHub Actions**。

部署使用两个环境变量（已写入 workflow，可按需修改）：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `NUXT_APP_BASE_URL` | `/violin-fretboard/` | 项目页 base 路径；若改用自定义域名且部署在根路径，改为 `/` |
| `NUXT_SITE_URL` | `https://bbxwinner.github.io` | 站点规范 URL，用于 sitemap / hreflang |

## 多语言

界面支持 41 种语言（见 `i18n/locales/`），URL 采用语言前缀（如 `/zh-cn/board`）。新增或修改文案时，请同步更新各语言文件；缺失的键会回退到默认语言 `en`。

## License

本项目仅供学习参考。
