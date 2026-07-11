class DocsLayout {
  constructor(options) {
    this.sidebar = options.sidebar;
    this.content = options.content;
    this.footer = options.footer;
    this.title = options.title || "Asu Docs";
    this.collapsed = false;
    this.element = null;
  }

  render() {
    const layout = document.createElement('div');
    layout.className = 'asu-docs-layout';

    // Sidebar
    const sidebarEl = document.createElement('div');
    sidebarEl.className = 'asu-docs-sidebar';
    this.sidebarEl = sidebarEl;

    // Logo
    const logoEl = document.createElement('div');
    logoEl.className = 'asu-docs-logo';
    
    const logoIcon = document.createElement('div');
    logoIcon.className = 'asu-docs-logo-icon';
    logoIcon.innerHTML = '⚡'; // Vibrant tech icon

    const logoText = document.createElement('span');
    logoText.className = 'asu-docs-logo-text';
    logoText.textContent = this.title;

    logoEl.appendChild(logoIcon);
    logoEl.appendChild(logoText);
    sidebarEl.appendChild(logoEl);

    // Sidebar Menu Container
    const menuContainer = document.createElement('div');
    menuContainer.className = 'asu-docs-menu-container';
    if (this.sidebar && this.sidebar.element) {
      menuContainer.appendChild(this.sidebar.element);
    }
    sidebarEl.appendChild(menuContainer);

    // Toggle button at the bottom of sidebar
    const toggleEl = document.createElement('div');
    toggleEl.className = 'asu-docs-sidebar-toggle';
    toggleEl.innerHTML = '<span class="asu-docs-sidebar-toggle-icon">◀</span>';
    toggleEl.addEventListener('click', () => this.toggleSidebar());
    sidebarEl.appendChild(toggleEl);

    layout.appendChild(sidebarEl);

    // Main Panel
    const mainEl = document.createElement('div');
    mainEl.className = 'asu-docs-main';

    // Header (Theme controls)
    const headerEl = document.createElement('div');
    headerEl.className = 'asu-docs-header';
    const themeBtn = document.createElement('button');
    themeBtn.className = 'asu-docs-header-btn';
    themeBtn.title = 'Toggle Dark/Light Mode';
    themeBtn.innerHTML = '🌙';
    themeBtn.addEventListener('click', () => this.toggleTheme());
    headerEl.appendChild(themeBtn);
    mainEl.appendChild(headerEl);

    // Content area
    const contentContainer = document.createElement('div');
    contentContainer.className = 'asu-docs-content-container';
    contentContainer.style.flex = '1';
    contentContainer.style.display = 'flex';
    contentContainer.style.flexDirection = 'column';
    contentContainer.style.minHeight = '0';

    if (this.content && this.content.element) {
      contentContainer.appendChild(this.content.element);
    }
    mainEl.appendChild(contentContainer);

    // Footer
    if (this.footer) {
      const footerEl = document.createElement('div');
      footerEl.className = 'asu-docs-footer';
      footerEl.innerHTML = this.footer;
      mainEl.appendChild(footerEl);
    }

    layout.appendChild(mainEl);
    this.element = layout;
    return layout;
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
    const toggleIcon = this.sidebarEl.querySelector('.asu-docs-sidebar-toggle-icon');
    if (this.collapsed) {
      this.sidebarEl.classList.add('collapsed');
      if (toggleIcon) toggleIcon.textContent = '▶';
    } else {
      this.sidebarEl.classList.remove('collapsed');
      if (toggleIcon) toggleIcon.textContent = '◀';
    }
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    const themeBtn = this.element.querySelector('.asu-docs-header-btn');
    if (themeBtn) {
      themeBtn.innerHTML = newTheme === 'dark' ? '🌙' : '☀️';
    }
  }
}

export default DocsLayout;