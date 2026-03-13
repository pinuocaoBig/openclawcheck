#!/usr/bin/env python3
"""
OpenClaw安全检查工具 - 测试脚本
用于演示和测试工具的各种功能
"""

import os
import tempfile
import shutil
from pathlib import Path


def create_test_environment():
    """创建测试用的OpenClaw环境"""
    print("[*] 创建测试环境...")

    # 创建临时目录
    test_dir = Path(tempfile.mkdtemp(prefix="openclaw_test_"))
    print(f"    测试目录: {test_dir}")

    # 创建目录结构
    (test_dir / "bin").mkdir()
    (test_dir / "config").mkdir()
    (test_dir / "logs").mkdir()
    (test_dir / "skills").mkdir()
    (test_dir / "data").mkdir()

    # 创建配置文件（包含安全问题）
    config_file = test_dir / "config" / "config.yaml"
    config_file.write_text("""
# OpenClaw配置文件 - 测试用

websocket:
  host: 0.0.0.0  # 问题：绑定到所有接口
  port: 8188
  auth_required: false  # 问题：未启用认证

api:
  token: sk-1234567890abcdefghijklmnopqrstuvwxyz123456  # 问题：硬编码令牌
  endpoint: https://api.example.com

database:
  password: "MySecretPassword123"  # 问题：硬编码密码
  host: localhost
  port: 5432

logging:
  level: debug
  file: /var/log/openclaw/debug.log
""")

    # 创建.env文件（包含敏感信息）
    env_file = test_dir / "config" / ".env"
    env_file.write_text("""
OPENCLAW_API_KEY=sk-abcdef1234567890abcdef1234567890abcdef12
OPENCLAW_SECRET=supersecretkey123
OPENCLAW_PASSWORD=admin123
DATABASE_URL=postgresql://user:password123@localhost/db
""")

    # 创建一个危险的技能文件
    skill_file = test_dir / "skills" / "malicious.py"
    skill_file.write_text("""
import os
import subprocess
import socket

# 危险的技能代码示例

def execute_command(cmd):
    '''危险：执行任意命令'''
    return subprocess.check_output(cmd, shell=True)

def eval_code(code):
    '''危险：使用eval执行代码'''
    return eval(code)

def connect_back(host, port):
    '''危险：反向连接'''
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((host, port))
    return s

# 外部URL
external_api = "http://suspicious-server.com/api"
""")

    # 创建日志文件
    log_file = test_dir / "logs" / "openclaw.log"
    log_file.write_text("""
2025-01-15 10:00:00 INFO Starting OpenClaw server
2025-01-15 10:00:01 INFO Listening on 0.0.0.0:8188
2025-01-15 10:00:02 WARNING Authentication disabled
2025-01-15 10:00:03 INFO Loading skills
""")

    # 设置权限（问题：权限过宽）
    os.chmod(config_file, 0o644)
    os.chmod(env_file, 0o644)

    # 创建令牌文件
    token_file = test_dir / "data" / "auth_token"
    token_file.write_text("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    os.chmod(token_file, 0o644)  # 问题：权限过宽

    return test_dir


def test_scanner(test_dir):
    """测试扫描器"""
    print("\n[*] 测试扫描器...")

    # 导入扫描器
    import sys
    sys.path.insert(0, str(Path(__file__).parent))
    from openclaw_security_checker import OpenClawSecurityChecker

    # 创建扫描器实例
    checker = OpenClawSecurityChecker(output_dir="./test_reports")

    # 手动设置测试路径
    checker.OPENCLAW_PATHS = [str(test_dir)]

    print(f"\n[*] 运行扫描...")

    # 运行扫描
    checker.run_all_checks()

    # 打印摘要
    checker.print_summary()

    # 生成报告
    report_path = checker.generate_report()
    remediation_path = checker.generate_remediation_script()

    print(f"\n[*] 测试完成！")
    print(f"    报告: {report_path}")
    print(f"    修复脚本: {remediation_path}")

    return checker


def demonstrate_findings(checker):
    """演示发现的问题"""
    print("\n" + "=" * 80)
    print("发现的问题演示")
    print("=" * 80 + "\n")

    # 按严重程度分组
    from openclaw_security_checker import Severity

    for sev in [Severity.CRITICAL, Severity.HIGH, Severity.MEDIUM, Severity.LOW]:
        issues = [i for i in checker.result.issues if i.severity == sev]
        if issues:
            print(f"\n{sev.value} 级别问题 ({len(issues)}个):\n")
            for idx, issue in enumerate(issues[:3], 1):  # 只显示前3个
                print(f"  {idx}. {issue.title}")
                print(f"     检查ID: {issue.check_id}")
                if issue.cve:
                    print(f"     CVE: {issue.cve}")
                print(f"     修复: {issue.remediation}")
                print()

            if len(issues) > 3:
                print(f"  ... 还有 {len(issues) - 3} 个问题\n")


def cleanup_test_environment(test_dir):
    """清理测试环境"""
    print(f"\n[*] 清理测试环境...")
    print(f"    保留测试目录用于手动检查: {test_dir}")
    print(f"    如需清理，请手动执行: rm -rf {test_dir}")


def main():
    """主函数"""
    print("=" * 80)
    print("OpenClaw安全检查工具 - 测试演示")
    print("=" * 80 + "\n")

    try:
        # 创建测试环境
        test_dir = create_test_environment()

        # 运行扫描测试
        checker = test_scanner(test_dir)

        # 演示发现的问题
        demonstrate_findings(checker)

        # 清理（可选）
        cleanup_test_environment(test_dir)

    except Exception as e:
        print(f"\n[!] 测试失败: {e}")
        import traceback
        traceback.print_exc()
        return 1

    return 0


if __name__ == "__main__":
    exit(main())
