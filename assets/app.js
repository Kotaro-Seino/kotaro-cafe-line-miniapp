(function () {
  const config = window.APP_CONFIG;
  const content = window.APP_CONTENT;
  const storageKey = "line-miniapp-starter-member";

  const state = {
    isInClient: false,
    isLoggedIn: false,
    hasMember: false,
    profile: null,
    liffReady: false
  };

  const elements = {
    title: document.getElementById("app-title"),
    eyebrow: document.getElementById("eyebrow"),
    description: document.getElementById("hero-description"),
    statusStack: document.getElementById("status-stack"),
    primaryAction: document.getElementById("primary-action"),
    profileSummary: document.getElementById("profile-summary"),
    environmentPill: document.getElementById("environment-pill"),
    memberTierPill: document.getElementById("member-tier-pill"),
    memberCardVisual: document.getElementById("member-card-visual"),
    memberFacts: document.getElementById("member-facts"),
    benefitList: document.getElementById("benefit-list"),
    loginButton: document.getElementById("login-button"),
    memberButton: document.getElementById("member-button"),
    flowList: document.getElementById("flow-list"),
    actionGrid: document.getElementById("action-grid"),
    noticeList: document.getElementById("notice-list"),
    memberDialog: document.getElementById("member-dialog"),
    memberForm: document.getElementById("member-form"),
    memberCopy: document.getElementById("member-copy"),
    closeDialog: document.getElementById("close-dialog"),
    skipMember: document.getElementById("skip-member")
  };

  function applyBranding() {
    const root = document.documentElement;
    root.style.setProperty("--accent", config.branding.accent);
    root.style.setProperty("--accent-strong", config.branding.accentStrong);
    root.style.setProperty("--accent-soft", config.branding.accentSoft);
    root.style.setProperty("--surface-tint", config.branding.surfaceTint);
    root.style.setProperty("--text-strong", config.branding.textStrong);
    root.style.setProperty("--text-muted", config.branding.textMuted);
  }

  function renderStaticContent() {
    elements.title.textContent = config.app.name;
    elements.eyebrow.textContent = config.app.eyebrow;
    elements.description.textContent = config.app.description;
    elements.primaryAction.textContent = config.app.primaryActionLabel;
    elements.memberCopy.textContent = content.memberPrompt;
    elements.memberTierPill.textContent = content.memberCard.tier;

    elements.flowList.innerHTML = content.flow
      .map(function (item) {
        return [
          '<li class="flow-item">',
          '<strong>' + escapeHtml(item.title) + '</strong>',
          '<p>' + escapeHtml(item.description) + '</p>',
          '</li>'
        ].join('');
      })
      .join('');

    elements.actionGrid.innerHTML = content.actions
      .map(function (item) {
        return [
          '<a class="action-card menu-card" href="' + escapeAttribute(item.href) + '">',
          '<div class="menu-card-image-wrap">',
          '<img class="menu-card-image" src="' + escapeAttribute(item.imageUrl) + '" alt="' + escapeAttribute(item.title) + '" loading="lazy">',
          '</div>',
          '<div class="menu-card-body">',
          '<div class="menu-card-top">',
          '<span class="tag">' + escapeHtml(item.tag) + '</span>',
          '<span class="menu-price">' + escapeHtml(item.price) + '</span>',
          '</div>',
          '<strong>' + escapeHtml(item.title) + '</strong>',
          '<p>' + escapeHtml(item.description) + '</p>',
          '<span class="card-link">開く</span>',
          '</div>',
          '</a>'
        ].join('');
      })
      .join('');

    elements.noticeList.innerHTML = content.notices
      .map(function (item) {
        return '<li>' + escapeHtml(item) + '</li>';
      })
      .join('');

    elements.benefitList.innerHTML = content.benefits
      .map(function (item) {
        return '<li>' + escapeHtml(item) + '</li>';
      })
      .join('');
  }

  function readMemberState() {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        return null;
      }

      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }

  function saveMemberState(memberState) {
    window.localStorage.setItem(storageKey, JSON.stringify(memberState));
    state.hasMember = true;
  }

  function updateStateFromStorage() {
    const memberState = readMemberState();
    state.hasMember = Boolean(memberState && memberState.memberId);
  }

  function getEnvironmentLabel() {
    if (state.isInClient) {
      return 'LINE内ブラウザ';
    }

    if (config.liff.simulateLineEnvironment) {
      return '確認モード';
    }

    return '外部ブラウザ';
  }

  function getDisplayName() {
    return state.profile && state.profile.displayName
      ? state.profile.displayName
      : config.liff.mockProfileName;
  }

  function getPictureUrl() {
    return state.profile && state.profile.pictureUrl
      ? state.profile.pictureUrl
      : '';
  }

  function getMemberStateForDisplay() {
    const saved = readMemberState();

    return {
      memberId: saved && saved.memberId ? saved.memberId : '0000 0000 0000',
      memberPhone: saved && saved.memberPhone ? saved.memberPhone : '0000',
      joinedLabel: saved && saved.updatedAt ? formatDate(saved.updatedAt) : '未連携',
      tier: content.memberCard.tier,
      pointLabel: content.memberCard.pointLabel,
      pointValue: state.hasMember ? content.memberCard.pointValue : '--',
      expiryLabel: content.memberCard.expiryLabel,
      expiryValue: state.hasMember ? content.memberCard.expiryValue : '--.--.--'
    };
  }

  function buildStatusItems() {
    return [
      {
        label: '起動環境',
        value: getEnvironmentLabel(),
        tone: state.isInClient || config.liff.simulateLineEnvironment ? 'good' : 'neutral'
      },
      {
        label: 'LINEログイン',
        value: state.isLoggedIn ? '確認済み' : '未確認',
        tone: state.isLoggedIn ? 'good' : (config.app.loginRequired ? 'warn' : 'neutral')
      },
      {
        label: '会員状態',
        value: state.hasMember ? '会員証表示中' : '未連携',
        tone: state.hasMember ? 'good' : (config.app.memberAuthRequired ? 'warn' : 'neutral')
      }
    ];
  }

  function renderStatus() {
    const items = buildStatusItems();
    elements.statusStack.innerHTML = items
      .map(function (item) {
        return [
          '<div class="status-pill tone-' + item.tone + '">',
          '<span>' + escapeHtml(item.label) + '</span>',
          '<strong>' + escapeHtml(item.value) + '</strong>',
          '</div>'
        ].join('');
      })
      .join('');

    elements.environmentPill.textContent = getEnvironmentLabel();
  }

  function renderProfile() {
    const memberState = getMemberStateForDisplay();
    const displayName = getDisplayName();
    const pictureUrl = getPictureUrl();

    const summaryItems = [
      {
        label: '表示名',
        value: displayName
      },
      {
        label: 'ログイン状態',
        value: state.isLoggedIn ? 'LINE認証済み' : '未ログイン'
      },
      {
        label: '会員番号',
        value: memberState.memberId
      }
    ];

    elements.profileSummary.innerHTML = [
      '<div class="profile-head">',
      pictureUrl
        ? '<img class="avatar" src="' + escapeAttribute(pictureUrl) + '" alt="プロフィール画像">'
        : '<div class="avatar avatar-fallback">' + escapeHtml(displayName.slice(0, 1)) + '</div>',
      '<div>',
      '<strong>' + escapeHtml(displayName) + '</strong>',
      '<p>' + escapeHtml(state.isLoggedIn ? '会員証に表示するプロフィールを確認しました。' : config.support.loginHelpText) + '</p>',
      '</div>',
      '</div>',
      '<dl class="profile-meta">',
      summaryItems
        .map(function (item) {
          return '<div><dt>' + escapeHtml(item.label) + '</dt><dd>' + escapeHtml(item.value) + '</dd></div>';
        })
        .join(''),
      '</dl>'
    ].join('');

    elements.loginButton.textContent = state.isLoggedIn ? 'ログイン状態を再確認' : 'LINEでログイン';
    elements.memberButton.textContent = state.hasMember ? '会員証情報を更新' : '会員情報を確認';
  }

  function renderMemberCard() {
    const memberState = getMemberStateForDisplay();
    const displayName = getDisplayName();
    const memberDigits = memberState.memberId.replace(/\s+/g, '');
    const maskedPhone = '****' + memberState.memberPhone;

    elements.memberCardVisual.innerHTML = [
      '<div class="member-card-shell" id="member-card">',
      '<div class="member-card-top">',
      '<div>',
      '<p class="member-brand">' + escapeHtml(content.memberCard.brandLabel) + '</p>',
      '<strong class="member-name">' + escapeHtml(displayName) + '</strong>',
      '</div>',
      '<span class="member-chip">' + escapeHtml(memberState.tier) + '</span>',
      '</div>',
      '<div class="member-card-number-label">Member No.</div>',
      '<div class="member-card-number">' + escapeHtml(memberState.memberId) + '</div>',
      '<div class="member-barcode" aria-hidden="true">' + buildBarcodeBars(memberDigits) + '</div>',
      '<div class="member-barcode-digits">' + escapeHtml(memberDigits) + '</div>',
      '<div class="member-card-footer">',
      '<span>' + escapeHtml(content.memberCard.barcodeHint) + '</span>',
      '<span>' + escapeHtml(maskedPhone) + '</span>',
      '</div>',
      '</div>'
    ].join('');

    elements.memberFacts.innerHTML = [
      '<div class="fact-card">',
      '<span>' + escapeHtml(memberState.pointLabel) + '</span>',
      '<strong>' + escapeHtml(memberState.pointValue) + '</strong>',
      '</div>',
      '<div class="fact-card">',
      '<span>' + escapeHtml(memberState.expiryLabel) + '</span>',
      '<strong>' + escapeHtml(memberState.expiryValue) + '</strong>',
      '</div>',
      '<div class="fact-card">',
      '<span>会員連携日</span>',
      '<strong>' + escapeHtml(memberState.joinedLabel) + '</strong>',
      '</div>'
    ].join('');
  }

  function buildBarcodeBars(seed) {
    return seed
      .split('')
      .map(function (char, index) {
        const width = Number(char || 0) % 4 + 1;
        const tall = index % 2 === 0 ? ' tall' : '';
        return '<span class="bar w-' + width + tall + '"></span>';
      })
      .join('');
  }

  function updatePrimaryAction() {
    elements.primaryAction.onclick = function () {
      if (config.app.loginRequired && !state.isLoggedIn) {
        handleLogin();
        return;
      }

      if (config.app.memberAuthRequired && !state.hasMember) {
        openMemberDialog();
        return;
      }

      if (config.app.primaryActionUrl.startsWith('#')) {
        window.location.hash = config.app.primaryActionUrl.slice(1);
        const target = document.querySelector(config.app.primaryActionUrl);
        if (target && typeof target.scrollIntoView === 'function') {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
      }

      window.location.href = config.app.primaryActionUrl;
    };
  }

  function openMemberDialog() {
    if (typeof elements.memberDialog.showModal === 'function') {
      elements.memberDialog.showModal();
    }
  }

  function closeMemberDialog() {
    elements.memberDialog.close();
  }

  function handleLogin() {
    if (!window.liff || !config.liff.liffId) {
      window.alert('LIFF ID を設定すると、LINEログインの実動作を確認できます。');
      return;
    }

    if (!state.liffReady) {
      window.alert('LIFFの初期化が完了してから再度お試しください。');
      return;
    }

    if (!state.isLoggedIn) {
      window.liff.login({ redirectUri: window.location.href });
      return;
    }

    syncLiffState();
  }

  async function syncLiffState() {
    if (!window.liff || !state.liffReady) {
      renderAll();
      return;
    }

    try {
      state.isLoggedIn = window.liff.isLoggedIn();
      state.isInClient = window.liff.isInClient();

      if (state.isLoggedIn) {
        state.profile = await window.liff.getProfile();
      }
    } catch (error) {
      console.error(error);
    }

    renderAll();
  }

  async function initializeLiff() {
    if (!window.liff || !config.liff.liffId) {
      renderAll();
      return;
    }

    try {
      await window.liff.init({ liffId: config.liff.liffId, withLoginOnExternalBrowser: false });
      state.liffReady = true;
      await syncLiffState();
    } catch (error) {
      console.error('LIFF init failed', error);
      renderAll();
    }
  }

  function bindEvents() {
    elements.loginButton.addEventListener('click', handleLogin);
    elements.memberButton.addEventListener('click', openMemberDialog);
    elements.closeDialog.addEventListener('click', closeMemberDialog);
    elements.skipMember.addEventListener('click', closeMemberDialog);
    elements.memberForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const formData = new FormData(elements.memberForm);
      const memberId = String(formData.get('memberId') || '').trim();
      const memberPhone = String(formData.get('memberPhone') || '').trim();

      if (!memberId || !memberPhone) {
        window.alert('会員番号と電話番号の下4桁を入力してください。');
        return;
      }

      saveMemberState({
        memberId: formatMemberId(memberId),
        memberPhone: memberPhone,
        updatedAt: new Date().toISOString()
      });

      closeMemberDialog();
      renderAll();
    });
  }

  function renderAll() {
    updateStateFromStorage();
    renderStatus();
    renderProfile();
    renderMemberCard();
    updatePrimaryAction();
  }

  function formatMemberId(value) {
    const digits = String(value).replace(/\D/g, '').slice(0, 12);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '未連携';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return year + '.' + month + '.' + day;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }

  applyBranding();
  renderStaticContent();
  bindEvents();
  renderAll();
  initializeLiff();
})();
