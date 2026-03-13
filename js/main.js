// ==================== 工具函数 ====================
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ==================== 主题切换 ====================
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        $('.theme-toggle').addEventListener('click', () => this.toggle());
    }

    toggle() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        $('.sun-icon').style.display = theme === 'dark' ? 'none' : 'inline';
        $('.moon-icon').style.display = theme === 'dark' ? 'inline' : 'none';
    }
}

// ==================== 导航栏效果 ====================
class Navigation {
    constructor() {
        this.init();
    }

    init() {
        // 滚动时改变导航栏样式
        window.addEventListener('scroll', () => {
            const navbar = $('.navbar');
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(10, 14, 26, 0.95)';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 240, 255, 0.1)';
            } else {
                navbar.style.background = 'rgba(10, 14, 26, 0.8)';
                navbar.style.boxShadow = 'none';
            }
        });

        // 平滑滚动
        $$('.nav-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = $(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // 滚动时更新活动链接
        window.addEventListener('scroll', () => this.updateActiveLink());
    }

    updateActiveLink() {
        const sections = $$('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                $$('.nav-menu a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// ==================== 数字动画 ====================
class CounterAnimation {
    constructor() {
        this.init();
    }

    init() {
        const observers = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observers.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        $$('.stat-value').forEach(el => observers.observe(el));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
}

// ==================== 打字机效果 ====================
class Typewriter {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;
    }

    start() {
        this.type();
    }

    type() {
        if (this.index < this.text.length) {
            this.element.textContent += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(), this.speed);
        }
    }
}

// ==================== 终端效果 ====================
class TerminalEffect {
    constructor() {
        this.init();
    }

    init() {
        const terminalLines = $$('#terminal-content .terminal-line');
        let delay = 0;

        const observers = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    terminalLines.forEach((line, index) => {
                        setTimeout(() => {
                            line.style.opacity = '0';
                            line.style.transform = 'translateX(-10px)';
                            line.style.transition = 'all 0.3s ease';

                            setTimeout(() => {
                                line.style.opacity = '1';
                                line.style.transform = 'translateX(0)';
                            }, 50);
                        }, delay);
                        delay += 300;
                    });
                    observers.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observers.observe($('.terminal'));
    }
}

// ==================== 视差效果 ====================
class ParallaxEffect {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const heroContent = $('.hero-content');

            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
            }
        });
    }
}

// ==================== 鼠标跟随效果 ====================
class MouseFollow {
    constructor() {
        this.init();
    }

    init() {
        const gridBg = $('.grid-bg');

        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            gridBg.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
        });
    }
}

// ==================== 滚动显示动画 ====================
class ScrollReveal {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // 为所有卡片和元素添加观察
        const elements = [
            ...$$('.security-card'),
            ...$$('.tutorial-card'),
            ...$$('.timeline-item'),
            ...$$('.feature-box'),
            ...$$('.section-header')
        ];

        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(el);
        });

        // 添加 revealed 类的样式
        const style = document.createElement('style');
        style.textContent = `
            .revealed {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// ==================== 工具提示 ====================
class Tooltip {
    constructor() {
        this.init();
    }

    init() {
        const tooltipElements = $$('[data-tooltip]');

        tooltipElements.forEach(el => {
            el.addEventListener('mouseenter', (e) => this.show(e));
            el.addEventListener('mouseleave', () => this.hide());
        });
    }

    show(e) {
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = e.target.getAttribute('data-tooltip');
        tooltip.style.cssText = `
            position: fixed;
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            z-index: 10000;
            pointer-events: none;
            box-shadow: var(--shadow-md);
        `;

        document.body.appendChild(tooltip);

        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';

        this.tooltip = tooltip;
    }

    hide() {
        if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
        }
    }
}

// ==================== 搜索功能 ====================
class SearchFeature {
    constructor() {
        this.init();
    }

    init() {
        // 这里可以添加搜索功能
        // 目前作为占位符
    }
}

// ==================== 数据更新 ====================
class DataUpdater {
    constructor() {
        this.init();
    }

    init() {
        // 更新统计数据
        this.updateStats();
    }

    updateStats() {
        $$('.stat-value').forEach(el => {
            const randomValue = Math.floor(Math.random() * 50) + 10;
            el.setAttribute('data-count', randomValue);
        });
    }
}

// ==================== 页面加载动画 ====================
class PageLoader {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');

            // 页面加载完成后触发数字动画
            setTimeout(() => {
                new CounterAnimation();
            }, 500);
        });
    }
}

// ==================== 响应式菜单 ====================
class MobileMenu {
    constructor() {
        this.init();
    }

    init() {
        // 检查是否是移动设备
        if (window.innerWidth <= 768) {
            this.createMobileMenu();
        }

        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768 && !$('.mobile-menu-toggle')) {
                this.createMobileMenu();
            } else if (window.innerWidth > 768 && $('.mobile-menu-toggle')) {
                this.removeMobileMenu();
            }
        });
    }

    createMobileMenu() {
        const navbar = $('.navbar .container');

        // 创建菜单切换按钮
        const toggle = document.createElement('button');
        toggle.className = 'mobile-menu-toggle';
        toggle.innerHTML = '☰';
        toggle.style.cssText = `
            display: block;
            background: none;
            border: none;
            color: var(--text-primary);
            font-size: 24px;
            cursor: pointer;
        `;

        navbar.appendChild(toggle);

        // 移动菜单样式
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .nav-menu {
                    position: fixed;
                    top: 70px;
                    left: 0;
                    right: 0;
                    background: var(--bg-secondary);
                    flex-direction: column;
                    padding: 20px;
                    transform: translateX(-100%);
                    transition: transform 0.3s ease;
                }

                .nav-menu.active {
                    transform: translateX(0);
                }

                .mobile-menu-toggle {
                    display: block !important;
                }
            }
        `;
        document.head.appendChild(style);

        // 切换菜单
        toggle.addEventListener('click', () => {
            $('.nav-menu').classList.toggle('active');
        });

        // 点击链接后关闭菜单
        $$('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                $('.nav-menu').classList.remove('active');
            });
        });
    }

    removeMobileMenu() {
        const toggle = $('.mobile-menu-toggle');
        if (toggle) {
            toggle.remove();
        }
        $('.nav-menu').classList.remove('active');
    }
}

// ==================== 安全卡片交互 ====================
class SecurityCardInteraction {
    constructor() {
        this.init();
    }

    init() {
        $$('.security-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // 如果点击的是按钮，不触发卡片的点击效果
                if (e.target.classList.contains('btn-expand')) return;

                // 添加点击效果
                card.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 150);
            });
        });
    }
}

// 教程卡片交互由 HTML 中的 onclick 属性处理
// 不需要额外的事件监听器

// ==================== 性能监控 ====================
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // 页面加载性能
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
        });
    }
}

// ==================== 初始化所有功能 ====================
document.addEventListener('DOMContentLoaded', () => {
    // 初始化所有功能模块
    new ThemeManager();
    new Navigation();
    new TerminalEffect();
    new ParallaxEffect();
    new MouseFollow();
    new ScrollReveal();
    new PageLoader();
    new MobileMenu();
    new SecurityCardInteraction();
    // TutorialInteraction 由 HTML onclick 处理
    new DataUpdater();
    new PerformanceMonitor();

    // 控制台欢迎信息
    console.log('%c⚡ OpenClaw Security Center', 'font-size: 24px; font-weight: bold; color: #00f0ff;');
    console.log('%c欢迎访问OpenClaw安全中心！', 'font-size: 14px; color: #9ca3af;');
});

// ==================== 导出API（如果需要） ====================
window.OpenClawSecurity = {
    ThemeManager,
    Navigation,
    CardExpand,
    TerminalEffect,
    ParallaxEffect,
    MouseFollow,
    ScrollReveal
};
