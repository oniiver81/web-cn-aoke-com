// public/site-helper.js
(function() {
  'use strict';

  // 配置信息
  const CONFIG = {
    siteUrl: 'https://web-cn-aoke.com',
    keyword: '澳客',
    version: '1.2.0',
    cookieName: 'site_helper_dismissed',
    tooltipDuration: 8000
  };

  // 提示卡片状态管理
  const state = {
    dismissed: false,
    timer: null
  };

  // 初始化
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setup);
    } else {
      setup();
    }
  }

  // 检查是否已关闭
  function isDismissed() {
    try {
      return document.cookie.split('; ').some(row => row.startsWith(CONFIG.cookieName + '=true'));
    } catch (e) {
      return false;
    }
  }

  // 标记已关闭
  function markDismissed() {
    const days = 7;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = CONFIG.cookieName + '=true; expires=' + expires + '; path=/; SameSite=Lax';
    state.dismissed = true;
  }

  // 创建提示卡片
  function createTooltip() {
    const card = document.createElement('div');
    card.id = 'site-helper-tooltip';
    card.style.cssText = [
      'position:fixed;bottom:20px;right:20px;z-index:9999',
      'background:#fff;border:1px solid #e0e0e0;border-radius:12px',
      'box-shadow:0 4px 20px rgba(0,0,0,0.12);padding:18px 22px',
      'max-width:320px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
      'font-size:14px;line-height:1.5;color:#333;transition:opacity 0.3s ease',
      'opacity:0;pointer-events:none'
    ].join(';');

    // 内容
    const content = document.createElement('div');
    content.innerHTML = [
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">',
      '<strong style="font-size:16px;color:#1a73e8">' + CONFIG.keyword + ' 提示</strong>',
      '<button id="site-helper-close" style="background:none;border:none;cursor:pointer;font-size:18px;color:#999;padding:0 4px" aria-label="关闭">&times;</button>',
      '</div>',
      '<p style="margin:0 0 8px">欢迎访问 <a href="' + CONFIG.siteUrl + '" target="_blank" rel="noopener noreferrer" style="color:#1a73e8;text-decoration:none">' + CONFIG.siteUrl + '</a></p>',
      '<p style="margin:0 0 10px">本站提供' + CONFIG.keyword + '相关信息与资源，请合理使用。</p>',
      '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">',
      '<span style="background:#e8f0fe;color:#1a73e8;padding:4px 10px;border-radius:16px;font-size:12px">' + CONFIG.keyword + '</span>',
      '<span style="background:#fce8e6;color:#d93025;padding:4px 10px;border-radius:16px;font-size:12px">指南</span>',
      '<span style="background:#e6f4ea;color:#137333;padding:4px 10px;border-radius:16px;font-size:12px">资源</span>',
      '</div>',
      '<p style="margin:10px 0 0;font-size:12px;color:#888">使用说明：点击链接可打开官方页面，右上角关闭此提示。</p>'
    ].join('');

    card.appendChild(content);
    document.body.appendChild(card);

    // 关闭按钮
    document.getElementById('site-helper-close').addEventListener('click', function() {
      hideTooltip();
      markDismissed();
    });

    // 显示动画
    requestAnimationFrame(function() {
      card.style.opacity = '1';
      card.style.pointerEvents = 'auto';
    });

    // 自动隐藏
    state.timer = setTimeout(function() {
      if (!state.dismissed) {
        hideTooltip();
      }
    }, CONFIG.tooltipDuration);

    return card;
  }

  // 隐藏提示
  function hideTooltip() {
    const card = document.getElementById('site-helper-tooltip');
    if (card) {
      card.style.opacity = '0';
      card.style.pointerEvents = 'none';
      setTimeout(function() {
        if (card.parentNode) card.parentNode.removeChild(card);
      }, 300);
    }
    if (state.timer) {
      clearTimeout(state.timer);
      state.timer = null;
    }
  }

  // 生成关键词徽章（备用功能）
  function createKeywordBadge(text, color) {
    const badge = document.createElement('span');
    badge.textContent = text;
    badge.style.cssText = [
      'display:inline-block;padding:3px 10px;border-radius:14px',
      'font-size:12px;font-weight:500;margin:2px 4px 2px 0',
      'background:' + (color || '#e8f0fe'),
      'color:' + (color ? '#fff' : '#1a73e8')
    ].join(';');
    return badge;
  }

  // 主设置
  function setup() {
    if (isDismissed()) return;

    // 延迟一小段时间再显示，避免干扰
    setTimeout(function() {
      createTooltip();
    }, 500);

    // 也可以附加一些关键词徽章到页面中（示例：在main或文章区域）
    const mainContent = document.querySelector('main, article, .content, [role="main"]');
    if (mainContent) {
      const badgeContainer = document.createElement('div');
      badgeContainer.style.cssText = 'margin:12px 0;display:flex;flex-wrap:wrap';
      badgeContainer.appendChild(createKeywordBadge(CONFIG.keyword, '#1a73e8'));
      badgeContainer.appendChild(createKeywordBadge('教程', '#d93025'));
      badgeContainer.appendChild(createKeywordBadge('更新', '#137333'));
      mainContent.insertBefore(badgeContainer, mainContent.firstChild);
    }
  }

  // 启动
  init();

})();