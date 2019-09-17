import React from 'react';
import { Tabs  } from 'antd';
import customEvent from "./util/custom-event";
import {isEmptyArray, arrayUtils, getViewPortHeight, getPageQuery, isEmpty,} from './util/utils';
const { TabPane } = Tabs;

class _ContentPanel extends React.PureComponent {

    constructor(props) {
        super(props);
        const queries = getPageQuery();
        if (queries.hasOwnProperty("docId")) {
          this.state = {
            docId: queries["docId"],
            activeKey: undefined,
            panes:[]
        };
        } else {
          this.state = {
            docId: undefined,
            activeKey: undefined,
            panes:[]
        };
        }
        
        this.loaded = false;
        customEvent.on("menu-doc-item-click", this.handleOpenDocEvent);
    }

    componentDidMount() {
      if (!isEmptyArray(this.props.documents)) {
        this.loaded = true;
        const {docId} = this.state;
        if (!isEmpty(docId)) {
          this.openDoc(docId);
        }
      }
    }
    
    componentDidUpdate() {
     
      if (!this.loaded && !isEmptyArray(this.props.documents)) {
        this.loaded = true;
        const {docId} = this.state;
        if (!isEmpty(docId)) {
          this.openDoc(docId);
        }
        
      }
    }

    render() {
        return (<Tabs
            onChange={this.onChange}
            activeKey={this.state.activeKey}
            hideAdd={true}
            onEdit={this.onEdit}
            type="editable-card"
          >
            {this.state.panes.map(pane => (
              <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
                {pane.content}
              </TabPane>
            ))}
          </Tabs>);
    }
    
    onChange = (activeKey) => {
        this.setState({ activeKey });
    }
    
    onEdit = (targetKey, action) => {
        // console.log("targetKey", targetKey);
        // console.log("action", action);
        this[action](targetKey);
    }


    add () {
        // const { panes } = this.state;
        // const activeKey = `newTab${this.newTabIndex++}`;
        // panes.push({ title: 'New Tab', content: 'Content of new Tab', key: activeKey });
        // this.setState({ panes, activeKey });
    }
    
    remove = (targetKey) => {
        let { activeKey } = this.state;
        let lastIndex = 0;
        this.state.panes.forEach((pane, i) => {
          if (pane.key === targetKey) {
            lastIndex = i - 1;
          }
        });
       
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        const closeCurrent = activeKey === targetKey
        if (closeCurrent) {
          if (panes.length) {
            if (0 <= lastIndex && lastIndex < panes.length) {
              activeKey = panes[lastIndex].key;
            } else {
              activeKey = panes[0].key;
            }
          } else {
            activeKey = undefined;
          }
        } 
        
        this.setState({ panes, activeKey });
      }

    handleOpenDocEvent = (event) => {
      const { 
            type,   // 事件类型 
            origin, // 绑定的源 scope 为 this 或用户指定的上下文，
            cancel, // 是否取消 
            payload
      } = event;
      const { item, key, keyPath, domEvent } = payload;
      // console.log("call handleOpenDocEvent", key)
      this.openDoc(key);
    }

    openDoc = (key) => {
      const { panes } = this.state;
      const idx = arrayUtils.findIndexByKey(panes, "key", key);
      if (idx !== -1) {
          this.setState({ activeKey:key });
          return;
      }
      const doc = this.findDoc(key);
      if (doc) {
          const height = getViewPortHeight() - 130;
          const style={width:"100%", height, border: "NONE"};
          const content = <iframe src={doc.path} title={key} key={key} style={style}></iframe>;
          panes.push({ title: doc.title, content, key});
          this.setState({ panes, activeKey:key });
      } else {
          console.log("no such file: ", key);
      }
    }

    findDoc = (key) => {
        const {documents} = this.props;
        if (isEmptyArray(documents)) return undefined;
        return this.findDocOfChildren(documents, key) ;
        
    }

    findDocOfChildren = (documents, key) => {
        for (let d of documents) {
            if (d.key === key) {
                return d;
            }
            if (!isEmptyArray(d["children"])) {
                const found = this.findDocOfChildren(d["children"], key);
                if (found) return found;
            }
        }
        return undefined;
    }
}

export default _ContentPanel;
 