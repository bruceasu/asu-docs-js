import customEvent from "./util/custom-event";
import { isEmptyArray, arrayUtils, getPageQuery, isEmpty } from './util/utils';

class ContentPanel {
  constructor(options) {
    this.documents = options.documents || [];
    this.element = null;
    this.panes = []; // array of { title, key, path, active }
    this.activeKey = null;

    this.init();
    customEvent.on("menu-doc-item-click", (e) => this.handleOpenDocEvent(e));
  }

  init() {
    this.element = document.createElement('div');
    this.element.className = 'asu-docs-content-container';
    this.element.style.display = 'flex';
    this.element.style.flexDirection = 'column';
    this.element.style.height = '100%';
    this.element.style.flex = '1';

    // Tabs Bar
    this.tabsContainer = document.createElement('div');
    this.tabsContainer.className = 'asu-docs-tabs-container';
    
    this.tabsEl = document.createElement('div');
    this.tabsEl.className = 'asu-docs-tabs';
    this.tabsContainer.appendChild(this.tabsEl);
    this.element.appendChild(this.tabsContainer);

    // Content Display Area
    this.contentEl = document.createElement('div');
    this.contentEl.className = 'asu-docs-content';
    this.element.appendChild(this.contentEl);

    // Initial Empty State
    this.render();

    // Check query string for docId to open on load
    const queries = getPageQuery();
    if (queries && !isEmpty(queries.docId)) {
      // Defer openDoc slightly to ensure everything is mounted
      setTimeout(() => {
        this.openDoc(queries.docId);
      }, 50);
    }
  }

  render() {
    // Clear tabs and content
    this.tabsEl.innerHTML = '';
    this.contentEl.innerHTML = '';

    if (this.panes.length === 0) {
      // Render welcome/empty state
      const emptyEl = document.createElement('div');
      emptyEl.className = 'asu-docs-empty-state';
      emptyEl.innerHTML = `
        <div class="asu-docs-empty-icon">⚡</div>
        <div class="asu-docs-empty-title">Welcome to Documentation</div>
        <div class="asu-docs-empty-desc">Select a topic from the sidebar menu to view details and start learning.</div>
      `;
      this.contentEl.appendChild(emptyEl);
      this.tabsContainer.style.display = 'none';
      return;
    }

    this.tabsContainer.style.display = 'flex';

    this.panes.forEach(pane => {
      // Render Tab
      const tabEl = document.createElement('div');
      tabEl.className = `asu-docs-tab ${pane.key === this.activeKey ? 'active' : ''}`;
      
      const titleEl = document.createElement('span');
      titleEl.className = 'asu-docs-tab-title';
      titleEl.textContent = pane.title;
      tabEl.appendChild(titleEl);

      const closeEl = document.createElement('span');
      closeEl.className = 'asu-docs-tab-close';
      closeEl.textContent = '✕';
      closeEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.removeTab(pane.key);
      });
      tabEl.appendChild(closeEl);

      tabEl.addEventListener('click', () => {
        this.setActiveTab(pane.key);
      });

      this.tabsEl.appendChild(tabEl);

      // Render Content pane (Iframe wrapper)
      const wrapperEl = document.createElement('div');
      wrapperEl.className = `asu-docs-iframe-wrapper ${pane.key === this.activeKey ? 'active' : ''}`;
      
      const iframe = document.createElement('iframe');
      iframe.className = 'asu-docs-iframe';
      iframe.src = pane.path;
      iframe.title = pane.title;
      
      wrapperEl.appendChild(iframe);
      this.contentEl.appendChild(wrapperEl);
    });
  }

  handleOpenDocEvent(event) {
    const { payload } = event;
    if (payload && payload.key) {
      this.openDoc(payload.key);
    }
  }

  openDoc(key) {
    const idx = arrayUtils.findIndexByKey(this.panes, "key", key);
    if (idx !== -1) {
      this.setActiveTab(key);
      return;
    }

    const doc = this.findDoc(key);
    if (doc) {
      this.panes.push({
        title: doc.title,
        key: key,
        path: doc.path
      });
      this.setActiveTab(key);
    } else {
      console.warn("Document not found for key: ", key);
    }
  }

  setActiveTab(key) {
    this.activeKey = key;
    this.render();
    
    // Sync URL without full page reload
    const url = new URL(window.location.href);
    url.searchParams.set('docId', key);
    window.history.replaceState({}, '', url);

    // Sync menu active state if we have standard custom events or direct references
    customEvent.fire("tab-changed", { key });
  }

  removeTab(targetKey) {
    let lastIndex = -1;
    this.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });

    this.panes = this.panes.filter(pane => pane.key !== targetKey);

    if (this.activeKey === targetKey) {
      if (this.panes.length > 0) {
        if (lastIndex >= 0 && lastIndex < this.panes.length) {
          this.activeKey = this.panes[lastIndex].key;
        } else {
          this.activeKey = this.panes[0].key;
        }
      } else {
        this.activeKey = null;
      }
    }

    this.render();

    if (this.activeKey) {
      this.setActiveTab(this.activeKey);
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete('docId');
      window.history.replaceState({}, '', url);
    }
  }

  findDoc(key) {
    if (isEmptyArray(this.documents)) return undefined;
    return this.findDocOfChildren(this.documents, key);
  }

  findDocOfChildren(documents, key) {
    for (let d of documents) {
      if (d.key == key) {
        return d;
      }
      if (!isEmptyArray(d.children)) {
        const found = this.findDocOfChildren(d.children, key);
        if (found) return found;
      }
    }
    return undefined;
  }
}

export default ContentPanel;