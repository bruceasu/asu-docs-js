import { isEmptyArray } from './util/utils';
import customEvent from "./util/custom-event";

class Menus {
  constructor(options) {
    this.documents = options.documents || [];
    this.element = null;
    this.init();
  }

  init() {
    this.element = document.createElement('ul');
    this.element.className = 'asu-docs-menu';
    this.renderMenus(this.documents, this.element);
  }

  getIcon(iconType) {
    if (!iconType) return '📄';
    const icons = {
      'pie-chart': '📊',
      'desktop': '🖥️',
      'user': '👤',
      'team': '👥',
      'file': '📄',
      'folder': '📁',
      'setting': '⚙️',
      'book': '📖',
      'link': '🔗'
    };
    return icons[iconType.toLowerCase()] || '📄';
  }

  renderMenus(items, parentElement) {
    if (!items) return;

    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'asu-docs-menu-item-wrap';

      const titleEl = document.createElement('a');
      titleEl.className = 'asu-docs-menu-title';
      titleEl.href = 'javascript:void(0);';

      // Icon
      const iconEl = document.createElement('span');
      iconEl.className = 'asu-docs-menu-icon';
      iconEl.textContent = this.getIcon(item.iconType);
      titleEl.appendChild(iconEl);

      // Label
      const labelEl = document.createElement('span');
      labelEl.className = 'asu-docs-menu-label';
      labelEl.textContent = item.title;
      labelEl.title = item.title;
      titleEl.appendChild(labelEl);

      const hasChildren = !isEmptyArray(item.children);

      if (hasChildren) {
        li.className += ' asu-docs-submenu';
        titleEl.setAttribute('data-key', item.key);
        
        // Arrow
        const arrowEl = document.createElement('span');
        arrowEl.className = 'asu-docs-submenu-arrow';
        arrowEl.textContent = '▶';
        titleEl.appendChild(arrowEl);

        li.appendChild(titleEl);

        const subUl = document.createElement('ul');
        subUl.className = 'asu-docs-submenu-children';
        this.renderMenus(item.children, subUl);
        li.appendChild(subUl);

        titleEl.addEventListener('click', (e) => {
          e.preventDefault();
          li.classList.toggle('open');
        });
      } else {
        titleEl.setAttribute('data-key', item.key);
        li.appendChild(titleEl);

        titleEl.addEventListener('click', (e) => {
          e.preventDefault();
          
          // Clear active class from all other menu titles
          const allActive = this.element.querySelectorAll('.asu-docs-menu-title.active');
          allActive.forEach(el => el.classList.remove('active'));
          titleEl.classList.add('active');

          this.handleClick(item, e);
        });
      }

      parentElement.appendChild(li);
    });
  }

  handleClick(item, domEvent) {
    customEvent.fire("menu-doc-item-click", {
      item: item,
      key: item.key,
      domEvent: domEvent
    });
  }

  // Helper method to set a menu item active externally
  setActiveItem(key) {
    const allTitles = this.element.querySelectorAll('.asu-docs-menu-title');
    allTitles.forEach(titleEl => {
      titleEl.classList.remove('active');
    });

    const targetEl = this.element.querySelector(`.asu-docs-menu-title[data-key="${key}"]`);
    if (targetEl) {
      targetEl.classList.add('active');
      // Also expand parent submenus if collapsed
      let parent = targetEl.closest('.asu-docs-submenu');
      while (parent) {
        parent.classList.add('open');
        parent = parent.parentElement.closest('.asu-docs-submenu');
      }
    }
  }
}

export default Menus;
