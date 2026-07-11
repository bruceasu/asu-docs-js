import Menus from "./menus";
import ContentPanel from "./content-panel";
import DocsLayout from "./docs-layout";
import { isEmpty } from "./util/utils";
import customEvent from "./util/custom-event";
import "./index.css"; // Bundled styling

class AsuDocs {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this.container) {
      this.container = document.body;
    }
    
    this.options = options;
    this.path = options.path || "/document.manifest.json";
    this.footer = options.footer || "";
    this.title = options.title || "Asu Docs";
    
    this.state = {
      loaded: false,
      documents: [],
    };

    this.layout = null;
    this.menus = null;
    this.contentPanel = null;

    this.init();
  }

  async init() {
    this.showLoading();
    try {
      const documents = await this.getDocsMenuData(this.path);
      this.state.documents = documents || [];
      this.state.loaded = true;
      this.hideLoading();
      this.render();
    } catch (error) {
      console.error("Failed to load documents manifest:", error);
      this.hideLoading();
      this.renderError(error);
    }
  }

  showLoading() {
    this.loaderOverlay = document.createElement('div');
    this.loaderOverlay.className = 'asu-docs-loader-overlay';
    this.loaderOverlay.innerHTML = '<div class="asu-docs-loader"></div>';
    this.container.appendChild(this.loaderOverlay);
  }

  hideLoading() {
    if (this.loaderOverlay && this.loaderOverlay.parentNode) {
      this.loaderOverlay.style.opacity = '0';
      setTimeout(() => {
        if (this.loaderOverlay && this.loaderOverlay.parentNode) {
          this.loaderOverlay.parentNode.removeChild(this.loaderOverlay);
        }
      }, 300);
    }
  }

  renderError(error) {
    this.container.innerHTML = `
      <div style="padding: 40px; text-align: center; color: #ef4444; font-family: sans-serif;">
        <h3>Failed to load documentation</h3>
        <p>${error.message || error}</p>
      </div>
    `;
  }

  render() {
    // Clear container
    this.container.innerHTML = '';

    // Initialize sidebar menus
    this.menus = new Menus({
      documents: this.state.documents
    });

    // Initialize content tab panel
    this.contentPanel = new ContentPanel({
      documents: this.state.documents
    });

    // Initialize main layout
    this.layout = new DocsLayout({
      sidebar: this.menus,
      content: this.contentPanel,
      footer: this.footer,
      title: this.title
    });

    // Append to container
    this.container.appendChild(this.layout.render());

    // Listen to tab changes to highlight sidebar menu items
    customEvent.on("tab-changed", (e) => {
      if (e.payload && e.payload.key) {
        this.menus.setActiveItem(e.payload.key);
      }
    });
  }

  async getDocsMenuData(path) {
    if (isEmpty(path)) {
      path = "/document.manifest.json";
    }
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}

export default AsuDocs;
export { AsuDocs };
