# Obsidian Live Photo Viewer

一个优雅的 Obsidian 插件，用于查看和管理 Live Photos，支持自动提取 OPPO 手机 Live Photo 格式。

## ✨ 特性

- 📸 **Live Photo 支持**: 原生支持在 Obsidian 中查看 Live Photos
- 🎥 **视频播放**: 图片和视频之间的无缝切换
- 🤖 **智能提取**: 自动从 OPPO 手机 Live Photo 文件中提取视频
- 🎨 **优雅设计**: 极简美学与流畅的交互动画
- 📱 **跨平台**: 支持桌面端和移动端
- 🔧 **灵活配置**: 支持手动指定图片和视频，或自动提取

## 🚀 安装

### 从 Obsidian 社区插件市场安装
1. 打开 Obsidian 设置
2. 进入社区插件
3. 搜索 "Live Photo Viewer"
4. 安装并启用插件

### 手动安装
1. 从 GitHub 下载最新版本
2. 解压 `main.js`、`styles.css` 和 `manifest.json`
3. 复制到 `VaultFolder/.obsidian/plugins/obsidian-live-photo/`
4. 在 Obsidian 设置中启用插件

## 🎯 使用方法

### 方式一：手动指定图片和视频
```markdown
```live
image: https://example.com/photo.jpg
video: https://example.com/video.mp4
```
```

### 方式二：自动提取（OPPO 手机 Live Photo）
```markdown
```live
image: https://example.com/livephoto.jpg
```
```

插件会自动检测图片文件，如果是 OPPO Live Photo 格式，会自动提取其中的视频(oss中跨域增加app://obsidian.md)。

## 🎨 设计理念

本插件遵循以下设计原则：

- **优雅的极简主义**: 干净精致的界面，不分散内容注意力
- **流畅的交互**: 精心制作的微交互和过渡动画
- **直观的用户体验**: 自然的用户流程，操作轻松无负担
- **清晰的视觉层级**: 通过微妙的阴影和模块化布局呈现信息结构
- **和谐的色彩**: 柔和的渐变色彩，与 Obsidian 主题完美融合

## 🛠️ 开发

### 环境要求
- Node.js (v16 或更高版本)
- pnpm 或 npm

### 开发设置
```bash
# 克隆仓库
git clone https://github.com/your-username/obsidian-live-photo.git
cd obsidian-live-photo

# 安装依赖
pnpm install

# 开发模式
pnpm run dev
```

### 构建
```bash
pnpm run build
```

## 📁 项目结构

```
obsidian-live-photo/
├── main.ts              # 主插件文件
├── styles.css           # 样式文件
├── live.svg            # Live Photo 图标
├── lib/
│   ├── livePhoto.ts    # Live Photo 提取逻辑
│   ├── types.ts        # TypeScript 类型定义
│   └── utils.ts        # 工具函数
├── manifest.json       # 插件清单
└── package.json        # 项目配置
```

## 🔧 技术特性

- **TypeScript**: 完整的类型支持和错误检查
- **模块化架构**: 清晰的代码组织和职责分离
- **错误处理**: 完善的错误捕获和用户友好的错误提示
- **性能优化**: 高效的文件处理和内存管理
- **跨平台兼容**: 支持各种操作系统和设备

## 🎭 支持的格式

- **图片格式**: JPEG, PNG, WebP, HEIC, HEIF
- **视频格式**: MP4, MOV, AVI, MKV, WebM
- **Live Photo**: OPPO 手机 Live Photo 格式 (.jpg with embedded video)

## 🤝 贡献

欢迎贡献代码！请随时提交 issues 和 pull requests。

### 贡献指南
1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

MIT 许可证 - 查看 LICENSE 文件了解详情。

## 🙏 致谢

- Obsidian 团队提供的优秀插件 API
- 社区的反馈和建议
- 所有贡献者的支持

## 🐛 问题反馈

如果您遇到任何问题或有功能建议，请在 [GitHub Issues](https://github.com/ryne6/obsidian-live-photo/issues) 中提出。
