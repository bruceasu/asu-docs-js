import React from 'react';
import { Menu, Icon } from 'antd';
import {isEmptyArray} from './util/utils';
import customEvent from "./util/custom-event";
const { SubMenu } = Menu;

class _Menus extends React.Component{
    // menus = [
    //   {
    //     title: "Option 1",
    //     iconType: "pie-chart",
    //     key: "1",
    //     children:[],
    //   },
    //   {
    //     title: "Option 2",
    //     iconType: "desktop",
    //     key: "2",
    //     children:[],
    //   },
    //   {
    //     title: "User",
    //     iconType: "user",
    //     key: "sub1",
    //     children:[
    //       {
    //         title: "user 1",
    //         key: "3",
    //       },{
    //         title: "user 2",
    //         key: "4",
    //       },{
    //         title: "user 3",
    //         key: "5",
    //       },
    //     ],
    //   },
    //   {
    //     title: "team",
    //     iconType: "team",
    //     key: "sub2",
    //     children:[{
    //       title: "team 1",
    //       key: "6",
    //     },{
    //       title: "team 2",
    //       key: "7",
    //     },],
    //   },
    //   {
    //     title: "File",
    //     iconType: "file",
    //     key: "8",
    //   },
      
    // ];
    constructor(props) {
        super(props);
        this.state = {menus: []};
    }
   
    createMenus() {
      // const {menus} = this.state;
            const menus = this.props.documents;
      //console.log("menus: ", menus);
      if (!menus) {
        return "";
      }
      return menus.map(m => {
        if (isEmptyArray(m.children)) {
          // leaf
          return this.createMenu(m);
        } else {
          // branch
          return this.createMenuChildren(m);
        }
      });
    }

    createMenu(m) {
        if (isEmptyArray(m.children)) {
            if (m.iconType) {
                return (<Menu.Item key={m.key}>
                  <Icon type={m.iconType} />
                  <span title={m.title}>{m.title}</span>
                </Menu.Item>);
              } else {
                return (<Menu.Item key={m.key}>
                  <span title={m.title}>{m.title}</span>
                </Menu.Item>);
              }
        } else {
            return  this.createMenuChildren(m)
        }
    }

    createMenuChildren(m) {
      const children = m.children.map(m => this.createMenu(m));
      if (m.iconType) {
        return (
          <SubMenu
              key={m.key}
              title={
                <span>
                  <Icon type={m.iconType}/>
                  <span>{m.title}</span>
                </span>
              }
          >
            {children}
          </SubMenu>);
      } else {
        return (
          <SubMenu
              key={m.key}
              title={<span>{m.title}</span>}
          >
            {children}
          </SubMenu>);
      }
    }
      /*点击 MenuItem 调用此函数*/
    handleClick({ item, key, keyPath, domEvent }) {
      customEvent.fire("menu-doc-item-click", { item, key, keyPath, domEvent });
    }

    render() {
      return (<Menu
                defaultSelectedKeys={['1']} 
                onClick={this.handleClick}
                mode="inline">
              {this.createMenus()}
            </Menu>
      );
    }
    
}

export default _Menus;
