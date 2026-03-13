#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
OpenClaw Security Checker & Remediation Tool
检测OpenClaw的安全漏洞并提供修复方案

兼容Python 3.6+

检测项目包括：
- CVE-2026-25253: 认证令牌窃取漏洞
- WebSocket劫持漏洞
- 配置文件权限问题
- 端口暴露情况
- 密钥泄露风险
- 恶意ClawHub技能检测
- 进程安全检查
"""

from __future__ import print_function
import os
import sys
import json
import socket
import subprocess
import re
import hashlib
from datetime import datetime
from pathlib import Path
from collections import namedtuple
from enum import Enum

# ANSI颜色代码
class Colors:
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    MAGENTA = '\033[95m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    BLINK = '\033[5m'
    BG_RED = '\033[101m'
    END = '\033[0m'

# 引流信息配置
CONTACT_INFO = {
    "wechat": "MBRAI996",
    "email": "MBRAI996@163.com"
}


# Python版本检查
if sys.version_info < (3, 6):
    print("错误: 此脚本需要 Python 3.6 或更高版本")
    print("当前版本: {}".format(sys.version))
    sys.exit(1)


class Severity(Enum):
    """漏洞严重程度"""
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    INFO = "INFO"


# 使用namedtuple替代dataclasses (兼容Python 3.6)
SecurityIssue = namedtuple('SecurityIssue', [
    'check_id', 'severity', 'title', 'description',
    'evidence', 'remediation', 'cve', 'fixed'
])


def create_security_issue(check_id, severity, title, description,
                         evidence="", remediation="", cve="", fixed=False):
    """创建SecurityIssue的工厂函数"""
    return SecurityIssue(
        check_id=check_id,
        severity=severity,
        title=title,
        description=description,
        evidence=evidence,
        remediation=remediation,
        cve=cve,
        fixed=fixed
    )


# 扫描结果类 (使用普通类以支持可变字段)
class ScanResult(object):
    """扫描结果数据结构"""

    def __init__(self):
        self.hostname = ""
        self.scan_time = ""
        self.openclaw_installed = False
        self.openclaw_version = ""
        self.openclaw_paths = []
        self.openclaw_processes = []
        self.issues = []
        self.summary = {}


class OpenClawSecurityChecker(object):
    """OpenClaw安全检查器主类"""

    # 已知的OpenClaw路径
    OPENCLAW_PATHS = [
        "/opt/openclaw",
        "/usr/local/bin/openclaw",
        "/var/lib/openclaw",
        "/etc/openclaw",
        "/home/*/openclaw",
        "/root/.openclaw",
        "~/.openclaw",
        "/opt/clawdbot",  # 旧名称
    ]

    # 已知的OpenClaw端口
    OPENCLAW_PORTS = [8188, 8080, 3000, 5000, 8888, 6969, 11434]

    # 常见的配置文件
    CONFIG_FILES = [
        "config.yaml",
        "config.json",
        ".env",
        "settings.yaml",
        "openclaw.conf",
        "clawrc",
    ]

    # 危险的ClawHub技能模式（已知恶意技能）
    MALICIOUS_SKILL_PATTERNS = [
        r"token.*leak",
        r"password.*dump",
        r"backdoor",
        r"reverse.*shell",
        r"eval.*exec",
        r"cmd.*execute",
        r"malicious",
    ]

    def __init__(self, output_dir="./security_reports"):
        """初始化检查器"""
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.result = ScanResult()
        self.result.scan_time = datetime.now().isoformat()
        self.result.hostname = self._get_hostname()

    def _get_hostname(self):
        """获取主机名"""
        try:
            return socket.gethostname()
        except Exception:
            return "unknown"

    def _run_command(self, cmd, timeout=30):
        """执行shell命令"""
        try:
            result = subprocess.run(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                universal_newlines=True,
                timeout=timeout,
                check=False
            )
            return result.returncode, result.stdout, result.stderr
        except subprocess.TimeoutExpired:
            return -1, "", "Command timeout"
        except Exception as e:
            return -1, "", str(e)

    def _check_file_exists(self, path):
        """检查文件是否存在"""
        path = Path(path).expanduser()
        return path.exists()

    def _get_file_permissions(self, path):
        """获取文件权限"""
        try:
            path = Path(path).expanduser()
            stat_info = path.stat()
            mode = oct(stat_info.st_mode)[-3:]
            return int(mode), path.owner()
        except Exception:
            return 0, "unknown"

    def scan_openclaw_installation(self):
        """扫描OpenClaw安装情况"""
        print("[*] 扫描OpenClaw安装...")

        # 检查进程
        returncode, stdout, _ = self._run_command(["ps", "aux"])

        if returncode == 0:
            for line in stdout.split('\n'):
                if 'openclaw' in line.lower() or 'clawdbot' in line.lower():
                    parts = line.split(None, 10)
                    if len(parts) >= 11:
                        self.result.openclaw_processes.append({
                            "user": parts[0],
                            "pid": parts[1],
                            "cpu": parts[2],
                            "mem": parts[3],
                            "command": parts[10]
                        })

        # 检查路径
        for path_pattern in self.OPENCLAW_PATHS:
            if '*' in path_pattern or '~' in path_pattern:
                # 使用glob扩展
                expanded = Path(path_pattern).expanduser()
                try:
                    for path in expanded.parent.glob(expanded.name):
                        if path.exists():
                            self.result.openclaw_paths.append(str(path))
                except Exception:
                    pass
            else:
                if self._check_file_exists(path_pattern):
                    self.result.openclaw_paths.append(path_pattern)

        # 检查版本
        for path in self.result.openclaw_paths:
            if 'bin' in path:
                returncode, stdout, _ = self._run_command([path, "--version"])
                if returncode == 0 and stdout:
                    self.result.openclaw_version = stdout.strip().split('\n')[0]
                    break

        self.result.openclaw_installed = (
            len(self.result.openclaw_paths) > 0 or
            len(self.result.openclaw_processes) > 0
        )

        print("    发现 {} 个安装路径".format(len(self.result.openclaw_paths)))
        print("    发现 {} 个运行进程".format(len(self.result.openclaw_processes)))

    def check_cve_2026_25253_token_theft(self):
        """检查CVE-2026-25253: 认证令牌窃取漏洞"""
        print("[*] 检查CVE-2026-25253: 认证令牌窃取...")

        issues = []

        # 检查令牌文件权限
        for path in self.result.openclaw_paths:
            path_obj = Path(path).expanduser()
            if path_obj.is_dir():
                # 查找可能的令牌文件
                for token_file in path_obj.rglob("*token*"):
                    mode, owner = self._get_file_permissions(str(token_file))
                    if mode > 600:
                        issues.append(create_security_issue(
                            check_id="CVE-2026-25253-001",
                            severity=Severity.CRITICAL,
                            title="认证令牌文件权限过宽",
                            description="令牌文件 {} 的权限为 {}，应设置为600或更严格".format(token_file, mode),
                            evidence="文件: {}, 权限: {}, 所有者: {}".format(token_file, mode, owner),
                            remediation="chmod 600 {}".format(token_file),
                            cve="CVE-2026-25253"
                        ))
                    # 检查令牌是否硬编码
                    try:
                        content = token_file.read_text(errors='ignore')
                        if any(kw in content.lower() for kw in ['password', 'secret', 'key', 'token']):
                            issues.append(create_security_issue(
                                check_id="CVE-2026-25253-002",
                                severity=Severity.CRITICAL,
                                title="配置文件中可能包含硬编码凭据",
                                description="文件 {} 可能包含硬编码的密码或密钥".format(token_file),
                                evidence="文件: {}".format(token_file),
                                remediation="将凭据移至安全的密钥管理系统或环境变量",
                                cve="CVE-2026-25253"
                            ))
                    except Exception:
                        pass

        # 检查环境变量
        returncode, stdout, _ = self._run_command(["printenv"])
        if returncode == 0:
            sensitive_vars = []
            for line in stdout.split('\n'):
                if any(kw in line.upper() for kw in ['TOKEN', 'PASSWORD', 'SECRET', 'KEY', 'CREDENTIAL']):
                    if 'OPENCLAW' in line.upper() or 'CLAW' in line.upper():
                        sensitive_vars.append(line.split('=')[0])
            if sensitive_vars:
                issues.append(create_security_issue(
                    check_id="CVE-2026-25253-003",
                    severity=Severity.HIGH,
                    title="环境变量中可能包含敏感凭据",
                    description="发现 {} 个可能包含敏感信息的环境变量".format(len(sensitive_vars)),
                    evidence="变量: {}".format(', '.join(sensitive_vars)),
                    remediation="使用安全的密钥管理服务，避免在环境变量中存储凭据",
                    cve="CVE-2026-25253"
                ))

        self.result.issues.extend(issues)
        print("    发现 {} 个令牌相关问题".format(len(issues)))

    def check_websocket_hijacking(self):
        """检查WebSocket劫持漏洞"""
        print("[*] 检查WebSocket劫持漏洞...")

        issues = []

        # 检查端口监听情况
        returncode, stdout, _ = self._run_command(["netstat", "-tlnp"])

        if returncode != 0:
            returncode, stdout, _ = self._run_command(["ss", "-tlnp"])

        if returncode == 0:
            for line in stdout.split('\n'):
                for port in self.OPENCLAW_PORTS:
                    if ":{}".format(port) in line and "LISTEN" in line:
                        # 检查是否绑定到0.0.0.0（所有接口）
                        if "0.0.0.0" in line or "::" in line:
                            issues.append(create_security_issue(
                                check_id="WS-HIJACK-001",
                                severity=Severity.CRITICAL,
                                title="OpenClaw端口 {} 暴露到所有网络接口".format(port),
                                description="OpenClaw服务绑定到0.0.0.0，可能遭受WebSocket劫持攻击",
                                evidence="监听端口: {}, 接口: 0.0.0.0 或 ::".format(port),
                                remediation="将服务绑定到127.0.0.1，使用反向代理(nginx)并配置适当的访问控制"
                            ))
                        # 检查是否缺乏认证
                        if "openclaw" in line.lower():
                            issues.append(create_security_issue(
                                check_id="WS-HIJACK-002",
                                severity=Severity.HIGH,
                                title="OpenClaw端口 {} 可能缺乏适当的认证".format(port),
                                description="OpenClaw WebSocket端口可能容易受到未经授权的访问",
                                evidence="端口: {}".format(port),
                                remediation="启用强身份验证，使用令牌认证，限制IP访问"
                            ))

        # 检查WebSocket配置
        for path in self.result.openclaw_paths:
            path_obj = Path(path).expanduser()
            if path_obj.is_dir():
                for config_file in path_obj.rglob("*.yaml"):
                    try:
                        content = config_file.read_text()
                        if 'websocket' in content.lower() or 'ws://' in content.lower():
                            if 'localhost' not in content.lower() and '127.0.0.1' not in content:
                                issues.append(create_security_issue(
                                    check_id="WS-HIJACK-003",
                                    severity=Severity.HIGH,
                                    title="WebSocket配置未限制为localhost",
                                    description="配置文件 {} 中的WebSocket设置可能允许外部连接".format(config_file),
                                    evidence="配置文件: {}".format(config_file),
                                    remediation="将WebSocket绑定限制为127.0.0.1，使用反向代理"
                                ))
                    except Exception:
                        pass

        self.result.issues.extend(issues)
        print("    发现 {} 个WebSocket安全问题".format(len(issues)))

    def check_file_permissions(self):
        """检查文件权限问题"""
        print("[*] 检查文件权限...")

        issues = []

        for path in self.result.openclaw_paths:
            path_obj = Path(path).expanduser()
            if not path_obj.exists():
                continue

            if path_obj.is_dir():
                for file_path in path_obj.rglob("*"):
                    if file_path.is_file():
                        mode, owner = self._get_file_permissions(str(file_path))
                        # 检查配置文件权限
                        if any(ext in file_path.name for ext in ['.yaml', '.json', '.conf', '.env']):
                            if mode > 600:
                                issues.append(create_security_issue(
                                    check_id="FILE-PERM-001",
                                    severity=Severity.MEDIUM,
                                    title="配置文件权限过宽: {}".format(file_path.name),
                                    description="配置文件权限为{}，应设置为600".format(mode),
                                    evidence="文件: {}, 权限: {}".format(file_path, mode),
                                    remediation="chmod 600 {}".format(file_path)
                                ))
                        # 检查全局可写文件
                        if mode & 0o2:
                            issues.append(create_security_issue(
                                check_id="FILE-PERM-002",
                                severity=Severity.HIGH,
                                title="文件可被其他用户写入: {}".format(file_path.name),
                                description="文件 {} 可被其他用户写入，存在安全风险".format(file_path),
                                evidence="文件: {}, 权限: {}".format(file_path, mode),
                                remediation="chmod o-w {}".format(file_path)
                            ))

        self.result.issues.extend(issues)
        print("    发现 {} 个文件权限问题".format(len(issues)))

    def check_secret_exposure(self):
        """检查密钥泄露风险"""
        print("[*] 检查密钥泄露风险...")

        issues = []
        secret_patterns = [
            r'(?:password|passwd|pwd)\s*[:=]\s*["\']?[\w]+',
            r'(?:api[_-]?key|apikey)\s*[:=]\s*["\']?[\w]+',
            r'(?:secret|token)\s*[:=]\s*["\']?[\w-]+\.[\w-]+\.[\w-]+',
            r'Bearer\s+[\w-]+\.[\w-]+\.[\w-]+',
            r'sk-[a-zA-Z0-9]{32,}',
        ]

        for path in self.result.openclaw_paths:
            path_obj = Path(path).expanduser()
            if path_obj.is_dir():
                # 跳过二进制目录
                if 'node_modules' in str(path_obj) or '__pycache__' in str(path_obj):
                    continue

                for file_path in path_obj.rglob("*"):
                    if file_path.is_file() and file_path.suffix in ['.py', '.js', '.yaml', '.yml', '.json', '.env', '.sh', '.conf']:
                        try:
                            content = file_path.read_text(errors='ignore')
                            for pattern in secret_patterns:
                                matches = re.findall(pattern, content, re.IGNORECASE)
                                if matches:
                                    # 脱敏显示
                                    masked_matches = [m[:10] + '***' if len(m) > 10 else m for m in matches[:3]]
                                    issues.append(create_security_issue(
                                        check_id="SECRET-001",
                                        severity=Severity.CRITICAL,
                                        title="可能存在密钥泄露: {}".format(file_path.name),
                                        description="在文件中发现可能包含密码或密钥的模式",
                                        evidence="文件: {}, 匹配: {}个, 示例: {}".format(file_path, len(matches), masked_matches),
                                        remediation="移除硬编码的凭据，使用环境变量或密钥管理服务"
                                    ))
                                    break
                        except Exception:
                            pass

        self.result.issues.extend(issues)
        print("    发现 {} 个潜在密钥泄露".format(len(issues)))

    def check_network_exposure(self):
        """检查网络暴露情况"""
        print("[*] 检查网络暴露...")

        issues = []

        # 检查防火墙状态
        returncode, stdout, _ = self._run_command(["ufw", "status"])
        if returncode == 0:
            if "inactive" in stdout.lower():
                issues.append(create_security_issue(
                    check_id="NET-001",
                    severity=Severity.MEDIUM,
                    title="防火墙未启用",
                    description="系统防火墙(UFW)未启用",
                    evidence="UFW状态: inactive",
                    remediation="启用防火墙: ufw enable && ufw default deny incoming"
                ))

        # 检查是否从外部可达
        returncode, stdout, _ = self._run_command(["ip", "addr", "show"])
        if returncode == 0:
            public_ips = []
            for line in stdout.split('\n'):
                if 'inet ' in line and '127.0.0.1' not in line:
                    match = re.search(r'inet\s+(\d+\.\d+\.\d+\.\d+)', line)
                    if match:
                        ip = match.group(1)
                        if not ip.startswith('192.168.') and not ip.startswith('10.'):
                            public_ips.append(ip)

            if public_ips:
                issues.append(create_security_issue(
                    check_id="NET-002",
                    severity=Severity.INFO,
                    title="检测到公网IP地址",
                    description="系统配置了公网IP地址，OpenClaw服务可能暴露到互联网",
                    evidence="公网IP: {}".format(', '.join(public_ips)),
                    remediation="确保OpenClaw仅绑定到localhost，使用VPN或防火墙限制访问"
                ))

        self.result.issues.extend(issues)
        print("    发现 {} 个网络暴露问题".format(len(issues)))

    def check_malicious_skills(self):
        """检查可能的恶意ClawHub技能"""
        print("[*] 检查ClawHub技能安全...")

        issues = []

        for path in self.result.openclaw_paths:
            path_obj = Path(path).expanduser()
            if path_obj.is_dir():
                # 查找skills目录
                skills_dirs = list(path_obj.rglob("*skills*")) + list(path_obj.rglob("*plugins*"))

                for skills_dir in skills_dirs:
                    if skills_dir.is_dir():
                        for skill_file in skills_dir.rglob("*.py"):
                            try:
                                content = skill_file.read_text()
                                # 检查可疑模式
                                suspicious_keywords = [
                                    ('eval', '使用eval()执行动态代码'),
                                    ('exec', '使用exec()执行动态代码'),
                                    ('__import__', '动态导入模块'),
                                    ('compile', '使用compile()编译代码'),
                                    ('subprocess.call', '执行系统命令'),
                                    ('os.system', '执行系统命令'),
                                    ('socket.socket', '创建网络连接'),
                                    ('urllib.request', '发起网络请求'),
                                ]

                                for keyword, desc in suspicious_keywords:
                                    if keyword in content:
                                        issues.append(create_security_issue(
                                            check_id="SKILL-001",
                                            severity=Severity.MEDIUM,
                                            title="技能可能存在危险操作: {}".format(skill_file.name),
                                            description="技能文件 {} {}".format(skill_file.name, desc),
                                            evidence="文件: {}, 关键词: {}".format(skill_file, keyword),
                                            remediation="审查技能代码，确保仅执行必要的操作"
                                        ))
                                        break

                                # 检查硬编码URL或IP
                                urls = re.findall(r'https?://[^\s<>"]+|www\.[^\s<>"]+', content)
                                ips = re.findall(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', content)
                                if urls or ips:
                                    issues.append(create_security_issue(
                                        check_id="SKILL-002",
                                        severity=Severity.LOW,
                                        title="技能可能包含外部连接: {}".format(skill_file.name),
                                        description="技能文件可能包含外部URL或IP地址",
                                        evidence="文件: {}, URLs: {}, IPs: {}".format(skill_file, len(urls), len(ips)),
                                        remediation="审查所有外部连接，确保安全可信"
                                    ))

                            except Exception:
                                pass

        self.result.issues.extend(issues)
        print("    发现 {} 个技能安全问题".format(len(issues)))

    def check_logging_monitoring(self):
        """检查日志和监控配置"""
        print("[*] 检查日志和监控...")

        issues = []

        # 检查是否有日志目录
        has_logs = False
        for path in self.result.openclaw_paths:
            path_obj = Path(path).expanduser()
            if path_obj.is_dir():
                log_dirs = list(path_obj.rglob("*logs*")) + list(path_obj.rglob("*log*"))
                if log_dirs:
                    has_logs = True
                    for log_dir in log_dirs:
                        if log_dir.is_dir():
                            # 检查日志文件权限
                            for log_file in log_dir.glob("*.log"):
                                mode, _ = self._get_file_permissions(str(log_file))
                                if mode > 644:
                                    issues.append(create_security_issue(
                                        check_id="LOG-001",
                                        severity=Severity.LOW,
                                        title="日志文件权限过宽: {}".format(log_file.name),
                                        description="日志文件权限为{}，可能包含敏感信息".format(mode),
                                        evidence="文件: {}, 权限: {}".format(log_file, mode),
                                        remediation="chmod 640 {}".format(log_file)
                                    ))

        if not has_logs:
            issues.append(create_security_issue(
                check_id="LOG-002",
                severity=Severity.MEDIUM,
                title="未检测到OpenClaw日志",
                description="无法找到OpenClaw日志目录，可能未启用日志记录",
                evidence="未发现logs目录",
                remediation="启用OpenClaw日志记录功能，定期审计日志"
            ))

        # 检查systemd服务（如果有）
        returncode, stdout, _ = self._run_command(["systemctl", "list-units", "--all"])
        if returncode == 0:
            if 'openclaw' in stdout.lower():
                issues.append(create_security_issue(
                    check_id="LOG-003",
                    severity=Severity.INFO,
                    title="OpenClaw作为系统服务运行",
                    description="OpenClaw通过systemd管理，建议配置日志轮转",
                    evidence="检测到systemd服务",
                    remediation="配置logrotate进行日志轮转，设置适当的日志保留策略"
                ))

        self.result.issues.extend(issues)
        print("    发现 {} 个日志和监控问题".format(len(issues)))

    def run_all_checks(self):
        """运行所有安全检查"""
        print("\n[*] 开始OpenClaw安全扫描...")
        print("[*] 目标主机: {}".format(self.result.hostname))
        print("[*] 扫描时间: {}\n".format(self.result.scan_time))

        self.scan_openclaw_installation()

        if not self.result.openclaw_installed:
            print("\n[!] 未检测到OpenClaw安装")
            return

        self.check_cve_2026_25253_token_theft()
        self.check_websocket_hijacking()
        self.check_file_permissions()
        self.check_secret_exposure()
        self.check_network_exposure()
        self.check_malicious_skills()
        self.check_logging_monitoring()

        # 生成摘要
        summary = {sev.value: 0 for sev in Severity}
        for issue in self.result.issues:
            summary[issue.severity.value] += 1
        self.result.summary = summary

    def generate_report(self):
        """生成安全报告"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        report_path = self.output_dir / "openclaw_security_report_{}_{}.json".format(
            self.result.hostname, timestamp)

        # 转换为可序列化的格式
        report_data = {
            "hostname": self.result.hostname,
            "scan_time": self.result.scan_time,
            "openclaw_installed": self.result.openclaw_installed,
            "openclaw_version": self.result.openclaw_version,
            "openclaw_paths": self.result.openclaw_paths,
            "openclaw_processes": self.result.openclaw_processes,
            "issues": [
                {
                    "check_id": issue.check_id,
                    "severity": issue.severity.value,
                    "title": issue.title,
                    "description": issue.description,
                    "evidence": issue.evidence,
                    "remediation": issue.remediation,
                    "cve": issue.cve,
                    "fixed": issue.fixed
                }
                for issue in self.result.issues
            ],
            "summary": self.result.summary
        }

        # 写入JSON报告
        with open(str(report_path), 'w', encoding='utf-8') as f:
            json.dump(report_data, f, indent=2, ensure_ascii=False)

        # 生成可读的文本报告
        text_report_path = str(report_path.with_suffix('.txt'))
        with open(text_report_path, 'w', encoding='utf-8') as f:
            f.write("=" * 80 + "\n")
            f.write("OpenClaw 安全扫描报告\n")
            f.write("=" * 80 + "\n\n")
            f.write("主机名: {}\n".format(self.result.hostname))
            f.write("扫描时间: {}\n".format(self.result.scan_time))
            f.write("OpenClaw已安装: {}\n".format('是' if self.result.openclaw_installed else '否'))
            if self.result.openclaw_version:
                f.write("OpenClaw版本: {}\n".format(self.result.openclaw_version))
            f.write("\n" + "=" * 80 + "\n")

            if self.result.openclaw_installed:
                f.write("\n## 安装路径:\n")
                for path in self.result.openclaw_paths:
                    f.write("  - {}\n".format(path))

                f.write("\n## 运行进程:\n")
                for proc in self.result.openclaw_processes:
                    cmd = proc['command'][:80] if len(proc['command']) > 80 else proc['command']
                    f.write("  PID: {}, 用户: {}, CPU: {}%, 命令: {}\n".format(
                        proc['pid'], proc['user'], proc['cpu'], cmd))

            f.write("\n" + "=" * 80 + "\n")
            f.write("安全漏洞摘要\n")
            f.write("=" * 80 + "\n\n")
            for sev in [Severity.CRITICAL, Severity.HIGH, Severity.MEDIUM, Severity.LOW, Severity.INFO]:
                count = self.result.summary.get(sev.value, 0)
                if count > 0:
                    f.write("  {:10s}: {}\n".format(sev.value, count))

            if self.result.issues:
                f.write("\n" + "=" * 80 + "\n")
                f.write("详细问题列表\n")
                f.write("=" * 80 + "\n\n")

                # 按严重程度分组
                for sev in [Severity.CRITICAL, Severity.HIGH, Severity.MEDIUM, Severity.LOW, Severity.INFO]:
                    issues = [i for i in self.result.issues if i.severity == sev]
                    if issues:
                        f.write("\n### {}\n\n".format(sev.value))
                        for idx, issue in enumerate(issues, 1):
                            f.write("{}. {}\n".format(idx, issue.title))
                            f.write("   ID: {}\n".format(issue.check_id))
                            if issue.cve:
                                f.write("   CVE: {}\n".format(issue.cve))
                            f.write("   描述: {}\n".format(issue.description))
                            f.write("   证据: {}\n".format(issue.evidence))
                            f.write("   修复: {}\n\n".format(issue.remediation))

            f.write("\n" + "=" * 80 + "\n")
            f.write("建议的修复步骤\n")
            f.write("=" * 80 + "\n\n")
            f.write("1. 立即修复所有CRITICAL级别的问题\n")
            f.write("2. 尽快修复所有HIGH级别的问题\n")
            f.write("3. 在规定时间内修复MEDIUM和LOW级别的问题\n")
            f.write("4. 考虑实施以下安全加固措施:\n")
            f.write("   - 启用防火墙并限制端口访问\n")
            f.write("   - 使用强密码和令牌认证\n")
            f.write("   - 定期更新OpenClaw到最新版本\n")
            f.write("   - 实施日志监控和异常检测\n")
            f.write("   - 使用密钥管理服务存储凭据\n")
            f.write("   - 限制ClawHub技能的安装，仅使用可信来源\n")
            f.write("\n" + "=" * 80 + "\n")

        print("\n[*] 报告已生成:")
        print("    JSON: {}".format(report_path))
        print("    文本: {}".format(text_report_path))

        return str(report_path)

    def generate_remediation_script(self):
        """生成自动修复脚本"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        script_path = self.output_dir / "remediation_{}_{}.sh".format(
            self.result.hostname, timestamp)

        with open(str(script_path), 'w', encoding='utf-8') as f:
            f.write("#!/bin/bash\n")
            f.write("# OpenClaw 安全问题自动修复脚本\n")
            f.write("# 生成时间: {}\n".format(self.result.scan_time))
            f.write("# 主机: {}\n\n".format(self.result.hostname))
            f.write("set -e\n\n")
            f.write("echo '[*] 开始执行OpenClaw安全修复...'\n\n")

            # 按严重程度分组
            critical_issues = [i for i in self.result.issues if i.severity == Severity.CRITICAL and not i.fixed]
            high_issues = [i for i in self.result.issues if i.severity == Severity.HIGH and not i.fixed]

            if not critical_issues and not high_issues:
                f.write("echo '[*] 没有需要自动修复的关键问题'\n")
            else:
                # 修复命令
                for issue in critical_issues + high_issues:
                    if issue.remediation:
                        f.write("echo '[+] 修复: {}'\n".format(issue.title))
                        # 特殊处理某些类型的修复
                        if 'chmod' in issue.remediation:
                            f.write("    sudo {} 2>/dev/null || echo '    警告: 无法执行修复命令'\n".format(issue.remediation))
                        elif 'ufw' in issue.remediation:
                            f.write("    echo '[*] 需要手动执行: {}'\n".format(issue.remediation))
                        else:
                            f.write("    echo '[*] 建议执行: {}'\n".format(issue.remediation))
                        f.write("\n")

            f.write("\necho '[*] 修复脚本执行完成'\n")
            f.write("echo '[*] 请重新运行安全扫描以验证修复结果'\n")

        # 设置可执行权限
        os.chmod(str(script_path), 0o755)

        print("[*] 修复脚本已生成: {}".format(script_path))
        print("    执行命令: bash {}".format(script_path))

        return str(script_path)

    def print_summary(self):
        """打印扫描摘要"""
        print("\n" + "=" * 80)
        print("扫描摘要")
        print("=" * 80)

        if not self.result.openclaw_installed:
            print("\n未检测到OpenClaw安装。")
            self._print_contact_info()
            return

        print("\n主机: {}".format(self.result.hostname))
        print("版本: {}".format(self.result.openclaw_version or '未知'))
        print("安装路径: {} 个".format(len(self.result.openclaw_paths)))
        print("运行进程: {} 个".format(len(self.result.openclaw_processes)))

        print("\n发现的问题:")
        critical_count = self.result.summary.get('CRITICAL', 0)
        high_count = self.result.summary.get('HIGH', 0)
        total_vulns = critical_count + high_count

        for sev in [Severity.CRITICAL, Severity.HIGH, Severity.MEDIUM, Severity.LOW, Severity.INFO]:
            count = self.result.summary.get(sev.value, 0)
            if count > 0:
                # 高危漏洞用红色显示
                if sev == Severity.CRITICAL or sev == Severity.HIGH:
                    print("  {}{:10s}: {}{}".format(Colors.RED, sev.value, count, Colors.END))
                else:
                    print("  {:10s}: {}".format(sev.value, count))

        print("\n" + "=" * 80)

        # 打印引流信息
        self._print_contact_info(total_vulns)

    def _print_contact_info(self, vuln_count=0):
        """打印引流联系信息"""
        print()

        # 如果有高危漏洞，显示醒目的警告
        if vuln_count > 0:
            print("{}{}[!] 扫描发现 {} 个高危漏洞！{}".format(
                Colors.BOLD + Colors.BG_RED, Colors.RED, vuln_count, Colors.END
            ))
            print()

        # 引流话术 - 多种样式组合
        print("{}{}[*] 不知道如何修复或加固 OpenClaw？{}".format(
            Colors.BOLD + Colors.YELLOW, Colors.BLINK, Colors.END
        ))
        print()

        # 微信联系方式
        print("{}    联系方式：{}".format(Colors.CYAN, Colors.END))
        print("{}    微信: {}{}".format(Colors.GREEN, CONTACT_INFO["wechat"], Colors.END))

        # 邮箱
        print("{}    邮箱: {}{}".format(Colors.MAGENTA, CONTACT_INFO["email"], Colors.END))

        print()

        # 服务介绍
        print("{}[*] 专业服务包括：{}".format(Colors.BOLD, Colors.END))
        print("    - OpenClaw 安全部署与配置")
        print("    - 漏洞修复与系统加固")
        print("    - 安全审计与渗透测试")
        print("    - 7x24小时安全运维支持")
        print()

        # 行动号召
        print("{}{}[*] 立即联系我们，保护您的服务器安全！{}".format(
            Colors.BOLD + Colors.GREEN, Colors.UNDERLINE, Colors.END
        ))
        print()
        print("=" * 80)


def main():
    """主函数"""
    import argparse

    parser = argparse.ArgumentParser(
        description="OpenClaw安全检测和修复工具",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  %(prog)s                    # 运行完整扫描
  %(prog)s --output /tmp/reports  # 指定输出目录
  %(prog)s --fix-only         # 仅生成修复脚本（不扫描）

检测项目:
  - CVE-2026-25253: 认证令牌窃取漏洞
  - WebSocket劫持漏洞
  - 配置文件权限问题
  - 端口暴露情况
  - 密钥泄露风险
  - 恶意ClawHub技能检测
  - 日志和监控配置

更多信息请参考:
  - https://aimaker.substack.com/p/openclaw-security-hardening-guide
  - https://github.com/openclaw/openclaw/discussions/12606
        """
    )
    parser.add_argument(
        "-o", "--output",
        default="./security_reports",
        help="报告输出目录 (默认: ./security_reports)"
    )
    parser.add_argument(
        "--fix-only",
        action="store_true",
        help="仅生成修复脚本（不执行扫描）"
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="以JSON格式输出到标准输出"
    )

    args = parser.parse_args()

    # 检查是否以root运行
    if os.geteuid() != 0:
        print("[!] 警告: 建议以root权限运行此脚本以获取完整信息")
        print("[!] 部分检查可能失败或返回不完整的结果\n")

    checker = OpenClawSecurityChecker(output_dir=args.output)

    if not args.fix_only:
        checker.run_all_checks()
        checker.print_summary()

        if args.json:
            report_data = {
                "hostname": checker.result.hostname,
                "scan_time": checker.result.scan_time,
                "openclaw_installed": checker.result.openclaw_installed,
                "summary": checker.result.summary,
                "issues": [
                    {
                        "check_id": i.check_id,
                        "severity": i.severity.value,
                        "title": i.title,
                        "description": i.description,
                        "remediation": i.remediation,
                        "cve": i.cve
                    }
                    for i in checker.result.issues
                ]
            }
            print("\n" + json.dumps(report_data, indent=2, ensure_ascii=False))

        # 生成报告
        report_path = checker.generate_report()

    # 生成修复脚本
    if checker.result.issues:
        remediation_path = checker.generate_remediation_script()
        print("\n[!] 请检查生成的报告并审查修复脚本后再执行")
        print("[*] 修复脚本: {}".format(remediation_path))

    # 最后的引流信息（确保总是显示）
    print()
    print("=" * 80)
    print("{}{}[*] 需要专业的OpenClaw安全服务？{}".format(Colors.BOLD + Colors.YELLOW, Colors.BLINK, Colors.END))
    print("{}    微信: {}{}".format(Colors.GREEN, CONTACT_INFO["wechat"], Colors.END))
    print("{}    邮箱: {}{}".format(Colors.MAGENTA, CONTACT_INFO["email"], Colors.END))
    print("=" * 80)
    print()

    return 0


if __name__ == "__main__":
    sys.exit(main())
