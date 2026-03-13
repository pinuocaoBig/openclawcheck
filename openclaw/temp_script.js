        // 漏洞详细数据
        const vulnDetails = {
            'cve-2026-25253': {
                title: 'CVE-2026-25253 - 远程代码执行漏洞',
                severity: '严重',
                cvss: '8.8',
                cwe: 'CWE-346',
                disclosureDate: '2026-01-31',
                affectedVersions: '2026.1.30及之前版本',
                description: `OpenClaw网关组件未对WebSocket来源头进行验证，导致攻击者可以构造恶意网页，诱导用户访问后建立恶意WebSocket连接并执行任意代码。`,
                attackVector: `攻击者可通过诱导用户访问恶意网页触发漏洞，利用WebSocket验证缺失问题，完全控制运行OpenClaw的主机。`,
                impact: [
                    '窃取API密钥和环境变量',
                    '建立持久化后门访问',
                    '访问所有本地数据',
                    '植入挖矿程序或其他恶意软件',
                    '完全控制运行OpenClaw的主机'
                ],
                exploitSteps: [
                    '1. 攻击者创建恶意网页',
                    '2. 诱导OpenClaw用户访问该网页',
                    '3. 恶意网页建立与本地OpenClaw实例的WebSocket连接',
                    '4. 通过未经验证的连接执行任意代码',
                    '5. 完全控制运行OpenClaw的主机'
                ],
                fix: [
                    '升级到v2026.1.29或更高版本',
                    '启用Token认证机制',
                    '配置WebSocket来源验证',
                    '使用反向代理+HTTPS加密访问',
                    '启用Docker沙箱隔离'
                ],
                references: [
                    'NVD: https://nvd.nist.gov/vuln/detail/CVE-2026-25253',
                    'OpenClaw安全公告: v2026.1.29发布说明'
                ]
            },
            'cve-2026-29610': {
                title: 'CVE-2026-29610 - PATH劫持命令执行漏洞',
                severity: '严重',
                cvss: '高危',
                cwe: 'CWE-426',
                disclosureDate: '2026年2月',
                affectedVersions: '多个版本',
                description: `攻击者可通过PATH环境变量劫持实现命令执行，这是一种典型的权限提升漏洞，可与其他漏洞组合利用以获取系统最高权限。`,
                attackVector: `攻击者通过操纵PATH环境变量，使系统在执行命令时优先加载恶意的可执行文件，从而实现命令执行和权限提升。`,
                impact: [
                    '权限提升至管理员级别',
                    '执行任意系统命令',
                    '绕过系统安全边界',
                    '与其他漏洞组合利用',
                    '获取系统完整控制权'
                ],
                exploitSteps: [
                    '1. 识别OpenClaw使用的系统命令',
                    '2. 在可写目录创建恶意可执行文件',
                    '3. 修改PATH环境变量，使恶意文件路径优先',
                    '4. 触发OpenClaw执行相关命令',
                    '5. 恶意文件被执行，获得提升的权限'
                ],
                fix: [
                    '升级到最新版本',
                    '限制OpenClaw进程的PATH环境变量',
                    '使用绝对路径调用系统命令',
                    '启用system.run组件的严格权限管控',
                    '实施最小权限原则'
                ],
                references: [
                    'CVE数据库: CVE-2026-29610',
                    'OpenClaw安全更新日志'
                ]
            },
            'clawjacked': {
                title: 'ClawJacked - WebSocket劫持漏洞',
                severity: '严重',
                cvss: '8.5+',
                cwe: '0-click RCE',
                disclosureDate: '2026年1月',
                affectedVersions: '2026.1.30及之前版本',
                description: `ClawJacked漏洞允许攻击者仅通过诱导用户访问恶意网页即可远程控制其本地运行的AI Agent，无需任何用户交互（0-click）。`,
                attackVector: `利用WebSocket验证缺失问题，攻击者网站可建立与本地OpenClaw实例的连接，并在用户无感知的情况下执行恶意操作。`,
                impact: [
                    '无需用户点击即可触发（0-click）',
                    '远程控制AI Agent',
                    '窃取API密钥和敏感数据',
                    '篡改AI Agent行为',
                    '建立持久化后门'
                ],
                exploitSteps: [
                    '1. 用户访问攻击者控制的恶意网页',
                    '2. 网页中的JavaScript自动扫描本地OpenClaw实例',
                    '3. 建立WebSocket连接（绕过同源策略）',
                    '4. 发送恶意指令控制AI Agent',
                    '5. 窃取数据或执行恶意操作'
                ],
                fix: [
                    '升级到最新版本',
                    '启用WebSocket来源验证（Origin header）',
                    '配置允许的来源白名单',
                    '启用Token认证',
                    '仅绑定localhost或内网地址'
                ],
                references: [
                    '安全研究报告: ClawJacked漏洞分析',
                    'OpenClaw安全建议文档'
                ]
            },
            'system-run': {
                title: '权限提升漏洞 (system.run组件)',
                severity: '高危',
                cvss: '7.5',
                cwe: 'CWE-269',
                disclosureDate: '2026年2月',
                affectedVersions: '多个版本',
                description: `system.run组件权限管控存在缺陷，攻击者可利用此漏洞从普通权限提升至管理员权限，绕过系统安全边界，执行任意系统命令。`,
                attackVector: `通过AI Agent的system.run功能执行系统命令时，权限检查不充分，允许执行超出预期的特权操作。`,
                impact: [
                    '权限提升至管理员级别',
                    '执行任意系统命令',
                    '修改系统配置',
                    '访问受限资源',
                    '破坏系统安全边界'
                ],
                exploitSteps: [
                    '1. 诱导AI Agent调用system.run组件',
                    '2. 构造恶意命令参数',
                    '3. 绕过权限检查机制',
                    '4. 以提升的权限执行命令',
                    '5. 获得系统控制权'
                ],
                fix: [
                    '升级到最新版本',
                    '配置system.run的严格权限控制',
                    '实施命令白名单机制',
                    '启用命令执行审计日志',
                    '限制system.run仅用于必要操作'
                ],
                references: [
                    'OpenClaw权限管理文档',
                    '安全审计报告'
                ]
            },
            'webhook-dos': {
                title: 'CVE-2026-28478 - Webhook拒绝服务漏洞',
                severity: '中危',
                cvss: '中危',
                cwe: 'CWE-770',
                disclosureDate: '2026年2月',
                affectedVersions: '多个版本',
                description: `影响OpenClaw的Webhook功能，攻击者可通过构造恶意Webhook请求消耗系统资源，导致服务不可用。`,
                attackVector: `发送大量或特制的Webhook请求，使OpenClaw实例消耗过多CPU、内存或网络资源，从而无法为正常请求提供服务。`,
                impact: [
                    '服务不可用（DoS）',
                    '系统资源耗尽',
                    '正常业务中断',
                    '潜在的数据丢失',
                    '影响用户体验'
                ],
                exploitSteps: [
                    '1. 识别OpenClaw实例的Webhook端点',
                    '2. 构造大量恶意Webhook请求',
                    '3. 发送请求耗尽系统资源',
                    '4. 导致服务响应缓慢或完全不可用',
                    '5. 影响正常业务运行'
                ],
                fix: [
                    '升级到最新版本',
                    '实施Webhook速率限制',
                    '添加请求大小限制',
                    '启用资源使用监控',
                    '配置Webhook超时机制'
                ],
                references: [
                    'CVE数据库: CVE-2026-28478',
                    'OpenClaw Webhook配置指南'
                ]
            },
            'info-leak': {
                title: '信息泄露漏洞 (2026.1.30及之前版本)',
                severity: '中危',
                cvss: '5.5',
                cwe: 'CWE-200',
                disclosureDate: '2026年1月',
                affectedVersions: '2026.1.30及之前版本',
                description: `API密钥和环境变量以明文形式存储，错误消息和日志文件可能暴露敏感信息，包括数据库凭证、API密钥等。`,
                attackVector: `通过访问日志文件、触发错误消息或检查配置文件，攻击者可获取系统敏感信息，用于进一步攻击。`,
                impact: [
                    'API密钥泄露',
                    '数据库凭证暴露',
                    '环境变量泄露',
                    '系统架构信息暴露',
                    '为后续攻击提供信息'
                ],
                exploitSteps: [
                    '1. 访问OpenClaw实例触发错误',
                    '2. 收集错误消息中的敏感信息',
                    '3. 访问日志文件或配置文件',
                    '4. 提取API密钥、密码等凭据',
                    '5. 使用凭据进行进一步攻击'
                ],
                fix: [
                    '升级到v2026.1.31或更高版本',
                    '加密存储敏感凭据',
                    '禁止在日志中记录敏感信息',
                    '优化错误处理机制',
                    '定期审计日志和配置文件'
                ],
                references: [
                    'OpenClaw信息泄露安全通告',
                    '安全配置最佳实践'
                ]
            }
        };

        // 显示漏洞详情
        function showVulnDetail(vulnId) {
            const vuln = vulnDetails[vulnId];
            if (!vuln) return;

            const modal = document.getElementById('vulnModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalBody = document.getElementById('modalBody');

            modalTitle.textContent = vuln.title;

            let severityClass = 'low';
            if (vuln.severity === '严重' || vuln.severity === '高危') {
                severityClass = 'high';
            } else if (vuln.severity === '中危') {
                severityClass = 'medium';
            }

            modalBody.innerHTML = `
                <div class="vuln-detail">
                    <div class="detail-header">
                        <div class="severity-badge ${severityClass}">${vuln.severity}</div>
                        <div class="meta-tags">
                            <span class="meta-tag">CVSS: ${vuln.cvss}</span>
                            <span class="meta-tag">${vuln.cwe}</span>
                            <span class="meta-tag">披露日期: ${vuln.disclosureDate}</span>
                        </div>
                    </div>

                    <div class="detail-section">
                        <h4 class="section-heading">📋 影响版本</h4>
                        <p class="detail-text">${vuln.affectedVersions}</p>
                    </div>

                    <div class="detail-section">
                        <h4 class="section-heading">⚠️ 漏洞描述</h4>
                        <p class="detail-text">${vuln.description}</p>
                    </div>

                    <div class="detail-section">
                        <h4 class="section-heading">🎯 攻击向量</h4>
                        <p class="detail-text">${vuln.attackVector}</p>
                    </div>

                    <div class="detail-section">
                        <h4 class="section-heading">💥 影响范围</h4>
                        <ul class="detail-list">
                            ${vuln.impact.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="detail-section">
                        <h4 class="section-heading">🔓 漏洞利用步骤</h4>
                        <ol class="detail-steps">
                            ${vuln.exploitSteps.map(step => `<li>${step}</li>`).join('')}
                        </ol>
                    </div>

                    <div class="detail-section">
                        <h4 class="section-heading">🔧 修复建议</h4>
                        <ul class="detail-list">
                            ${vuln.fix.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="detail-section">
                        <h4 class="section-heading">📚 参考资料</h4>
                        <ul class="detail-list">
                            ${vuln.references.map(ref => `<li><a href="#" class="detail-link">${ref}</a></li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;

            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        // 关闭模态框
        function closeVulnModal() {
            const modal = document.getElementById('vulnModal');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // 教程详细数据
        const tutorialDetails = {
            'deployment': {
                title: '安全部署指南',
                icon: '🚀',
                description: 'OpenClaw AI智能体的安全部署最佳实践',
                sections: [
                    {
                        title: '一、启用Token认证',
                        content: `
                            <p><strong>为什么需要Token认证：</strong></p>
                            <p>默认配置下OpenClaw可能以零认证模式运行，这意味着任何能访问实例的人都能完全控制它。根据安全报告，全球有超过41万实例暴露在公网，其中大量未启用认证。</p>

                            <p><strong>配置步骤：</strong></p>
                            <ol class="tutorial-steps">
                                <li>打开OpenClaw配置文件（通常在 <code>~/.openclaw/config.yaml</code>）</li>
                                <li>找到或添加 <code>auth</code> 配置段：</li>
                            </ol>
                            <pre class="code-block">auth:
  type: token
  token: "your-strong-random-token-here"
  token_header: "X-OpenClaw-Token"</pre>
                            <ol class="tutorial-steps" start="3">
                                <li>生成强随机Token（建议使用32字符以上）</li>
                                <li>重启OpenClaw服务</li>
                                <li>在客户端请求中添加Token头部验证配置</li>
                            </ol>

                            <p><strong>验证方法：</strong></p>
                            <pre class="code-block">curl -H "X-OpenClaw-Token: your-token" http://localhost:18789/api/status</pre>
                        `
                    },
                    {
                        title: '二、正确配置绑定地址',
                        content: `
                            <p><strong>绑定地址风险：</strong></p>
                            <p>默认配置可能绑定到 <code>0.0.0.0:18789</code>，这会使OpenClaw暴露在所有网络接口上，包括公网。这是导致23万+实例暴露的主要原因之一。</p>

                            <p><strong>配置步骤：</strong></p>
                            <ol class="tutorial-steps">
                                <li>编辑配置文件中的 <code>server</code> 部分：</li>
                            </ol>
                            <pre class="code-block">server:
  host: "127.0.0.1"  # 仅本地访问
  # 或使用内网IP
  # host: "10.0.0.5"  # 内网访问
  port: 18789</pre>
                            <ol class="tutorial-steps" start="2">
                                <li>如果需要远程访问，使用反向代理（如Nginx）</li>
                                <li>配置防火墙规则，限制访问来源IP</li>
                                <li>禁用公网直接访问端口18789</li>
                            </ol>

                            <p><strong>检查当前绑定：</strong></p>
                            <pre class="code-block"># Linux/Mac
netstat -tuln | grep 18789
# 或
ss -tuln | grep 18789</pre>
                        `
                    },
                    {
                        title: '三、使用Docker隔离',
                        content: `
                            <p><strong>为什么需要Docker隔离：</strong></p>
                            <p>OpenClaw默认以高权限运行，可直接访问文件系统、网络和系统命令。Docker容器化可以限制其权限边界，即使被攻破也难以逃逸到宿主机。</p>

                            <p><strong>Docker部署步骤：</strong></p>
                            <ol class="tutorial-steps">
                                <li>创建Dockerfile：</li>
                            </ol>
                            <pre class="code-block">FROM python:3.11-slim

# 安装依赖
RUN apt-get update && apt-get install -y \\
    git \\
    curl \\
    && rm -rf /var/lib/apt/lists/*

# 创建非root用户
RUN useradd -m -u 1000 openclaw

# 克隆OpenClaw
RUN git clone https://github.com/openclaw/openclaw /app
RUN chown -R openclaw:openclaw /app

USER openclaw
WORKDIR /app

# 启动命令
CMD ["python", "-m", "openclaw"]</pre>
                            <ol class="tutorial-steps" start="2">
                                <li>构建镜像：</li>
                            </ol>
                            <pre class="code-block">docker build -t openclaw:secure .</pre>
                            <ol class="tutorial-steps" start="3">
                                <li>运行容器（限制权限）：</li>
                            </ol>
                            <pre class="code-block">docker run -d \\
  --name openclaw \\
  --network host \\
  --read-only \\
  --tmpfs /tmp \\
  --security-opt no-new-privileges \\
  -v openclaw-data:/app/data \\
  -e OPENCLAW_TOKEN="your-token" \\
  openclaw:secure</pre>

                            <p><strong>安全选项说明：</strong></p>
                            <ul>
                                <li><code>--read-only</code>: 只读文件系统</li>
                                <li><code>--tmpfs /tmp</code>: 临时文件系统</li>
                                <li><code>--security-opt no-new-privileges</code>: 禁止权限提升</li>
                                <li><code>--network host</code>: 使用宿主机网络（可改为bridge隔离）</li>
                            </ul>
                        `
                    },
                    {
                        title: '四、配置HTTPS加密',
                        content: `
                            <p><strong>HTTPS的重要性：</strong></p>
                            <p>HTTP明文传输会导致Token、API密钥等敏感信息被窃取。HTTPS加密保护通信安全，防止中间人攻击。</p>

                            <p><strong>使用Nginx反向代理配置HTTPS：</strong></p>
                            <ol class="tutorial-steps">
                                <li>安装Nginx和Certbot：</li>
                            </ol>
                            <pre class="code-block"># Ubuntu/Debian
sudo apt install nginx certbot python3-certbot-nginx</pre>
                            <ol class="tutorial-steps" start="2">
                                <li>配置Nginx：</li>
                            </ol>
                            <pre class="code-block">server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://127.0.0.1:18789;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Token验证
        proxy_set_header X-OpenClaw-Token $http_x_openclaw_token;
    }
}</pre>
                            <ol class="tutorial-steps" start="3">
                                <li>获取Let's Encrypt证书：</li>
                            </ol>
                            <pre class="code-block">sudo certbot --nginx -d your-domain.com</pre>
                            <ol class="tutorial-steps" start="4">
                                <li>测试配置：</li>
                            </ol>
                            <pre class="code-block">sudo nginx -t
sudo systemctl reload nginx</pre>
                        `
                    },
                    {
                        title: '五、部署检查清单',
                        content: `
                            <div class="checklist">
                                <h4>✅ 部署前检查</h4>
                                <ul class="checklist-items">
                                    <li><input type="checkbox" disabled checked> 已设置强Token认证</li>
                                    <li><input type="checkbox" disabled checked> 绑定地址为127.0.0.1或内网IP</li>
                                    <li><input type="checkbox" disabled checked> 配置了HTTPS加密</li>
                                    <li><input type="checkbox" disabled checked> 使用Docker容器隔离</li>
                                    <li><input type="checkbox" disabled checked> 升级到最新版本</li>
                                    <li><input type="checkbox" disabled checked> 配置了防火墙规则</li>
                                    <li><input type="checkbox" disabled checked> 启用了日志审计</li>
                                    <li><input type="checkbox" disabled checked> 设置了自动备份</li>
                                </ul>
                            </div>

                            <div class="warning-box">
                                <h4>⚠️ 常见错误</h4>
                                <ul>
                                    <li><strong>使用默认Token：</strong> 从未修改默认的空Token或弱Token</li>
                                    <li><strong>绑定0.0.0.0：</strong> 将服务暴露在所有网络接口</li>
                                    <li><strong>跳过HTTPS：</strong> 在公网使用HTTP明文传输</li>
                                    <li><strong>以root运行：</strong> 直接用root权限运行OpenClaw</li>
                                </ul>
                            </div>
                        `
                    }
                ]
            },
            'cve-fix': {
                title: 'CVE漏洞修复指南',
                icon: '🔒',
                description: '修复OpenClaw已知高危漏洞的完整指南',
                sections: [
                    {
                        title: 'CVE-2026-25253 修复',
                        content: `
                            <div class="cve-alert high">
                                <h4>🚨 严重漏洞 - CVSS 8.8</h4>
                                <p><strong>影响版本：</strong>2026.1.30及之前</p>
                                <p><strong>修复版本：</strong>v2026.1.29+</p>
                            </div>

                            <h5>漏洞描述</h5>
                            <p>OpenClaw网关组件未对WebSocket来源头进行验证，攻击者可通过诱导用户访问恶意网页，建立恶意WebSocket连接并执行任意代码，完全控制运行OpenClaw的主机。</p>

                            <h5>修复步骤</h5>
                            <ol class="tutorial-steps">
                                <li><strong>立即升级到修复版本：</strong></li>
                            </ol>
                            <pre class="code-block"># 检查当前版本
openclaw --version

# 升级到最新版本
pip install --upgrade openclaw

# 或使用Git
cd openclaw
git pull origin main
git checkout v2026.1.29</pre>

                            <ol class="tutorial-steps" start="2">
                                <li><strong>配置WebSocket来源验证：</strong></li>
                            </ol>
                            <pre class="code-block"># 在config.yaml中添加
websocket:
  allowed_origins:
    - "https://your-domain.com"
    - "https://app.your-domain.com"
  verify_origin: true</pre>

                            <ol class="tutorial-steps" start="3">
                                <li><strong>验证修复：</strong></li>
                            </ol>
                            <pre class="code-block"># 检查WebSocket连接是否验证Origin
curl -i -N \\
  -H "Connection: Upgrade" \\
  -H "Upgrade: websocket" \\
  -H "Origin: https://evil.com" \\
  http://localhost:18789/ws

# 应返回403 Forbidden</pre>
                        `
                    },
                    {
                        title: 'CVE-2026-29610 修复',
                        content: `
                            <div class="cve-alert high">
                                <h4>🚨 严重漏洞 - PATH劫持</h4>
                                <p><strong>影响版本：</strong>多个版本</p>
                                <p><strong>CWE：</strong>CWE-426</p>
                            </div>

                            <h5>漏洞描述</h5>
                            <p>攻击者可通过PATH环境变量劫持实现命令执行，这是一种典型的权限提升漏洞。</p>

                            <h5>修复步骤</h5>
                            <ol class="tutorial-steps">
                                <li><strong>限制PATH环境变量：</strong></li>
                            </ol>
                            <pre class="code-block"># 在启动脚本中设置安全的PATH
export PATH="/usr/local/bin:/usr/bin:/bin"

# 启动OpenClaw
openclaw start</pre>

                            <ol class="tutorial-steps" start="2">
                                <li><strong>使用绝对路径：</strong></li>
                            </ol>
                            <pre class="code-block"># 配置system.run使用绝对路径
system:
  run:
    allowed_commands:
      - "/usr/bin/python3"
      - "/bin/ls"
    use_absolute_paths: true</pre>

                            <ol class="tutorial-steps" start="3">
                                <li><strong>升级最新版本：</strong></li>
                            </ol>
                            <pre class="code-block">pip install --upgrade openclaw
openclaw restart</pre>
                        `
                    },
                    {
                        title: '其他高危漏洞修复',
                        content: `
                            <h5>ClawJacked WebSocket劫持</h5>
                            <div class="cve-alert high">
                                <p><strong>0-click RCE</strong> - 无需用户交互即可触发</p>
                            </div>
                            <ul>
                                <li>升级到v2026.1.31+</li>
                                <li>启用Origin header白名单验证</li>
                                <li>配置Token认证</li>
                                <li>仅绑定localhost</li>
                            </ul>

                            <h5>system.run权限提升</h5>
                            <div class="cve-alert medium">
                                <p><strong>CVSS 7.5</strong> - 权限管控缺陷</p>
                            </div>
                            <ul>
                                <li>配置命令白名单</li>
                                <li>启用执行审计日志</li>
                                <li>限制system.run权限</li>
                                <li>使用Docker隔离</li>
                            </ul>

                            <h5>信息泄露漏洞</h5>
                            <div class="cve-alert medium">
                                <p><strong>CVSS 5.5</strong> - 敏感信息暴露</p>
                            </div>
                            <ul>
                                <li>升级到v2026.1.31+</li>
                                <li>加密存储API密钥</li>
                                <li>禁用敏感日志记录</li>
                                <li>优化错误处理</li>
                            </ul>
                        `
                    },
                    {
                        title: '漏洞修复验证',
                        content: `
                            <h5>使用安全扫描工具验证</h5>
                            <pre class="code-block"># 使用OpenClaw Security Scanner
openclaw-scanner --target localhost:18789

# 应显示：
# ✓ CVE-2026-25253: 已修复
# ✓ CVE-2026-29610: 已修复
# ✓ ClawJacked: 已修复</pre>

                            <h5>手动验证步骤</h5>
                            <ol class="tutorial-steps">
                                <li>检查版本号：</li>
                            </ol>
                            <pre class="code-block">openclaw --version
# 应显示 v2026.1.29 或更高</pre>

                            <ol class="tutorial-steps" start="2">
                                <li>测试Token认证：</li>
                            </ol>
                            <pre class="code-block">curl http://localhost:18789/api/status
# 应返回401 Unauthorized</pre>

                            <ol class="tutorial-steps" start="3">
                                <li>检查WebSocket验证：</li>
                            </ol>
                            <pre class="code-block"># 从非法Origin连接应被拒绝
wscat -c ws://localhost:18789/ws -H "Origin:https://evil.com"
# 应返回连接错误</pre>

                            <ol class="tutorial-steps" start="4">
                                <li>检查绑定地址：</li>
                            </ol>
                            <pre class="code-block">netstat -tuln | grep 18789
# 应显示 127.0.0.1:18789（不是0.0.0.0:18789）</pre>
                        `
                    }
                ]
            },
            'clawhavoc': {
                title: 'ClawHavoc供应链攻击防护',
                icon: '🔍',
                description: '识别和防范恶意技能插件',
                sections: [
                    {
                        title: 'ClawHavoc事件回顾',
                        content: `
                            <div class="incident-stats">
                                <div class="stat-box">
                                    <h4>135,000+</h4>
                                    <p>受影响设备</p>
                                </div>
                                <div class="stat-box">
                                    <h4>1,184</h4>
                                    <p>恶意技能数量</p>
                                </div>
                                <div class="stat-box">
                                    <h4>20%</h4>
                                    <p>高峰期恶意比例</p>
                                </div>
                                <div class="stat-box">
                                    <h4>549</h4>
                                    <p>部署入侵事件</p>
                                </div>
                            </div>

                            <h5>攻击手法</h5>
                            <ol class="tutorial-steps">
                                <li><strong>恶意技能植入：</strong>攻击者在ClawHub上传带后门的技能插件</li>
                                <li><strong>自动更新投毒：</strong>用户更新技能时自动执行恶意代码</li>
                                <li><strong>多阶段攻击：</strong>
                                    <ul>
                                        <li>窃取API密钥和环境变量</li>
                                        <li>植入挖矿程序</li>
                                        <li>建立后门访问</li>
                                        <li>窃取敏感数据</li>
                                    </ul>
                                </li>
                            </ol>

                            <div class="warning-box">
                                <h4>⚠️ 典型恶意技能特征</h4>
                                <ul>
                                    <li>承诺"一键暴富"或"自动交易"</li>
                                    <li>要求过高的系统权限</li>
                                    <li>包含混淆或加密的代码</li>
                                    <li>建立外部网络连接</li>
                                    <li>访问~/.aws、~/.ssh等敏感目录</li>
                                </ul>
                            </div>
                        `
                    },
                    {
                        title: '技能来源验证',
                        content: `
                            <h5>仅安装可信来源的技能</h5>
                            <ul>
                                <li><strong>官方仓库：</strong>优先使用官方ClawHub市场</li>
                                <li><strong>知名作者：</strong>选择有信誉的开发者</li>
                                <li><strong>Star数量：</strong>关注使用量和评价</li>
                                <li><strong>代码审查：</strong>查看源代码仓库</li>
                            </ul>

                            <h5>验证技能完整性</h5>
                            <ol class="tutorial-steps">
                                <li>检查技能的Git仓库：</li>
                            </ol>
                            <pre class="code-block"># 查看技能来源
openclaw skill info --name skill-name

# 检查是否有官方仓库
git clone https://github.com/author/skill-repo
cd skill-repo
git log --oneline -10</pre>

                            <ol class="tutorial-steps" start="2">
                                <li>验证哈希值：</li>
                            </ol>
                            <pre class="code-block"># 计算技能包哈希
sha256sum skill-package.tar.gz

# 与官方发布对比</pre>

                            <ol class="tutorial-steps" start="3">
                                <li>检查代码签名：</li>
                            </ol>
                            <pre class="code-block"># 验证GPG签名
gpg --verify skill-package.sig</pre>
                        `
                    },
                    {
                        title: '代码审计方法',
                        content: `
                            <h5>手动代码审计清单</h5>
                            <div class="checklist">
                                <ul class="checklist-items">
                                    <li><input type="checkbox"> 检查是否建立网络连接</li>
                                    <li><input type="checkbox"> 查找文件系统操作</li>
                                    <li><input type="checkbox"> 检查环境变量访问</li>
                                    <li><input type="checkbox"> 查找动态代码执行</li>
                                    <li><input type="checkbox"> 检查混淆/加密代码</li>
                                    <li><input type="checkbox"> 查找隐藏的后门</li>
                                </ul>
                            </div>

                            <h5>使用工具自动化审计</h5>
                            <pre class="code-block"># 使用Bandit检查Python代码
pip install bandit
bandit -r skill-package/

# 使用Semgrep
semgrep --config=auto skill-package/

# 查找可疑模式
grep -r "os.system" skill-package/
grep -r "subprocess" skill-package/
grep -r "eval(" skill-package/
grep -r "exec(" skill-package/</pre>

                            <h5>危险函数黑名单</h5>
                            <div class="warning-box">
                                <ul>
                                    <li><code>os.system()</code></li>
                                    <li><code>subprocess.call()</code></li>
                                    <li><code>eval()</code> / <code>exec()</code></li>
                                    <li><code>__import__()</code></li>
                                    <li><code>compile()</code></li>
                                    <li><code>pickle.loads()</code></li>
                                    <li><code>requests.post()</code>到外部URL</li>
                                </ul>
                            </div>
                        `
                    },
                    {
                        title: '沙箱隔离配置',
                        content: `
                            <h5>使用Docker隔离技能</h5>
                            <pre class="code-block"># 为每个技能创建独立容器
docker run -d \\
  --name skill-container \\
  --network isolated-network \\
  --memory 512m \\
  --cpus 1 \\
  --read-only \\
  --security-opt no-new-privileges \\
  -v skill-data:/data \\
  openclaw-skill:latest</pre>

                            <h5>配置技能权限限制</h5>
                            <pre class="code-block"># 在config.yaml中配置
skills:
  isolation:
    enabled: true
    sandbox_type: "docker"
  permissions:
    default: deny
    allow:
      - read_data
      - write_data
    deny:
      - network_access
      - system_commands
      - file_system_write</pre>

                            <h5>网络隔离</h5>
                            <ul>
                                <li>创建独立的Docker网络</li>
                                <li>使用防火墙规则限制出站连接</li>
                                <li>配置白名单允许的域名</li>
                                <li>禁用对内网的访问</li>
                            </ul>
                        `
                    },
                    {
                        title: '异常行为监控',
                        content: `
                            <h5>监控指标</h5>
                            <ul>
                                <li><strong>CPU使用率：</strong>挖矿程序会导致100% CPU</li>
                                <li><strong>网络流量：</strong>异常的数据上传</li>
                                <li><strong>文件访问：</strong>访问敏感目录</li>
                                <li><strong>进程行为：</strong>启动可疑子进程</li>
                            </ul>

                            <h5>配置监控</h5>
                            <pre class="code-block"># 使用Prometheus监控
# prometheus.yml
scrape_configs:
  - job_name: 'openclaw'
    static_configs:
      - targets: ['localhost:9090']

# 告警规则
groups:
  - name: openclaw_alerts
    rules:
      - alert: HighCPUUsage
        expr: cpu_usage_percent > 90
        for: 5m</pre>

                            <h5>日志审计</h5>
                            <pre class="code-block"># 监控OpenClaw日志
tail -f /var/log/openclaw/skills.log | grep -E "ERROR|WARNING"

# 查找网络连接
lsof -i -P | grep python

# 查找可疑进程
ps aux | grep -E "miner|crypto|bitcoin"</pre>
                        `
                    }
                ]
            },
            'incident-response': {
                title: '应急响应方案',
                icon: '⚡',
                description: '安全事件发生时的快速响应流程',
                sections: [
                    {
                        title: '一、攻击检测方法',
                        content: `
                            <h5>常见攻击迹象</h5>
                            <div class="warning-box">
                                <ul>
                                    <li>🔴 API密钥被异常使用</li>
                                    <li>🔴 云账单出现异常费用</li>
                                    <li>🔴 系统CPU/内存异常升高</li>
                                    <li>🔴 发现未知的网络连接</li>
                                    <li>🔴 日志中出现异常操作</li>
                                    <li>🔴 文件被篡改或删除</li>
                                </ul>
                            </div>

                            <h5>检测命令</h5>
                            <pre class="code-block"># 检查网络连接
netstat -tuln | grep ESTABLISHED
lsof -i -P | grep LISTEN

# 检查进程
ps aux | grep -E "python|openclaw"
top | head -20

# 检查最近修改的文件
find /home -mtime -1 -ls

# 检查OpenClaw日志
grep -i error /var/log/openclaw/*.log | tail -50

# 检查系统认证日志
grep "Failed\|Invalid" /var/log/auth.log | tail -20</pre>

                            <h5>使用扫描工具</h5>
                            <pre class="code-block"># 运行安全扫描
openclaw-scanner --target localhost:18789 --full-scan

# 检查公网暴露
curl https://api.example.com/check-exposed?ip=your-ip</pre>
                        `
                    },
                    {
                        title: '二、紧急隔离措施',
                        content: `
                            <h5>立即行动清单（按优先级）</h5>
                            <div class="priority-list">
                                <div class="priority-item critical">
                                    <h4>🚨 P0 - 立即执行（5分钟内）</h4>
                                    <ol>
                                        <li><strong>停止OpenClaw服务：</strong></li>
                                    </ol>
                                    <pre class="code-block">systemctl stop openclaw
# 或
openclaw stop
killall -9 openclaw</pre>
                                    <ol start="2">
                                        <li><strong>断开网络连接：</strong></li>
                                    </ol>
                                    <pre class="code-block"># 关闭相关端口
iptables -A INPUT -p tcp --dport 18789 -j DROP
# 或断开服务器网络</li></pre>
                                    <ol start="3">
                                        <li><strong>保存现场数据：</strong></li>
                                    </ol>
                                    <pre class="code-block"># 复制日志和配置
cp -r /var/log/openclaw /tmp/openclaw-forensics-$(date +%Y%m%d)
cp -r ~/.openclaw /tmp/openclaw-config-$(date +%Y%m%d)</pre>
                                </div>

                                <div class="priority-item high">
                                    <h4>⚠️ P1 - 高优先级（30分钟内）</h4>
                                    <ol>
                                        <li><strong>轮换所有凭据：</strong></li>
                                    </ol>
                                    <pre class="code-block"># API密钥
# AWS
aws iam delete-access-key --access-key-id COMPROMISED_KEY
aws iam create-access-key --user-name openclaw-user

# OpenAI
# 在控制台删除旧密钥，生成新密钥

# 数据库密码
ALTER USER 'openclaw'@'localhost' IDENTIFIED BY 'new-strong-password';</pre>
                                    <ol start="2">
                                        <li><strong>检查其他系统：</strong></li>
                                    </ol>
                                    <ul>
                                        <li>检查是否有横向移动</li>
                                        <li>审计其他服务日志</li>
                                        <li>检查云资源访问记录</li>
                                    </ul>
                                </div>

                                <div class="priority-item medium">
                                    <h4>📋 P2 - 中优先级（2小时内）</h4>
                                    <ul>
                                        <li>完整系统扫描</li>
                                        <li>确定攻击来源和时间</li>
                                        <li>评估数据泄露范围</li>
                                        <li>通知相关利益方</li>
                                    </ul>
                                </div>
                            </div>
                        `
                    },
                    {
                        title: '三、凭据轮换流程',
                        content: `
                            <h5>凭据轮换检查清单</h5>
                            <table class="credentials-table">
                                <thead>
                                    <tr>
                                        <th>凭据类型</th>
                                        <th>轮换步骤</th>
                                        <th>验证方法</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>OpenClaw Token</strong></td>
                                        <td>
                                            1. 生成新Token<br>
                                            2. 更新配置文件<br>
                                            3. 重启服务
                                        </td>
                                        <td><code>curl -H "X-OpenClaw-Token: new-token" http://localhost:18789/api/status</code></td>
                                    </tr>
                                    <tr>
                                        <td><strong>AWS API Key</strong></td>
                                        <td>
                                            1. IAM控制台删除旧密钥<br>
                                            2. 创建新访问密钥<br>
                                            3. 更新环境变量
                                        </td>
                                        <td><code>aws sts get-caller-identity</code></td>
                                    </tr>
                                    <tr>
                                        <td><strong>OpenAI API Key</strong></td>
                                        <td>
                                            1. platform.openai.com删除旧密钥<br>
                                            2. 生成新API密钥<br>
                                            3. 更新配置
                                        </td>
                                        <td><code>curl https://api.openai.com/v1/models -H "Authorization: Bearer new-key"</code></td>
                                    </tr>
                                    <tr>
                                        <td><strong>数据库密码</strong></td>
                                        <td>
                                            1. ALTER USER修改密码<br>
                                            2. 更新连接字符串<br>
                                            3. 重启应用
                                        </td>
                                        <td><code>mysql -u openclaw -p'new-password'</code></td>
                                    </tr>
                                    <tr>
                                        <td><strong>SSH密钥</strong></td>
                                        <td>
                                            1. 生成新密钥对<br>
                                            2. 更新authorized_keys<br>
                                            3. 删除旧密钥
                                        </td>
                                        <td><code>ssh -i new-key user@host</code></td>
                                    </tr>
                                </tbody>
                            </table>

                            <h5>自动化凭据轮换脚本</h5>
                            <pre class="code-block">#!/bin/bash
# rotate-credentials.sh

echo "开始凭据轮换..."

# 1. 生成新Token
NEW_TOKEN=$(openssl rand -hex 32)
echo "新Token: $NEW_TOKEN"

# 2. 更新配置
sed -i "s/token: .*/token: $NEW_TOKEN/" ~/.openclaw/config.yaml

# 3. 重启服务
systemctl restart openclaw

# 4. 验证
sleep 5
curl -f -H "X-OpenClaw-Token: $NEW_TOKEN" http://localhost:18789/api/status
if [ $? -eq 0 ]; then
    echo "✓ Token轮换成功"
else
    echo "✗ Token轮换失败"
fi</pre>
                        `
                    },
                    {
                        title: '四、恢复与预防',
                        content: `
                            <h5>系统恢复步骤</h5>
                            <ol class="tutorial-steps">
                                <li><strong>从备份恢复：</strong></li>
                            </ol>
                            <pre class="code-block"># 恢复配置文件
cp /backup/openclaw/config.yaml ~/.openclaw/

# 恢复数据
openclaw restore --from /backup/openclaw/data-20260310.tar.gz</pre>

                            <ol class="tutorial-steps" start="2">
                                <li><strong>升级到安全版本：</strong></li>
                            </ol>
                            <pre class="code-block">pip install --upgrade openclaw
openclaw --version  # 确认是最新版本</pre>

                            <ol class="tutorial-steps" start="3">
                                <li><strong>重新配置安全设置：</strong></li>
                            </ol>
                            <ul>
                                <li>启用Token认证</li>
                                <li>配置HTTPS</li>
                                <li>使用Docker隔离</li>
                                <li>限制绑定地址</li>
                            </ul>

                            <ol class="tutorial-steps" start="4">
                                <li><strong>部署监控：</strong></li>
                            </ol>
                            <pre class="code-block"># 启用详细日志
openclaw config set log.level DEBUG
openclaw config set log.audit.enabled true</pre>

                            <h5>预防措施</h5>
                            <div class="checklist">
                                <ul class="checklist-items">
                                    <li><input type="checkbox"> 定期更新OpenClaw版本</li>
                                    <li><input type="checkbox"> 启用自动安全扫描</li>
                                    <li><input type="checkbox"> 配置异常告警</li>
                                    <li><input type="checkbox"> 定期轮换凭据（建议90天）</li>
                                    <li><input type="checkbox"> 实施最小权限原则</li>
                                    <li><input type="checkbox"> 建立应急响应计划</li>
                                    <li><input type="checkbox"> 定期备份配置和数据</li>
                                    <li><input type="checkbox"> 进行安全审计</li>
                                </ul>
                            </div>

                            <h5>事件报告模板</h5>
                            <pre class="code-block">安全事件报告

1. 事件概述
   - 发现时间：YYYY-MM-DD HH:MM:SS
   - 事件类型：[凭据泄露/恶意软件/数据泄露/未授权访问]
   - 影响范围：[受影响系统/数据/用户]

2. 攻击详情
   - 攻击向量：[如何发生的]
   - 攻击来源：[IP/域名/其他线索]
   - 漏洞利用：[CVE编号/其他]

3. 影响评估
   - 数据泄露：[类型和数量]
   - 系统损害：[受影响组件]
   - 财务损失：[估算损失]

4. 响应措施
   - 立即行动：[已采取的措施]
   - 凭据轮换：[已轮换的凭据]
   - 系统加固：[实施的防护措施]

5. 根本原因
   - [漏洞/配置错误/其他]

6. 预防措施
   - [将采取的预防措施]</pre>
                        `
                    }
                ]
            },
            'best-practices': {
                title: '安全最佳实践',
                icon: '📊',
                description: '建立纵深防御体系，避免成为"裸奔龙虾"',
                sections: [
                    {
                        title: '一、最小权限原则',
                        content: `
                            <h5>什么是最小权限原则</h5>
                            <p>仅授予OpenClaw完成任务所需的<strong>最少权限</strong>，不要默认授予管理员、root或其他高权限。</p>

                            <h5>实施步骤</h5>
                            <ol class="tutorial-steps">
                                <li><strong>创建专用用户：</strong></li>
                            </ol>
                            <pre class="code-block"># 创建专用用户运行OpenClaw
sudo useradd -m -s /bin/bash openclaw
sudo usermod -aG docker openclaw

# 使用该用户运行
su - openclaw
openclaw start</pre>

                            <ol class="tutorial-steps" start="2">
                                <li><strong>限制文件系统访问：</strong></li>
                            </ol>
                            <pre class="code-block"># 仅允许访问特定目录
chmod 750 /home/openclaw/.openclaw
chmod 600 /home/openclaw/.openclaw/config.yaml

# 使用Docker卷限制访问
docker run -v $(pwd)/data:/app/data:ro openclaw</pre>

                            <ol class="tutorial-steps" start="3">
                                <li><strong>配置权限白名单：</strong></li>
                            </ol>
                            <pre class="code-block"># config.yaml
permissions:
  file_system:
    read:
      - "/home/openclaw/workspace"
      - "/home/openclaw/data"
    write:
      - "/home/openclaw/workspace"
    deny:
      - "/etc"
      - "/root"
      - "/home/*/admin"
  network:
    allowed_hosts:
      - "api.example.com"
      - "cdn.example.com"
    deny_ports:
      - 22
      - 3306
      - 5432</pre>

                            <ol class="tutorial-steps" start="4">
                                <li><strong>限制system.run命令：</strong></li>
                            </ol>
                            <pre class="code-block">system:
  run:
    enabled: true
    whitelist:
      - "/usr/bin/python3"
      - "/bin/cat"
      - "/bin/ls"
    blacklist:
      - "rm *"
      - "sudo *"
      - "chmod *"
      - "chown *"</pre>
                        `
                    },
                    {
                        title: '二、定期安全更新',
                        content: `
                            <h5>更新策略</h5>
                            <div class="update-strategy">
                                <div class="strategy-item">
                                    <h4>🔴 安全补丁</h4>
                                    <p>立即应用（24小时内）</p>
                                    <ul>
                                        <li>CVE高危漏洞</li>
                                        <li>RCE漏洞</li>
                                        <li>零日漏洞</li>
                                    </ul>
                                </div>
                                <div class="strategy-item">
                                    <h4>🟡 功能更新</h4>
                                    <p>1周内测试后更新</p>
                                    <ul>
                                        <li>新功能</li>
                                        <li>性能改进</li>
                                        <li>配置变更</li>
                                    </ul>
                                </div>
                                <div class="strategy-item">
                                    <h4>🟢 小版本更新</h4>
                                    <p>1个月内更新</p>
                                    <ul>
                                        <li>Bug修复</li>
                                        <li>文档更新</li>
                                        <li>日志优化</li>
                                    </ul>
                                </div>
                            </div>

                            <h5>自动化更新流程</h5>
                            <pre class="code-block">#!/bin/bash
# auto-update.sh

# 检查更新
pip index versions openclaw

# 备份当前配置
cp -r ~/.openclaw ~/.openclaw.backup.$(date +%Y%m%d)

# 更新
pip install --upgrade openclaw

# 验证
openclaw --version
openclaw health-check

# 如果验证失败，回滚
if [ $? -ne 0 ]; then
    echo "更新失败，正在回滚..."
    pip install openclaw==previous-version
    exit 1
fi

echo "更新成功"</pre>

                            <h5>订阅安全公告</h5>
                            <ul>
                                <li>OpenClaw GitHub Releases</li>
                                <li>安全邮件列表</li>
                                <li>NVD CVE数据库</li>
                                <li>工信部安全预警</li>
                            </ul>
                        `
                    },
                    {
                        title: '三、网络隔离部署',
                        content: `
                            <h5>网络架构建议</h5>
                            <pre class="code-block">┌─────────────────────────────────────────┐
│         互联网 (公网)                      │
└─────────────────┬───────────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │  Nginx反向代理  │
         │  (HTTPS + WAF)  │
         └────────┬───────┘
                  │
         ┌────────▼──────────┐
         │  DMZ区域          │
         │  限制端口         │
         └────────┬──────────┘
                  │
         ┌────────▼──────────┐
         │  内网             │
         │  OpenClaw容器     │
         │  127.0.0.1:18789 │
         └───────────────────┘</pre>

                            <h5>Docker网络隔离</h5>
                            <pre class="code-block"># 创建隔离网络
docker network create --driver bridge openclaw-net

# 运行OpenClaw
docker run -d \\
  --name openclaw \\
  --network openclaw-net \\
  --network-alias openclaw \\
  openclaw:latest

# 仅允许Nginx访问
docker run -d \\
  --name nginx \\
  --network openclaw-net \\
  -p 443:443 \\
  nginx:latest</pre>

                            <h5>防火墙规则</h5>
                            <pre class="code-block"># iptables规则
# 默认拒绝所有入站
iptables -P INPUT DROP

# 允许本地回环
iptables -A INPUT -i lo -j ACCEPT

# 允许已建立的连接
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# 仅允许特定IP访问管理端口
iptables -A INPUT -p tcp --dport 18789 -s 10.0.0.0/8 -j ACCEPT

# 允许HTTPS
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# 允许SSH
iptables -A INPUT -p tcp --dport 22 -j ACCEPT</pre>

                            <h5>VLAN/VPC隔离</h5>
                            <ul>
                                <li>将OpenClaw部署在独立的VPC</li>
                                <li>使用私有子网</li>
                                <li>通过堡垒机访问</li>
                                <li>配置安全组规则</li>
                            </ul>
                        `
                    },
                    {
                        title: '四、日志审计监控',
                        content: `
                            <h5>启用详细日志</h5>
                            <pre class="code-block"># config.yaml
logging:
  level: INFO
  format: json
  outputs:
    - type: file
      path: /var/log/openclaw/openclaw.log
      rotate: true
      max_size: 100M
      max_age: 30
    - type: syslog
      facility: local0

audit:
  enabled: true
  log_all_commands: true
  log_api_calls: true
  log_file_access: true
  log_network_connections: true</pre>

                            <h5>监控关键指标</h5>
                            <div class="monitoring-metrics">
                                <div class="metric-category">
                                    <h4>🔐 安全指标</h4>
                                    <ul>
                                        <li>认证失败次数</li>
                                        <li>未授权访问尝试</li>
                                        <li>异常命令执行</li>
                                        <li>敏感文件访问</li>
                                        <li>外部连接建立</li>
                                    </ul>
                                </div>
                                <div class="metric-category">
                                    <h4>📊 性能指标</h4>
                                    <ul>
                                        <li>CPU使用率</li>
                                        <li>内存使用率</li>
                                        <li>网络流量</li>
                                        <li>响应时间</li>
                                        <li>错误率</li>
                                    </ul>
                                </div>
                                <div class="metric-category">
                                    <h4>🚨 告警规则</h4>
                                    <ul>
                                        <li>认证失败 > 5次/分钟</li>
                                        <li>CPU > 90% 持续5分钟</li>
                                        <li>网络流量异常</li>
                                        <li>未知进程启动</li>
                                        <li>文件被篡改</li>
                                    </ul>
                                </div>
                            </div>

                            <h5>使用ELK Stack分析日志</h5>
                            <pre class="code-block"># Filebeat配置
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /var/log/openclaw/*.log
    json.keys_under_root: true

output.elasticsearch:
  hosts: ["localhost:9200"]
  index: "openclaw-%{+yyyy.MM.dd}"

# Kibana查询示例
# 查找认证失败
action: "login" AND status: "failed"

# 查找异常命令
command: * AND (command: "rm" OR command: "sudo")

# 查找外部连接
network: "outbound" AND NOT dest_ip: "10.0.0.0/8"</pre>

                            <h5>定期审计</h5>
                            <div class="audit-checklist">
                                <h4>每日检查</h4>
                                <ul>
                                    <li>查看错误日志</li>
                                    <li>检查认证失败</li>
                                    <li>监控系统资源</li>
                                </ul>

                                <h4>每周检查</h4>
                                <ul>
                                    <li>审计所有命令执行</li>
                                    <li>检查文件访问记录</li>
                                    <li>审查网络连接</li>
                                </ul>

                                <h4>每月检查</h4>
                                <ul>
                                    <li>完整安全审计</li>
                                    <li>权限审查</li>
                                    <li>漏洞扫描</li>
                                    <li>渗透测试</li>
                                </ul>
                            </div>
                        `
                    }
                ]
            },
            'scanner': {
                title: '扫描工具使用指南',
                icon: '🛠️',
                description: '掌握OpenClaw安全扫描工具的使用',
                sections: [
                    {
                        title: '工具介绍',
                        content: `
                            <h5>OpenClaw Security Scanner 功能</h5>
                            <ul>
                                <li>✅ CVE漏洞检测</li>
                                <li>✅ 公网暴露检测</li>
                                <li>✅ 配置安全审计</li>
                                <li>✅ 凭据泄露扫描</li>
                                <li>✅ 恶意技能识别</li>
                                <li>✅ 生成详细报告</li>
                            </ul>

                            <h5>安装扫描工具</h5>
                            <pre class="code-block"># 使用pip安装
pip install openclaw-scanner

# 或从源码安装
git clone https://github.com/openclaw/scanner
cd scanner
pip install -e .

# 验证安装
openclaw-scanner --version</pre>
                        `
                    },
                    {
                        title: '基础扫描',
                        content: `
                            <h5>快速扫描</h5>
                            <pre class="code-block"># 扫描本地OpenClaw实例
openclaw-scanner --target localhost:18789

# 输出示例：
# ══════════════════════════════════════
# OpenClaw Security Scanner v2.1.0
# ══════════════════════════════════════
#
# Target: localhost:18789
# Scan Time: 2026-03-11 10:30:45
#
# ══════════════════════════════════════
# 🎯 VULNERABILITIES FOUND: 3
# ══════════════════════════════════════
#
# [HIGH] CVE-2026-25253 - Remote Code Execution
#        Status: VULNERABLE
#        Fix: Upgrade to v2026.1.29+
#
# [MEDIUM] Information Disclosure
#        Status: VULNERABLE
#        Fix: Upgrade to v2026.1.31+
#
# [LOW] Weak Token
#        Status: WARNING
#        Fix: Use stronger token</pre>

                            <h5>扫描选项</h5>
                            <pre class="code-block"># 完整扫描（包括插件）
openclaw-scanner --target localhost:18789 --full-scan

# 仅扫描CVE漏洞
openclaw-scanner --target localhost:18789 --cve-only

# 扫描并生成JSON报告
openclaw-scanner --target localhost:18789 --output report.json

# 扫描远程实例
openclaw-scanner --target https://openclaw.example.com \\
  --token your-token</pre>

                            <h5>批量扫描</h5>
                            <pre class="code-block"># 从文件读取目标列表
cat targets.txt
localhost:18789
10.0.0.5:18789
openclaw.example.com:443

# 批量扫描
openclaw-scanner --batch targets.txt --output-dir ./reports</pre>
                        `
                    },
                    {
                        title: '高级功能',
                        content: `
                            <h5>端口扫描检测</h5>
                            <pre class="code-block"># 检查公网暴露的端口
openclaw-scanner --check-exposed --ip your-public-ip

# 扫描端口范围
openclaw-scanner --port-scan --range 18789-18800

# 输出示例：
# [!] Port 18789 is EXPOSED to public internet
# [!] Port 18800 is EXPOSED to public internet
# [✓] Port 22 is not accessible</pre>

                            <h5>凭据泄露扫描</h5>
                            <pre class="code-block"># 扫描配置文件中的明文凭据
openclaw-scanner --scan-credentials \\
  --config ~/.openclaw/config.yaml

# 输出示例：
# [!] Found plaintext API key in config.yaml:123
# [!] Found AWS secret key in config.yaml:456
# [!] Found database password in config.yaml:789</pre>

                            <h5>恶意技能扫描</h5>
                            <pre class="code-block"># 扫描已安装的技能
openclaw-scanner --scan-skills

# 输出示例：
# Scanning 12 installed skills...
#
# [!] Suspicious skill: trading-bot-v2
#     Risk: HIGH
#     Reason: Contains obfuscated code
#     Action: Review or remove immediately
#
# [!] Suspicious skill: crypto-miner
#     Risk: CRITICAL
#     Reason: Known malicious skill
#     Action: REMOVE IMMEDIATELY</pre>

                            <h5>配置审计</h5>
                            <pre class="code-block"># 审计配置文件
openclaw-scanner --audit-config \\
  --config ~/.openclaw/config.yaml

# 输出示例：
# ══════════════════════════════════════
# Configuration Audit Report
# ══════════════════════════════════════
#
# [FAIL] Token authentication not enabled
# [FAIL] Binding to 0.0.0.0 (exposed to all interfaces)
# [WARN] Debug mode enabled in production
# [WARN] Log level set to DEBUG (may log sensitive data)
# [PASS] HTTPS enabled
# [FAIL] No rate limiting configured
#
# Score: 2/6 (33%)</pre>
                        `
                    },
                    {
                        title: '报告生成',
                        content: `
                            <h5>生成HTML报告</h5>
                            <pre class="code-block">openclaw-scanner --target localhost:18789 \\
  --output-format html \\
  --output report.html

# 在浏览器中打开
xdg-open report.html  # Linux
open report.html      # Mac</pre>

                            <h5>生成JSON报告（用于CI/CD）</h5>
                            <pre class="code-block">openclaw-scanner --target localhost:18789 \\
  --output-format json \\
  --output report.json</pre>

                            <h5>生成PDF报告</h5>
                            <pre class="code-block">openclaw-scanner --target localhost:18789 \\
  --output-format pdf \\
  --output security-report.pdf</pre>

                            <h5>集成到CI/CD</h5>
                            <pre class="code-block"># .github/workflows/security-scan.yml
name: Security Scan

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Install scanner
        run: pip install openclaw-scanner

      - name: Run security scan
        run: |
          openclaw-scanner --target localhost:18789 \\
            --output-format json \\
            --output scan-report.json

      - name: Check for vulnerabilities
        run: |
          if grep -q '"vulnerabilities":\s*[^0]' scan-report.json; then
            echo "Security vulnerabilities found!"
            exit 1
          fi

      - name: Upload report
        uses: actions/upload-artifact@v2
        with:
          name: security-scan-report
          path: scan-report.json</pre>
                        `
                    },
                    {
                        title: '修复建议',
                        content: `
                            <h5>自动修复某些问题</h5>
                            <pre class="code-block"># 自动修复配置问题
openclaw-scanner --auto-fix \\
  --target localhost:18789

# 执行的修复：
# [✓] Enabled token authentication
# [✓] Changed bind address to 127.0.0.1
# [✓] Disabled debug mode
# [✓] Set secure log level
# [✓] Added rate limiting</pre>

                            <h5>生成修复脚本</h5>
                            <pre class="code-block"># 生成修复脚本（不自动执行）
openclaw-scanner --generate-fix-script \\
  --output fix.sh

# 查看修复内容
cat fix.sh

# 手动执行修复
bash fix.sh</pre>

                            <h5>优先级修复建议</h5>
                            <div class="fix-priority">
                                <div class="priority-item critical">
                                    <h4>🚨 立即修复（P0）</h4>
                                    <ul>
                                        <li>RCE漏洞（CVE-2026-25253）</li>
                                        <li>公网暴露的实例</li>
                                        <li>无认证的实例</li>
                                        <li>已知恶意技能</li>
                                    </ul>
                                </div>
                                <div class="priority-item high">
                                    <h4>⚠️ 尽快修复（P1）</h4>
                                    <ul>
                                        <li>权限提升漏洞</li>
                                        <li>信息泄露漏洞</li>
                                        <li>弱Token/密码</li>
                                        <li>配置错误</li>
                                    </ul>
                                </div>
                                <div class="priority-item medium">
                                    <h4>📋 计划修复（P2）</h4>
                                    <ul>
                                        <li>启用审计日志</li>
                                        <li>配置HTTPS</li>
                                        <li>实施Docker隔离</li>
                                        <li>添加监控告警</li>
                                    </ul>
                                </div>
                            </div>
                        `
                    }
                ]
            },
            'beginner-intro': {
                title: 'OpenClaw简介',
                icon: '🚀',
                description: '了解OpenClaw是什么、它的核心功能以及适用场景',
                sections: [
                    {
                        title: '什么是OpenClaw',
                        content: `
                            <h5>OpenClaw简介</h5>
                            <p>OpenClaw是一个开源的AI智能体（AI Agent）框架，于2026年初迅速走红。它定位为自主执行复杂任务的AI助手框架，因其强大的自主执行能力和灵活的技能扩展机制而获得用户青睐。</p>

                            <div class="highlight-box">
                                <h4>🌟 核心理念</h4>
                                <p>OpenClaw的核心设计理念是赋予AI代理高权限，使其能够自主访问邮件、银行账户、API凭证等敏感资源，并代表用户执行各种复杂任务。</p>
                            </div>

                            <h5>发展历程</h5>
                            <ul>
                                <li><strong>2025年11-12月：</strong>项目处于早期开发阶段</li>
                                <li><strong>2026年1月24-28日：</strong>正式上线发布</li>
                                <li><strong>2026年1月底：</strong>GitHub Star数迅速突破10万</li>
                                <li><strong>2026年2月：</strong>成为AI领域现象级开源项目</li>
                                <li><strong>2026年3月：</strong>用户数量激增，但同时也暴露了严重安全问题</li>
                            </ul>

                            <h5>项目背景</h5>
                            <p>OpenClaw由开发者Peter Steinberger创建，最初只是一个周末项目，但因其创新的AI智能体理念和强大的实用性迅速在GitHub和开发者社区走红。</p>
                        `
                    },
                    {
                        title: '核心功能特性',
                        content: `
                            <h5>主要功能模块</h5>
                            <div class="feature-grid">
                                <div class="mini-feature">
                                    <h4>🤖 自主任务执行</h4>
                                    <p>AI可以根据自然语言指令自主规划和执行复杂任务</p>
                                </div>
                                <div class="mini-feature">
                                    <h4>🔌 技能扩展系统</h4>
                                    <p>通过插件机制扩展功能，支持社区贡献的技能包</p>
                                </div>
                                <div class="mini-feature">
                                    <h4>💬 多模型支持</h4>
                                    <p>支持Claude、GPT-4、Gemini等多种LLM模型</p>
                                </div>
                                <div class="mini-feature">
                                    <h4>🌐 Web界面</h4>
                                    <p>提供友好的Web UI，支持对话式交互</p>
                                </div>
                                <div class="mini-feature">
                                    <h4>📝 代码能力</h4>
                                    <p>能够阅读、编写和调试代码</p>
                                </div>
                                <div class="mini-feature">
                                    <h4>🔍 信息检索</h4>
                                    <p>自主搜索网络资源和文档</p>
                                </div>
                            </div>

                            <h5>技术架构</h5>
                            <pre class="code-block">┌─────────────────────────────────────┐
│          用户界面层 (Web UI)          │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│         核心调度引擎 (Core)           │
│  - 任务分解                          │
│  - 技能调用                          │
│  - 状态管理                          │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│      LLM接口层 (LLM Provider)        │
│  - Claude API                        │
│  - OpenAI API                        │
│  - 其他模型                           │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│       技能插件系统 (Skills)           │
│  - 文件操作                          │
│  - 网络请求                          │
│  - 系统命令                          │
│  - 数据处理                          │
└─────────────────────────────────────┘</pre>
                        `
                    },
                    {
                        title: '适用场景',
                        content: `
                            <h5>典型应用场景</h5>
                            <div class="use-case-list">
                                <div class="use-case">
                                    <h4>💼 办公自动化</h4>
                                    <ul>
                                        <li>自动整理邮件和文档</li>
                                        <li>生成会议纪要</li>
                                        <li>日程管理和提醒</li>
                                        <li>报表生成</li>
                                    </ul>
                                </div>
                                <div class="use-case">
                                    <h4>💻 软件开发</h4>
                                    <ul>
                                        <li>代码审查和重构</li>
                                        <li>自动化测试</li>
                                        <li>Bug修复</li>
                                        <li>文档生成</li>
                                    </ul>
                                </div>
                                <div class="use-case">
                                    <h4>📊 数据分析</h4>
                                    <ul>
                                        <li>数据清洗</li>
                                        <li>统计分析</li>
                                        <li>图表生成</li>
                                        <li>报告输出</li>
                                    </ul>
                                </div>
                                <div class="use-case">
                                    <h4>🔬 研究辅助</h4>
                                    <ul>
                                        <li>文献检索</li>
                                        <li>资料整理</li>
                                        <li>实验数据分析</li>
                                        <li>论文写作辅助</li>
                                    </ul>
                                </div>
                                <div class="use-case">
                                    <h4>🛒 个人助理</h4>
                                    <ul>
                                        <li>购物比价</li>
                                        <li>旅行规划</li>
                                        <li>票务预订</li>
                                        <li>信息查询</li>
                                    </ul>
                                </div>
                                <div class="use-case">
                                    <h4>🎨 创意工作</h4>
                                    <ul>
                                        <li>内容创作</li>
                                        <li>图像生成</li>
                                        <li>视频脚本</li>
                                        <li>营销文案</li>
                                    </ul>
                                </div>
                            </div>

                            <h5>成功案例</h5>
                            <div class="case-study">
                                <h4>案例1：自动化文档生成</h4>
                                <p>某开发团队使用OpenClaw自动生成API文档，节省了70%的文档编写时间。</p>
                            </div>
                            <div class="case-study">
                                <h4>案例2：智能客服</h4>
                                <p>电商公司将OpenClaw集成到客服系统，自动处理80%的常规咨询。</p>
                            </div>
                        `
                    },
                    {
                        title: '架构概述',
                        content: `
                            <h5>技术栈</h5>
                            <table class="tech-table">
                                <tr>
                                    <th>组件</th>
                                    <th>技术选型</th>
                                </tr>
                                <tr>
                                    <td>后端框架</td>
                                    <td>Python (FastAPI)</td>
                                </tr>
                                <tr>
                                    <td>前端界面</td>
                                    <td>React + TypeScript</td>
                                </tr>
                                <tr>
                                    <td>LLM接口</td>
                                    <td>Anthropic Claude、OpenAI GPT等</td>
                                </tr>
                                <tr>
                                    <td>数据库</td>
                                    <td>SQLite (可配置其他)</td>
                                </tr>
                                <tr>
                                    <td>任务队列</td>
                                    <td>内置异步任务系统</td>
                                </tr>
                            </table>

                            <h5>系统要求</h5>
                            <div class="requirements-box">
                                <h4>最低配置</h4>
                                <ul>
                                    <li>CPU: 2核</li>
                                    <li>内存: 4GB</li>
                                    <li>存储: 10GB可用空间</li>
                                    <li>网络: 稳定的互联网连接</li>
                                    <li>操作系统: Windows 10+, macOS 10.15+, Linux</li>
                                </ul>
                            </div>

                            <div class="requirements-box">
                                <h4>推荐配置</h4>
                                <ul>
                                    <li>CPU: 4核或以上</li>
                                    <li>内存: 8GB或以上</li>
                                    <li>存储: 50GB SSD</li>
                                    <li>网络: 宽带连接</li>
                                </ul>
                            </div>

                            <h5>与其他AI助手的区别</h5>
                            <table class="compare-table">
                                <thead>
                                    <tr>
                                        <th>特性</th>
                                        <th>OpenClaw</th>
                                        <th>传统Chatbot</th>
                                        <th>其他Agent</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>自主执行</td>
                                        <td class="success">✓ 强</td>
                                        <td class="fail">✗ 无</td>
                                        <td class="success">✓ 中</td>
                                    </tr>
                                    <tr>
                                        <td>技能扩展</td>
                                        <td class="success">✓ 强</td>
                                        <td class="fail">✗ 弱</td>
                                        <td class="warning">△ 中</td>
                                    </tr>
                                    <tr>
                                        <td>开源程度</td>
                                        <td class="success">✓ 完全开源</td>
                                        <td class="warning">△ 部分开源</td>
                                        <td class="fail">✗ 闭源</td>
                                    </tr>
                                    <tr>
                                        <td>本地部署</td>
                                        <td class="success">✓ 支持</td>
                                        <td class="fail">✗ 云端</td>
                                        <td class="success">✓ 支持</td>
                                    </tr>
                                </tbody>
                            </table>
                        `
                    }
                ]
            },
            'beginner-install': {
                title: '安装与配置',
                icon: '⬇️',
                description: '从零开始安装OpenClaw，完成环境准备和初始配置',
                sections: [
                    {
                        title: '一、系统要求检查',
                        content: `
                            <h5>支持的操作系统</h5>
                            <ul>
                                <li><strong>Windows:</strong> Windows 10/11 (推荐使用WSL2)</li>
                                <li><strong>macOS:</strong> macOS 10.15 Catalina及更高版本</li>
                                <li><strong>Linux:</strong> Ubuntu 20.04+, Debian 11+, CentOS 8+</li>
                            </ul>

                            <h5>前置依赖</h5>
                            <div class="prerequisites">
                                <h4>Python环境</h4>
                                <p>OpenClaw需要Python 3.10或更高版本</p>
                                <pre class="code-block"># 检查Python版本
python --version
# 或
python3 --version</pre>

                                <h4>包管理器</h4>
                                <p>确保已安装pip</p>
                                <pre class="code-block"># 检查pip版本
pip --version</pre>

                                <h4>Git（可选）</h4>
                                <p>如果从源码安装需要Git</p>
                                <pre class="code-block"># 检查Git版本
git --version</pre>
                            </div>

                            <h5>环境检查脚本</h5>
                            <pre class="code-block"># 创建检查脚本
cat > check-env.sh << 'EOF'
#!/bin/bash
echo "检查Python版本..."
python --version

echo "检查pip..."
pip --version

echo "检查磁盘空间..."
df -h

echo "环境检查完成！"
EOF

bash check-env.sh</pre>
                        `
                    },
                    {
                        title: '二、安装OpenClaw',
                        content: `
                            <h5>方法1：使用pip安装（推荐）</h5>
                            <ol class="tutorial-steps">
                                <li>打开终端或命令行</li>
                                <li>执行安装命令：</li>
                            </ol>
                            <pre class="code-block">pip install openclaw</pre>

                            <h5>方法2：从源码安装</h5>
                            <ol class="tutorial-steps">
                                <li>克隆仓库：</li>
                            </ol>
                            <pre class="code-block">git clone https://github.com/openclaw/openclaw.git
cd openclaw</pre>
                            <ol class="tutorial-steps" start="2">
                                <li>安装依赖：</li>
                            </ol>
                            <pre class="code-block">pip install -e .</pre>

                            <h5>方法3：使用Docker安装</h5>
                            <pre class="code-block"># 拉取Docker镜像
docker pull openclaw/openclaw:latest

# 运行容器
docker run -d \\
  --name openclaw \\
  -p 18789:18789 \\
  -v openclaw-data:/app/data \\
  openclaw/openclaw:latest</pre>

                            <h5>验证安装</h5>
                            <pre class="code-block"># 检查OpenClaw版本
openclaw --version</pre>

                            <div class="success-box">
                                <h4>✅ 安装成功标志</h4>
                                <p>如果看到版本号输出（如 v2026.3.8），说明安装成功！</p>
                            </div>
                        `
                    },
                    {
                        title: '三、初始配置',
                        content: `
                            <h5>配置文件位置</h5>
                            <p>OpenClaw的配置文件通常位于：</p>
                            <ul>
                                <li><strong>Linux/macOS:</strong> <code>~/.openclaw/config.yaml</code></li>
                                <li><strong>Windows:</strong> <code>C:\\Users\\YourName\\.openclaw\\config.yaml</code></li>
                            </ul>

                            <h5>基础配置</h5>
                            <pre class="code-block"># 创建配置目录
mkdir -p ~/.openclaw

# 创建配置文件
cat > ~/.openclaw/config.yaml << 'EOF'
# OpenClaw配置文件

# LLM配置
llm:
  provider: anthropic  # 或 openai, google
  api_key: "your-api-key-here"
  model: "claude-3-5-sonnet-20241022"

# 服务器配置
server:
  host: "127.0.0.1"
  port: 18789

# 工作目录
workspace: "~/openclaw-workspace"

# 日志配置
logging:
  level: INFO
  file: ~/.openclaw/logs/openclaw.log
EOF</pre>

                            <h5>API密钥获取</h5>
                            <div class="api-key-guide">
                                <h4>Anthropic Claude API</h4>
                                <ol>
                                    <li>访问 console.anthropic.com</li>
                                    <li>注册/登录账户</li>
                                    <li>进入API Keys页面</li>
                                    <li>创建新的API Key</li>
                                    <li>复制密钥（仅显示一次！）</li>
                                </ol>
                            </div>

                            <div class="warning-box">
                                <h4>⚠️ API密钥安全提示</h4>
                                <ul>
                                    <li>永远不要将API密钥提交到公共代码仓库</li>
                                    <li>定期轮换API密钥</li>
                                    <li>设置密钥使用限额和告警</li>
                                </ul>
                            </div>
                        `
                    },
                    {
                        title: '四、环境变量配置',
                        content: `
                            <h5>设置API密钥环境变量</h5>
                            <p>除了配置文件，也可以使用环境变量设置敏感信息：</p>

                            <pre class="code-block"># Linux/macOS
export ANTHROPIC_API_KEY="your-api-key-here"

# Windows PowerShell
$env:ANTHROPIC_API_KEY="your-api-key-here"

# Windows CMD
set ANTHROPIC_API_KEY=your-api-key-here</pre>

                            <h5>永久环境变量</h5>
                            <p><strong>Linux/macOS:</strong> 在 ~/.bashrc 或 ~/.zshrc 中添加：</p>
                            <pre class="code-block">echo 'export ANTHROPIC_API_KEY="your-api-key"' >> ~/.bashrc
source ~/.bashrc</pre>

                            <p><strong>Windows:</strong> 通过系统设置添加</p>
                            <ol>
                                <li>打开"系统属性" → "高级" → "环境变量"</li>
                                <li>在"用户变量"中新建变量</li>
                                <li>变量名：ANTHROPIC_API_KEY</li>
                                <li>变量值：你的API密钥</li>
                            </ol>

                            <h5>.env文件方式（推荐开发环境）</h5>
                            <pre class="code-block"># 创建.env文件
cat > ~/.openclaw/.env << 'EOF'
ANTHROPIC_API_KEY=your-api-key-here
OPENAI_API_KEY=your-openai-key-here
EOF

# 确保.env文件在.gitignore中
echo ".env" >> ~/.openclaw/.gitignore</pre>
                        `
                    },
                    {
                        title: '五、验证安装',
                        content: `
                            <h5>测试安装</h5>
                            <pre class="code-block"># 测试OpenClaw是否正常工作
openclaw --help

# 应显示帮助信息
Usage: openclaw [OPTIONS] COMMAND [ARGS]...</pre>

                            <h5>运行诊断检查</h5>
                            <pre class="code-block"># 运行系统诊断
openclaw doctor</pre>

                            <h5>查看日志</h5>
                            <pre class="code-block"># 查看实时日志
tail -f ~/.openclaw/logs/openclaw.log</pre>

                            <div class="troubleshooting-box">
                                <h4>🔧 常见安装问题</h4>

                                <h5>问题1：Python版本不兼容</h5>
                                <pre class="code-block">Error: Python 3.9 or higher required</pre>
                                <p><strong>解决：</strong>升级Python到3.10+</p>
                                <pre class="code-block"># macOS
brew install python@3.11

# Ubuntu/Debian
sudo apt update
sudo apt install python3.11</pre>

                                <h5>问题2：pip权限错误</h5>
                                <pre class="code-block">ERROR: Could not install packages due to an EnvironmentError</pre>
                                <p><strong>解决：</strong>使用用户安装模式</p>
                                <pre class="code-block">pip install --user openclaw</pre>

                                <h5>问题3：网络连接超时</h5>
                                <p><strong>解决：</strong>配置国内镜像源</p>
                                <pre class="code-block">pip install -i https://pypi.tuna.tsinghua.edu.cn/simple openclaw</pre>
                            </div>
                        `
                    }
                ]
            },
            'beginner-first-run': {
                title: '第一次运行',
                icon: '▶️',
                description: '启动OpenClaw并进行第一次对话测试',
                sections: [
                    {
                        title: '启动OpenClaw服务',
                        content: `
                            <h5>启动命令</h5>
                            <pre class="code-block"># 基础启动
openclaw start

# 指定配置文件
openclaw start --config ~/.openclaw/config.yaml

# 后台运行
openclaw start --daemon</pre>

                            <h5>查看启动日志</h5>
                            <pre class="code-block"># 实时查看日志
openclaw logs --follow</pre>

                            <h5>启动成功标志</h5>
                            <p>看到以下输出说明启动成功：</p>
                            <pre class="code-block">[INFO] Starting OpenClaw server...
[INFO] Server running on http://127.0.0.1:18789
[INFO] Ready to accept connections</pre>

                            <div class="success-box">
                                <h4>✅ 服务已启动</h4>
                                <p>OpenClaw Web界面地址：<a href="http://localhost:18789" target="_blank">http://localhost:18789</a></p>
                            </div>
                        `
                    },
                    {
                        title: '访问Web界面',
                        content: `
                            <h5>打开浏览器</h5>
                            <ol class="tutorial-steps">
                                <li>打开浏览器（Chrome、Firefox、Safari等）</li>
                                <li>在地址栏输入：<code>http://localhost:18789</code></li>
                                <li>按回车键访问</li>
                            </ol>

                            <h5>界面介绍</h5>
                            <div class="ui-tour">
                                <h4>主界面布局</h4>
                                <pre class="code-block">┌────────────────────────────────────────┐
│  OpenClaw                                 │
│  ┌──────────────┬──────────────────────────┐   │
│  │ 对话历史     │  当前对话              │   │
│  │              │  ┌─────────────────┐  │   │
│  │              │  │ 输入框          │  │   │
│  │              │  └─────────────────┘  │   │
│  └──────────────┴──────────────────────────┘   │
│  ┌────────────────────────────────────────┐ │
│  │ 工具栏                                 │ │
│  │ [新对话] [设置] [技能] [历史]          │ │
│  └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘</pre>
                            </div>

                            <h5>首次访问设置</h5>
                            <p>第一次访问时，可能需要：</p>
                            <ol>
                                <li>接受服务条款</li>
                                <li>选择LLM提供商</li>
                                <li>输入API密钥</li>
                                <li>选择默认模型</li>
                            </ol>
                        `
                    },
                    {
                        title: '第一次对话',
                        content: `
                            <h5>开始对话</h5>
                            <p>在输入框中输入你的第一个问题或指令，例如：</p>

                            <div class="example-prompts">
                                <div class="prompt-example">
                                    <h4>示例1：简单问候</h4>
                                    <pre class="code-block">你好，请介绍一下你自己</pre>
                                </div>

                                <div class="prompt-example">
                                    <h4>示例2：文件操作</h4>
                                    <pre class="code-block">帮我列出当前目录的文件</pre>
                                </div>

                                <div class="prompt-example">
                                    <h4>示例3：编程任务</h4>
                                    <pre class="code-block">帮我写一个Python函数计算斐波那契数列</pre>
                                </div>

                                <div class="prompt-example">
                                    <h4>示例4：信息查询</h4>
                                    <pre class="code-block">搜索一下今天的热门新闻</pre>
                                </div>
                            </div>

                            <h5>对话技巧</h5>
                            <ul>
                                <li><strong>明确具体：</strong>给出清晰的任务描述</li>
                                <li><strong>提供上下文：</strong>提供必要的背景信息</li>
                                <li><strong>分步骤：</strong>复杂任务可以分步进行</li>
                                <li><strong>给予反馈：</strong>根据结果调整指令</li>
                            </ul>
                        `
                    },
                    {
                        title: '基本功能测试',
                        content: `
                            <h5>测试清单</h5>
                            <div class="test-checklist">
                                <h4>✅ 基础功能测试</h4>
                                <ul class="checklist-items">
                                    <li><input type="checkbox"> 发送文本消息并接收回复</li>
                                    <li><input type="checkbox"> 创建新对话</li>
                                    <li><input type="checkbox"> 查看对话历史</li>
                                    <li><input type="checkbox"> 导出对话记录</li>
                                </ul>

                                <h4>✅ 高级功能测试</h4>
                                <ul class="checklist-items">
                                    <li><input type="checkbox"> 尝试文件读取技能</li>
                                    <li><input type="checkbox"> 尝试代码执行技能</li>
                                    <li><input type="checkbox"> 尝试网页浏览技能</li>
                                    <li><input type="checkbox"> 测试多轮对话</li>
                                </ul>

                                <h4>✅ 设置功能测试</h4>
                                <ul class="checklist-items">
                                    <li><input type="checkbox"> 修改API配置</li>
                                    <li><input type="checkbox"> 调整日志级别</li>
                                    <li><input type="checkbox"> 配置工作目录</li>
                                    <li><input type="checkbox"> 查看系统状态</li>
                                </ul>
                            </div>

                            <h5>停止服务</h5>
                            <pre class="code-block"># 优雅停止
openclaw stop

# 强制停止
openclaw kill

# 查看状态
openclaw status</pre>
                        `
                    }
                ]
            },
            'beginner-skills': {
                title: '技能插件使用',
                icon: '🔌',
                description: '学习如何安装和使用OpenClaw的技能插件扩展功能',
                sections: [
                    {
                        title: '什么是Skills',
                        content: `
                            <h5>Skills（技能）简介</h5>
                            <p>Skills是OpenClaw的插件系统，允许AI智能体执行特定的任务。每个Skill都是一个独立的功能模块，可以扩展OpenClaw的能力。</p>

                            <h5>技能类型</h5>
                            <div class="skill-types">
                                <div class="skill-type">
                                    <h4>📁 文件操作类</h4>
                                    <ul>
                                        <li>读取文件</li>
                                        <li>写入文件</li>
                                        <li>目录遍历</li>
                                        <li>文件搜索</li>
                                    </ul>
                                </div>
                                <div class="skill-type">
                                    <h4>💻 代码执行类</h4>
                                    <ul>
                                        <li>运行Python代码</li>
                                        <li>执行Shell命令</li>
                                        <li>代码解释</li>
                                        <li>代码测试</li>
                                    </ul>
                                </div>
                                <div class="skill-type">
                                    <h4>🌐 网络请求类</h4>
                                    <ul>
                                        <li>HTTP请求</li>
                                        <li>网页抓取</li>
                                        <li>API调用</li>
                                        <li>数据下载</li>
                                    </ul>
                                </div>
                                <div class="skill-type">
                                    <h4>🔍 信息检索类</h4>
                                    <ul>
                                        <li>网页搜索</li>
                                        <li>文档查询</li>
                                        <li>知识库问答</li>
                                        <li>数据库查询</li>
                                    </ul>
                                </div>
                            </div>
                        `
                    },
                    {
                        title: '查找技能',
                        content: `
                            <h5>官方技能市场</h5>
                            <p>OpenClaw有官方的技能市场ClawHub，可以浏览和安装社区贡献的技能。</p>

                            <h5>浏览技能</h5>
                            <ol class="tutorial-steps">
                                <li>访问ClawHub网站</li>
                                <li>按类别浏览技能</li>
                                <li>查看技能说明和评分</li>
                                <li>检查技能兼容性</li>
                            </ol>

                            <h5>热门技能推荐</h5>
                            <div class="popular-skills">
                                <div class="skill-card">
                                    <h4>📄 read_file</h4>
                                    <p>读取文件内容</p>
                                    <span class="skill-rating">⭐⭐⭐⭐⭐</span>
                                </div>
                                <div class="skill-card">
                                    <h4>💻 execute_python</h4>
                                    <p>执行Python代码</p>
                                    <span class="skill-rating">⭐⭐⭐⭐⭐</span>
                                </div>
                                <div class="skill-card">
                                    <h4>🌐 browse_website</h4>
                                    <p>浏览网页内容</p>
                                    <span class="skill-rating">⭐⭐⭐⭐</span>
                                </div>
                                <div class="skill-card">
                                    <h4>📊 search_web</h4>
                                    <p>网络搜索</p>
                                    <span class="skill-rating">⭐⭐⭐⭐</span>
                                </div>
                            </div>

                            <h5>技能安全注意事项</h5>
                            <div class="warning-box">
                                <h4>⚠️ ClawHavoc事件警告</h4>
                                <p>根据安全报告，ClawHub市场曾出现恶意技能供应链攻击（ClawHavoc事件），影响135,000+设备。请务必：</p>
                                <ul>
                                    <li>只安装官方或知名作者发布的技能</li>
                                    <li>检查技能的代码和权限要求</li>
                                    <li>查看技能的Star数和评价</li>
                                    <li>警惕"过于完美"的承诺</li>
                                </ul>
                            </div>
                        `
                    },
                    {
                        title: '安装技能',
                        content: `
                            <h5>安装方法</h5>

                            <h6>方法1：通过配置文件安装</h6>
                            <pre class="code-block"># 编辑配置文件
vim ~/.openclaw/config.yaml

# 添加技能配置
skills:
  - name: read_file
    enabled: true
  - name: execute_python
    enabled: true
  - name: browse_website
    enabled: true</pre>

                            <h6>方法2：通过命令行安装</h6>
                            <pre class="code-block"># 列出可用技能
openclaw skills list

# 安装技能
openclaw skills install read_file
openclaw skills install execute_python

# 批量安装
openclaw skills install read_file execute_python browse_website</pre>

                            <h6>方法3：从GitHub安装</h6>
                            <pre class="code-block"># 安装第三方技能
openclaw skills install https://github.com/username/skill-repo</pre>

                            <h5>验证安装</h5>
                            <pre class="code-block"># 查看已安装技能
openclaw skills list --installed

# 测试技能
echo "测试文件读取" > /tmp/test.txt
openclaw skills run read_file /tmp/test.txt</pre>

                            <h5>技能依赖</h5>
                            <p>某些技能可能需要额外的依赖包：</p>
                            <pre class="code-block"># 安装技能依赖
openclaw skills install-deps skill_name</pre>
                        `
                    },
                    {
                        title: '使用技能',
                        content: `
                            <h5>在对话中使用技能</h5>
                            <p>安装技能后，可以直接在对话中调用它们：</p>

                            <div class="skill-examples">
                                <h6>示例1：读取文件</h6>
                                <pre class="code-block">你：请读取当前目录下的README.md文件

AI：好的，我来帮你读取README.md文件
[使用read_file技能]
文件内容如下：
...</pre>

                                <h6>示例2：执行代码</h6>
                                <pre class="code-block">你：帮我计算1到100的和

AI：好的，我来编写Python代码计算
[使用execute_python技能]
<code class="python-code">total = sum(range(1, 101))
print(f"1到100的和是：{total}")</code>
执行结果：1到100的和是：5050</pre>

                                <h6>示例3：搜索信息</h6>
                                <pre class="code-block">你：搜索OpenClaw的最新版本号

AI：好的，我来搜索OpenClaw的最新版本信息
[使用search_web技能]
搜索结果：OpenClaw最新版本是v2026.3.8...</pre>
                            </div>

                            <h5>技能链式调用</h5>
                            <p>多个技能可以组合使用：</p>
                            <pre class="code-block">你：先搜索Python教程网站，然后访问第一个结果，最后提取主要内容</pre>

                            <h5>查看技能帮助</h5>
                            <pre class="code-block"># 查看特定技能的帮助
openclaw skills help read_file

# 列出所有技能
openclaw skills list --all</pre>
                        `
                    },
                    {
                        title: '技能管理',
                        content: `
                            <h5>更新技能</h5>
                            <pre class="code-block"># 更新特定技能
openclaw skills update read_file

# 更新所有已安装技能
openclaw skills update-all</pre>

                            <h5>卸载技能</h5>
                            <pre class="code-block"># 卸载技能
openclaw skills uninstall read_file</pre>

                            <h5>禁用/启用技能</h5>
                            <pre class="code-block"># 禁用技能（不卸载）
openclaw skills disable read_file

# 启用技能
openclaw skills enable read_file</pre>

                            <h5>查看技能状态</h5>
                            <pre class="code-block"># 查看技能详细信息
openclaw skills info read_file</pre>

                            <div class="tips-box">
                                <h4>💡 技能使用技巧</h4>
                                <ul>
                                    <li>定期更新技能以获得最新功能和安全修复</li>
                                    <li>只启用需要使用的技能，减少安全风险</li>
                                    <li>查看技能的权限要求，避免过度授权</li>
                                    <li>在使用新技能前，先在测试环境验证</li>
                                </ul>
                            </div>
                        `
                    }
                ]
            },
            'beginner-prompt': {
                title: '提示词工程',
                icon: '💬',
                description: '掌握编写有效提示词的技巧',
                sections: [
                    {
                        title: '提示词基础',
                        content: `
                            <h5>什么是提示词（Prompt）</h5>
                            <p>提示词是你输入给AI的指令或问题，好的提示词能获得更好的回答质量。</p>

                            <h5>提示词的基本结构</h5>
                            <div class="prompt-structure">
                                <pre class="code-block">┌─────────────────────────────────────┐
│  [角色设定]                            │
│  你是一个专业的软件工程师...           │
│                                       │
│  [任务描述]                            │
│  请帮我...                             │
│                                       │
│  [上下文信息]                          │
│  背景是...                             │
│                                       │
│  [输出要求]                            │
│  请以...格式输出                        │
│                                       │
│  [约束条件]                            │
│  注意...                               │
└─────────────────────────────────────┘</pre>
                            </div>

                            <h5>5个关键要素</h5>
                            <ol class="tutorial-steps">
                                <li><strong>明确目标：</strong>清楚说明你想要什么</li>
                                <li><strong>提供背景：</strong>给出足够的上下文信息</li>
                                <li><strong>设定角色：</strong>告诉AI它是什么角色</li>
                                <li><strong>格式要求：</strong>指定输出格式</li>
                                <li><strong>约束条件：</strong>说明限制和注意事项</li>
                            </ol>
                        `
                    },
                    {
                        title: '常用技巧',
                        content: `
                            <h5>技巧1：角色扮演法</h5>
                            <p>给AI设定一个特定角色，提高专业性</p>
                            <pre class="code-block">❌ 一般提问：
"帮我写一段代码"

✓ 角色扮演：
"你是一位资深Python开发工程师，请帮我写一个计算斐波那契数列的函数，要求：
1. 使用递归实现
2. 包含错误处理
3. 添加文档注释"</pre>

                            <h5>技巧2：思维链（Chain of Thought）</h5>
                            <p>引导AI逐步思考</p>
                            <pre class="code-block">✓ 使用思维链：
"请一步步分析这个问题：
1. 首先，理解问题的核心...
2. 然后，考虑可能的解决方案...
3. 最后，选择最优方案并解释原因..."</pre>

                            <h5>技巧3：少样本学习（Few-Shot）</h5>
                            <p>提供示例让AI学习期望的格式</p>
                            <pre class="code-block">✓ 提供示例：
"请按以下格式输出：
用户：张三
年龄：28
城市：北京

用户：李四
年龄：32
城市：上海

现在请输出：王五，25岁，来自深圳"</pre>

                            <h5>技巧4：约束输出</h5>
                            <p>明确限制和格式要求</p>
                            <pre class="code-block">✓ 添加约束：
"请用简体中文回答，不超过200字，使用列表格式。"</pre>

                            <h5>技巧5：迭代优化</h5>
                            <p>通过多轮对话逐步优化结果</p>
                            <pre class="code-block">第1轮：帮我写个Python脚本
第2轮：请添加错误处理
第3轮：请添加日志输出
第4轮：请优化代码性能</pre>
                        `
                    },
                    {
                        title: '最佳实践',
                        content: `
                            <h5>DO - 应该做的</h5>
                            <div class="do-dont">
                                <div class="do">
                                    <h4>✓ DO</h4>
                                    <ul>
                                        <li>具体明确地描述需求</li>
                                        <li>提供充分的上下文</li>
                                        <li>设定清晰的角色和任务</li>
                                        <li>说明输出格式和要求</li>
                                        <li>逐步分解复杂任务</li>
                                        <li>给出具体示例</li>
                                        <li>提供反馈和修正</li>
                                    </ul>
                                </div>
                                <div class="dont">
                                    <h4>✗ DON'T</h4>
                                    <ul>
                                        <li>模糊不清的指令</li>
                                        <li>缺少上下文信息</li>
                                        <li>过多的专业术语堆砌</li>
                                        <li>相互矛盾的要求</li>
                                        <li>一次性要求太多内容</li>
                                        <li>假设AI知道所有背景</li>
                                    </ul>
                                </div>
                            </div>

                            <h5>场景化提示词模板</h5>
                            <div class="prompt-templates">
                                <div class="template-card">
                                    <h4>📝 写作类任务</h4>
                                    <pre class="code-block">请以[角色]的身份，写一篇关于[主题]的[文章类型]。
目标读者：[读者群体]
语气风格：[正式/轻松/专业]
篇幅：[字数要求]
关键点：[要点1、要点2、要点3]</pre>
                                </div>
                                <div class="template-card">
                                    <h4>💻 编程类任务</h4>
                                    <pre class="code-block">请用[编程语言]编写[功能描述]。
要求：
1. 功能完整，可直接运行
2. 包含错误处理
3. 添加代码注释
4. 符合[编码规范]
5. 提供[测试示例]</pre>
                                </div>
                                <div class="template-card">
                                    <h4>🔍 分析类任务</h4>
                                    <pre class="code-block">请分析[分析对象]，从[角度1]和[角度2]进行。
要求：
1. 列出关键要点
2. 提供数据支持
3. 给出可行建议
4. 使用[特定格式]输出</pre>
                                </div>
                            </div>
                        `
                    },
                    {
                        title: '实例演示',
                        content: `
                            <h5>案例1：代码审查请求</h5>
                            <div class="prompt-comparison">
                                <div class="before">
                                    <h4>❌ 优化前</h4>
                                    <pre class="code-block">帮我看看这段代码有什么问题</pre>
                                </div>
                                <div class="after">
                                    <h4>✓ 优化后</h4>
                                    <pre class="code-block">你是一位资深代码审查专家。请审查以下Python代码，重点关注：
1. 潜在的bug和错误
2. 代码风格和可读性
3. 性能优化空间
4. 安全漏洞
5. 最佳实践建议

代码：
[粘贴代码]

请以列表形式输出审查结果，并给出修改建议。</pre>
                                </div>
                            </div>

                            <h5>案例2：学习计划制定</h5>
                            <div class="prompt-comparison">
                                <div class="before">
                                    <h4>❌ 优化前</h4>
                                    <pre class="code-block">我想学Python</pre>
                                </div>
                                <div class="after">
                                    <h4>✓ 优化后</h4>
                                    <pre class="code-block">我想学习Python编程，有Java基础。请帮我制定一个4周的学习计划，包括：

第1周：[学习重点]
第2周：[学习重点]
第3周：[学习重点]
第4周：[实践项目]

每周请包含：
- 学习资源推荐（书籍/视频/文档）
- 练习题
- 实战小项目
- 预计学习时间

重点目标：[具体目标]</pre>
                                </div>
                            </div>

                            <h5>案例3：文档撰写</h5>
                            <div class="prompt-comparison">
                                <div class="before">
                                    <h4>❌ 优化前</h4>
                                    <pre class="code-block">写个API文档</pre>
                                </div>
                                <div class="after">
                                    <h4>✓ 优化后</h4>
                                    <pre class="code-block">请为以下REST API编写用户文档：

API端点：GET /api/users/{id}

功能描述：根据用户ID获取用户信息

请求参数：
- id (必填): 用户ID，整数类型

响应格式：
- 成功：200 OK，返回用户对象
- 失败：404 Not Found，返回错误信息

请使用以下格式：
## 接口描述
## 请求参数
## 响应示例
## 错误处理
## 使用示例</pre>
                                </div>
                            </div>
                        `
                    },
                    {
                        title: '高级技巧',
                        content: `
                            <h5>温度参数调整</h5>
                            <p>温度（Temperature）控制AI输出的随机性：</p>
                            <ul>
                                <li><strong>低温度（0.1-0.3）：</strong>输出更确定，适合事实性任务</li>
                                <li><strong>中温度（0.4-0.7）：</strong>平衡创造性和准确性</li>
                                <li><strong>高温度（0.8-1.0）：</strong>更有创意，适合创作任务</li>
                            </ul>

                            <h5>思维链提示（CoT）</h5>
                            <pre class="code-block">✓ 使用思维链：
"请一步步思考这个问题：
问题：[问题描述]

让我们分析：
步骤1：[第一步]
步骤2：[第二步]
...

基于以上分析，我的结论是..."</pre>

                            <h5>上下文管理</h5>
                            <p>对于长对话，及时总结上下文：</p>
                            <pre class="code-block">✓ 中途总结：
"到目前为止，我们讨论了：
1. [要点1]
2. [要点2]
3. [要点3]

接下来，让我们讨论..."</pre>

                            <h5>提示词注入防护</h5>
                            <div class="security-tip">
                                <h4>🔒 安全提示</h4>
                                <p>避免在提示词中包含敏感信息：</p>
                                <pre class="code-block">❌ 危险：
"我的密码是admin123，帮我..."

✓ 安全：
"我的密码格式是[描述格式]，请帮我在系统中修改密码..."</pre>
                            </div>
                        `
                    }
                ]
            },
            'beginner-troubleshooting': {
                title: '常见问题解决',
                icon: '🔧',
                description: '新手常遇到的问题及解决方法',
                sections: [
                    {
                        title: '安装相关问题',
                        content: `
                            <h5>问题1：安装失败</h5>
                            <pre class="code-block">错误：ERROR: Could not find a version that satisfies the requirement</pre>
                            <p><strong>可能原因：</strong></p>
                            <ul>
                                <li>Python版本过低（需要3.10+）</li>
                                <li>网络连接问题</li>
                                <li>pip版本过旧</li>
                            </ul>
                            <p><strong>解决方案：</strong></p>
                            <pre class="code-block"># 升级pip
python -m pip install --upgrade pip

# 使用国内镜像
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple openclaw</pre>

                            <h5>问题2：依赖冲突</h5>
                            <pre class="code-block">错误：ERROR: pip's dependency resolver does not currently take into account all the packages that are installed</pre>
                            <p><strong>解决方案：</strong></p>
                            <pre class="code-block"># 创建虚拟环境
python -m venv openclaw-env
source openclaw-env/bin/activate  # Linux/Mac
# 或
openclaw-env\\Scripts\\activate  # Windows

# 在虚拟环境中安装
pip install openclaw</pre>

                            <h5>问题3：权限错误</h5>
                            <pre class="code-block">错误：Permission denied</pre>
                            <p><strong>解决方案：</strong></p>
                            <pre class="code-block"># 使用用户安装
pip install --user openclaw</pre>
                        `
                    },
                    {
                        title: '配置相关问题',
                        content: `
                            <h5>问题1：API密钥无效</h5>
                            <pre class="code-block">错误：Error: Invalid API key</pre>
                            <p><strong>检查清单：</strong></p>
                            <ul>
                                <li>API密钥是否正确复制</li>
                                <li>密钥是否已激活</li>
                                <li>账户是否有足够余额</li>
                                <li>网络是否正常</li>
                            </ul>
                            <p><strong>测试API密钥：</strong></p>
                            <pre class="code-block"># macOS/Linux
export ANTHROPIC_API_KEY="your-key"
curl https://api.anthropic.com/v1/messages \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -d @- << EOF
{
  "model": "claude-3-5-sonnet-20241022",
  "max_tokens": 100,
  "messages": [{"role": "user", "content": "Hello"}]
}
EOF</pre>

                            <h5>问题2：配置文件不生效</h5>
                            <p><strong>检查步骤：</strong></p>
                            <ol>
                                <li>确认配置文件路径正确</li>
                                <li>检查YAML语法是否正确</li>
                                <li>确认没有tab字符（应使用空格）</li>
                            </ol>
                            <pre class="code-block"># 验证YAML语法
python -c "import yaml; yaml.safe_load(open('~/.openclaw/config.yaml'))"</pre>

                            <h5>问题3：端口被占用</h5>
                            <pre class="code-block">错误：Error: Port 18789 is already in use</pre>
                            <p><strong>解决方案：</strong></p>
                            <pre class="code-block"># 查找占用端口的进程
# Linux/macOS
lsof -i :18789

# Windows
netstat -ano | findstr :18789

# 杀死进程
kill -9 [PID]

# 或修改配置使用其他端口</pre>
                        `
                    },
                    {
                        title: '运行相关问题',
                        content: `
                            <h5>问题1：服务无法启动</h5>
                            <div class="troubleshooting-flow">
                                <p><strong>诊断流程：</strong></p>
                                <ol>
                                    <li>查看日志文件：~/.openclaw/logs/openclaw.log</li>
                                    <li>检查配置文件语法</li>
                                    <li>验证API密钥</li>
                                    <li>检查端口占用</li>
                                </ol>
                                <pre class="code-block"># 查看详细日志
openclaw start --verbose</pre>
                            </div>

                            <h5>问题2：AI无响应</h5>
                            <p><strong>可能原因：</strong></p>
                            <ul>
                                <li>API密钥配置错误</li>
                                <li>网络连接问题</li>
                                <li>API服务不可用</li>
                                <li>请求超时</li>
                            </ul>
                            <p><strong>解决步骤：</strong></p>
                            <ol class="tutorial-steps">
                                <li>检查网络连接：ping api.anthropic.com</li>
                                <li>验证API密钥有效性</li>
                                <li>检查账户余额和配额</li>
                                <li>调整超时设置</li>
                            </ol>

                            <h5>问题3：技能无法使用</h5>
                            <pre class="code-block">错误：Skill 'xxx' not found</pre>
                            <p><strong>解决方案：</strong></p>
                            <pre class="code-block"># 列出可用技能
openclaw skills list

# 重新安装技能
openclaw skills reinstall skill_name

# 检查技能状态
openclaw skills status skill_name</pre>
                        `
                    },
                    {
                        title: '性能优化',
                        content: `
                            <h5>提升响应速度</h5>
                            <ul>
                                <li><strong>使用更快的模型：</strong>如claude-3-5-haiku</li>
                                <li><strong>减少上下文长度：</strong>定期清理对话历史</li>
                                <li><strong>简化提示词：</strong>避免冗长描述</li>
                                <li><strong>启用缓存：</strong>配置响应缓存</li>
                            </ul>

                            <h5>降低API成本</h5>
                            <ul>
                                <li><strong>选择合适的模型：</strong>简单任务使用小模型</li>
                                <li><strong>设置Token限制：</strong>配置max_tokens参数</li>
                                <li><strong>批处理请求：</strong>合并多个小请求</li>
                                <li><strong>使用流式响应：</strong>减少等待时间</li>
                            </ul>

                            <h5>系统资源优化</h5>
                            <pre class="code-block"># 限制内存使用
openclaw config set memory.max 4GB

# 设置并发限制
openclaw config set concurrency.max 3

# 启用日志轮转
openclaw config set logging.rotate true</pre>

                            <h5>定期维护</h5>
                            <div class="maintenance-tasks">
                                <h4>定期维护清单</h4>
                                <ul class="checklist-items">
                                    <li><input type="checkbox"> 清理日志文件</li>
                                    <li><input type="checkbox"> 清理对话历史</li>
                                    <li><input type="checkbox"> 更新OpenClaw版本</li>
                                    <li><input type="checkbox"> 审查已安装技能</li>
                                    <li><input type="checkbox"> 检查API使用量</li>
                                    <li><input type="checkbox"> 备份配置文件</li>
                                </ul>
                            </div>
                        `
                    }
                ]
            }
        };

        // 显示教程详情
        function showTutorialDetail(tutorialId) {
            const tutorial = tutorialDetails[tutorialId];
            if (!tutorial) return;

            const modal = document.getElementById('tutorialModal');
            const modalTitle = document.getElementById('tutorialModalTitle');
            const modalBody = document.getElementById('tutorialModalBody');

            modalTitle.innerHTML = `<span style="font-size: 28px; margin-right: 12px;">${tutorial.icon}</span>${tutorial.title}`;

            let sectionsHtml = '';
            tutorial.sections.forEach((section, index) => {
                sectionsHtml += `
                    <div class="tutorial-section">
                        <h3 class="tutorial-section-title">${section.title}</h3>
                        <div class="tutorial-section-content">
                            ${section.content}
                        </div>
                    </div>
                `;
            });

            modalBody.innerHTML = `
                <div class="tutorial-detail">
                    <p class="tutorial-description">${tutorial.description}</p>
                    <div class="tutorial-sections">
                        ${sectionsHtml}
                    </div>
                </div>
            `;

            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        // 关闭教程模态框
        function closeTutorialModal() {
            const modal = document.getElementById('tutorialModal');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // ESC键关闭所有模态框
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeVulnModal();
                closeTutorialModal();
            }
        });
    </script> 