import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import { Layout, Menu, Breadcrumb } from 'antd';
import '../static/css/AdminIndex.css';
import { Route } from "react-router-dom";
import AddArticle from './AddArticle';
import ArticleList from './ArticleList';
import menuList from "../config/menuConfig";
import BreadCrumb from "../components/BreadCrumb";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default function AdminIndex(props) {

    const [collapsed,setCollapsed] = useState(false);
    const [menuItem,setMenuItem] = useState('')

    const onCollapse = collapsed => {
        setCollapsed(collapsed)
    };

    const getMenuNodes = (menuList) => {
      // 得到当前请求的路由路径
      const path = props.location.pathname;
      return menuList.reduce((pre, item) => {

            pre.push(
              <Menu.Item key={item.path}>
                <Link to={item.path}>
                  <span>{item.title}</span>
                </Link>
              </Menu.Item>
            );

  
        return pre;
      }, []);
    };
    useEffect(()=>{
      setMenuItem(getMenuNodes(menuList))
    },[]);
    
    return (
        <Layout style={{ minHeight: '100vh' }}>
        <Sider  collapsible collapsed={collapsed} onCollapse={onCollapse}>
          <div className="logo" />
          <Menu 
            theme="dark" 
            defaultSelectedKeys={['/index']} 
            mode="inline" 
            
          >
            {menuItem}
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            {/* <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>后台管理</Breadcrumb.Item>
              <Breadcrumb.Item>工作台</Breadcrumb.Item>
            </Breadcrumb> */}
            <BreadCrumb/>
            <div style={{ padding: 24, background: '#fff', minHeight: 'calc( 100vh - 200px )' }}>
                <div>
                    <Route path="/index/" exact  component={AddArticle} />
                    <Route path="/index/add/" exact   component={AddArticle} />
                    <Route path="/index/add/:id"  exact   component={AddArticle} />
                    <Route path="/index/list/"   component={ArticleList} />
                </div>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>XXXXXXXX.com</Footer>
        </Layout>
      </Layout>
    )
}
