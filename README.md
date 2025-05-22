# TTSMaker Free API (Python FastAPI 版)

## 项目简介

本项目是一个基于 FastAPI + Selenium 的文字转语音（TTS）API服务，逆向适配 TTSMaker 免费接口，支持 Docker 部署与开发。

- 支持自定义文本转语音，返回 mp3 链接
- 支持缓存，减少重复请求
- 提供 RESTful API，支持 OpenAPI 文档
- 可通过 Docker 一键开发、部署

## 目录结构

```
├── api/              # 路由与主程序
├── logs/             # 日志目录
├── cache/            # 缓存目录
├── requirements.txt  # Python依赖
├── Dockerfile        # Docker镜像构建
├── docker-compose.yml# Docker编排
├── run.py            # 开发热重载启动脚本
└── README.md         # 项目说明
```

## 快速开始

### 1. Docker 开发模式（推荐）

> **无需本地安装 Python 依赖，全部在容器内完成！支持热重载，代码改动自动生效。**

```bash
docker-compose up --build
```

- 首次运行会自动安装依赖。
- 访问: http://localhost:8000/docs 查看API文档。
- 修改代码后自动重载，无需重启容器。

### 2. 生产部署

```bash
docker-compose -f docker-compose.yml up -d --build
```
或
```bash
docker build -t ttsmaker-api .
docker run -d -p 8000:8000 ttsmaker-api
```

### 3. 本地运行（如需）

```bash
pip install -r requirements.txt
python run.py
```

## API 示例

### 文字转语音

```
POST /api/tts
Content-Type: application/json
{
  "text": "你好，世界！"
}
```
返回：
```
{
  "success": true,
  "url": "https://xxx.mp3",
  "message": "音频生成成功"
}
```

## 配置说明

- 主要参数可通过 docker-compose.yml 的 environment 字段配置。
- 日志和缓存目录已自动挂载到宿主机。

## 常见问题

- **依赖安装慢/失败**：建议使用国内镜像源或科学上网。
- **端口冲突**：确保 8000 端口未被占用。
- **热重载无效**：请确认 volumes 挂载和 run.py 的 reload=True。

## 免责声明

本项目为非官方逆向实现，仅供学习研究。请勿用于非法用途，由此产生的任何后果与作者无关。 