import React from 'react';
import { Layout, } from 'antd';

const { Content, Footer, Sider } = Layout;


class _DocsLayout extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
        collapsed: false,
    };
    }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  }

  render() {
    const {sidebar, content, footer} = this.props;
    let footerPanel = "";
    if (footer) {
            footerPanel = <Footer style={{ textAlign: 'center' }}>{footer}</Footer>;
    }
    return (
      <Layout style={{ minHeight: '100vh',  background: '#fff' }}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} style={{ background: '#fff' }}>
          {sidebar}
        </Sider>

        <Layout style={{ minHeight: '100vh',  }}>
          <Content style={{ margin: '0 16px' }}>
           {content}
          </Content>
          {footerPanel}
        </Layout>
      </Layout>
    );
  }
}

export default _DocsLayout;