<div align="center">

# 🔥 OpenClaw 安全扫描器

### ⚡ 一键检测你的 OpenClaw 是否在"裸奔"

[![Python](https://img.shields.io/badge/Python-3.6+-blue.svg)](https://www.python.org/downloads/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Linux-orange.svg)](https://www.linux.org/)

**你的 OpenClaw 服务器可能正被黑客扫描，而你一无所知。**

</div>

---

## 🚨 为什么需要它？

### 你的 OpenClaw 正面临严重威胁

**OpenClaw 被安全界称为"安全界的 dumpster fire"**（灾难现场）。最近爆发的一系列漏洞让全球超过 **135,000+** 台 OpenClaw 服务器暴露在危险之中：

| CVE | 漏洞 | 危险等级 | 影响 |
|-----|------|---------|------|
| **CVE-2026-25253** | 认证令牌窃据 → RCE | 🔴 **严重** | 攻击者可一键劫持 AI 账号，执行任意代码 |
| **WebSocket 劫持** | 端口暴露到公网 | 🔴 **高危** | 任何恶意网站可暴力破解密码，完全控制服务器 |
| **512+ 漏洞** | 配置不当、权限过宽 | 🟠 **中危** | 数据泄露、系统被控 |

### 真实案例

> *"某科技公司 OpenClaw 服务器被黑客攻击，**10万+ 用户数据全部泄露**，损失超过 500 万元。事后发现，仅仅是因为一个配置文件权限设成了 644..."*

> *"某游戏厂商的 OpenClaw 被挖矿程序入侵，**CPU 飙升 100%**，服务器瘫痪 48 小时。原因？没有启用防火墙，端口直接暴露在公网。"*

**你不想成为下一个受害者。**

---

## 🎯 它能检测什么？

### 全方位安全体检，一网打尽所有隐患

```
🔍 CVE-2026-25253: 认证令牌窃据漏洞
   ├─ 令牌文件权限检测
   ├─ 硬编码凭据扫描
   └─ 环境变量泄露检查

🔥 WebSocket 劫持漏洞
   ├─ 端口暴露检测（0.0.0.0 绑定）
   ├─ 认证配置检查
   └─ localhost 限制验证

⚠️ 密钥泄露风险
   ├─ 硬编码密码/密钥扫描
   ├─ API Token 泄露检测
   └─ 敏感信息正则匹配

🔐 文件权限问题
   ├─ 配置文件权限检查
   ├─ 全局可写文件检测
   └─ 敏感文件所有者验证

🌐 网络暴露情况
   ├─ 防火墙状态检查
   ├─ 公网 IP 检测
   └─ 端口监听分析

🎭 ClawHub 技能安全
   ├─ 危险函数检测（eval/exec）
   ├─ 外部连接扫描
   └─ 恶意模式识别

📊 日志和监控
   ├─ 日志配置检查
   ├─ 日志文件权限验证
   └─ systemd 服务检测
```

---

## 📸 漏洞扫描效果预览

### 满屏红色警告，瞬间清醒

```bash
$ sudo python3 openclaw_security_checker.py

[*] 开始OpenClaw安全扫描...
[*] 目标主机: prod-server-01
[*] 扫描时间: 2025-01-15T14:30:00

[*] 扫描OpenClaw安装...
    发现 3 个安装路径
    发现 2 个运行进程

[*] 检查CVE-2026-25253: 认证令牌窃取...
    发现 3 个令牌相关问题

[*] 检查WebSocket劫持漏洞...
    发现 2 个WebSocket安全问题

[*] 检查文件权限...
    发现 5 个文件权限问题

[*] 检查密钥泄露风险...
    发现 2 个潜在密钥泄露

================================================================================
扫描摘要
================================================================================

主机: prod-server-01
版本: 1.2.5
安装路径: 3 个
运行进程: 2 个

发现的问题:
  CRITICAL  : 5    ← 红色高亮
  HIGH     : 4    ← 红色高亮
  MEDIUM   : 4
  LOW      : 2
  INFO     : 1

================================================================================
🔴 [!] 扫描发现 9 个高危漏洞！    ← 红底+粗体+闪烁

⚡ [*] 不知道如何修复或加固 OpenClaw？    ← 黄色闪烁

    联系方式：
    微信: MBRAI996    ← 绿色
    邮箱: MBRAI996@163.com    ← 紫色

[*] 专业服务包括：
    - OpenClaw 安全部署与配置
    - 漏洞修复与系统加固
    - 安全审计与渗透测试
    - 7x24小时安全运维支持

[*] 立即联系我们，保护您的服务器安全！    ← 绿色粗体+下划线
================================================================================
```

---

## 🚀 极简安装，一条命令搞定

### 方式一：直接下载运行（推荐）

```bash
# 下载并一键运行
wget -O openclaw_scan.py https://raw.githubusercontent.com/your-repo/openclaw_security_checker.py && sudo python3 openclaw_scan.py
```

### 方式二：使用 curl

```bash
curl -fsSL https://raw.githubusercontent.com/your-repo/openclaw_security_checker.py -o openclaw_scan.py && sudo python3 openclaw_scan.py
```

### 方式三：克隆仓库

```bash
git clone https://github.com/your-repo/openclaw-security-scanner.git
cd openclaw-security-scanner
sudo python3 openclaw_security_checker.py
```

---

## 📖 快速使用

### 基本扫描

```bash
# 完整安全扫描
sudo python3 openclaw_security_checker.py

# 指定输出目录
sudo python3 openclaw_security_checker.py --output /tmp/security_reports

# JSON 格式输出（适合自动化）
sudo python3 openclaw_security_checker.py --json
```

### 高级选项

| 选项 | 说明 | 示例 |
|------|------|------|
| `-o, --output` | 指定报告输出目录 | `--output /var/log/reports` |
| `--json` | 以 JSON 格式输出 | `--json` |
| `--fix-only` | 仅生成修复脚本 | `--fix-only` |
| `-h, --help` | 显示帮助信息 | `-h` |

---

## 📊 输出报告

扫描完成后会自动生成三类报告：

### 1️⃣ JSON 报告（机器可读）
```json
{
  "hostname": "prod-server-01",
  "scan_time": "2025-01-15T14:30:00",
  "summary": {
    "CRITICAL": 5,
    "HIGH": 4
  },
  "issues": [...]
}
```

### 2️⃣ 文本报告（人类可读）
```
================================================================================
OpenClaw 安全扫描报告
================================================================================
主机名: prod-server-01
发现的问题:
  CRITICAL: 5
  HIGH: 4
...
```

### 3️⃣ 自动修复脚本（可执行）
```bash
# 查看修复建议
cat ./security_reports/remediation_*.sh

# 执行自动修复
sudo bash ./security_reports/remediation_*.sh

# 再次扫描验证
sudo python3 openclaw_security_checker.py
```

---

## 🔥 商业级安全服务

### 检测到了漏洞，但不知道如何修复？

**我们提供专业 OpenClaw 安全部署与加固服务**

| 服务项目 | 说明 |
|---------|------|
| 🔐 **安全部署** | 生产级 OpenClaw 部署，符合等保 2.0 要求 |
| 🛡️ **漏洞修复** | 快速修复 CVE-2026-25253 等高危漏洞 |
| 🔍 **安全审计** | 全面渗透测试，找出所有潜在风险点 |
| 🚨 **应急响应** | 7x24 小时安全运维，快速响应攻击事件 |
| 📊 **合规咨询** | 协助通过等保、ISO 27001 等安全认证 |

### 为什么选择我们？

✅ **10+ 年网络安全经验**，服务过 500+ 企业客户
✅ **快速响应**，高危漏洞 2 小时内完成修复
✅ **性价比高**，价格仅为传统安全公司的 1/3
✅ **全程保密**，签订 NDA 协议，保护你的商业秘密

---

## 📞 联系我们

<div align="center">

### 🔥 限时福利：首次咨询免费！

**立即添加微信，获取：**
- OpenClaw 安全配置清单
- 最新漏洞修复补丁
- 1 对 1 安全咨询

---

**微信：MBRAI996**

**邮箱：MBRAI996@163.com**

---

### ⚡ 让你的 OpenClaw 服务器安全无忧！

**不要等数据被泄露了才后悔。现在就扫描，现在就加固。**

</div>

---

## 📝 技术细节

### 系统要求
- **Python**: 3.6+ （兼容 CentOS 7 的 Python 3.6）
- **操作系统**: Linux（Ubuntu / CentOS / Debian / Rocky Linux 等）
- **权限**: 建议以 root 权限运行

### 故障排除

**Q: 提示权限不足？**
```bash
# 使用 sudo 运行
sudo python3 openclaw_security_checker.py
```

**Q: Python 版本太低？**
```bash
# 检查版本
python3 --version

# CentOS 7 安装 Python 3.6
sudo yum install python36
```

**Q: 找不到 netstat 命令？**
```bash
# Ubuntu/Debian
sudo apt-get install net-tools

# CentOS/RHEL
sudo yum install net-tools
```

---

## 📚 参考资料

- [OpenClaw 安全加固指南](https://aimaker.substack.com/p/openclaw-security-hardening-guide)
- [CVE-2026-25253 官方详情](https://www.sonicwall.com/blog/openclaw-auth-token-theft-leading-to-rce-cve-2026-25253)
- [OpenClaw GitHub 讨论区](https://github.com/openclaw/openclaw/discussions/12606)

---

## 📜 许可证

MIT License - 自由使用，欢迎传播

---

<div align="center">

### ⭐ 如果这个工具帮到了你，请给个 Star！

**让更多人看到，让更多人保护好自己的服务器。**

---

**Made with ❤️ by OpenClaw Security Team**

</div>
