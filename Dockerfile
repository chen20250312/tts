# 使用Python 3.9作为基础镜像
FROM python:3.9-slim

# 安装Chrome和ChromeDriver依赖
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    unzip \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 复制 requirements.txt 并安装依赖
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 创建日志和缓存目录
RUN mkdir -p logs cache

# 设置工作目录
WORKDIR /app

# 暴露端口
EXPOSE 8000

# 设置环境变量
ENV HOST=0.0.0.0
ENV PORT=8000
ENV PYTHONPATH=/app

# 开发模式下挂载代码，启动 run.py（支持热重载）
CMD ["python", "run.py"] 