import React from 'react';
import { message, Spin } from 'antd';

import Menus from "./menus";
import ContentPanel from "./content-panel";
import {isEmpty} from "./util/utils";
import DocsLayout from "./docs-layout";

function Loading () {
    return <div style={{height: "100vh", background: "#f0f2f5", textAlign: "center", padding: "50px"}}>
        <Spin tip="Loading..." />
    </div>
}

class _Main extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            documents: [],
        };
    }

    componentDidMount() {
        this.loadDocuments(this.props["path"]);
    }

    render() {
        const {loaded, documents} = this.state;
        const footer = this.props["footer"];
        if (loaded) {
            const sidebar = <Menus documents={documents} />;
                    return (<DocsLayout sidebar={sidebar}
                              content={<ContentPanel documents={documents}/>}
                              footer={footer}
                              >
          </DocsLayout>);
        } else {
            return <Loading />;
        }

    }

    loadDocuments (path) {
        this.getDocsMenuData(path)
        .then(data => {
            console.log("data: ", data);
            if (data) {
                this.setState({documents: data, loaded: true});
            } else {
                this.setState({documents: [], loaded: true});
            }
            return data;
        }).catch(e=>message.error(e.message || e));
    }

    async getDocsMenuData(path) {
        if (isEmpty(path)) {
            path = "/document.manifest.json";
      }
      const response = await fetch(path);
      return response.json();
    }
}

export default _Main;
