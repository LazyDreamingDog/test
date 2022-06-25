import React, {Component, useState, useEffect} from "react";
import { Layout, Menu, Breadcrumb } from 'antd';
import {
    BankOutlined,
    DesktopOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import './DefaultLayout.less'
import { Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import '../design/style.css'
import Pic from '../Components/Pic'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const ip_port = "http://192.168.80.130:8080/";

function DefaultLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [path, setPath] = useState('/');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(()=>{
        let current_path = location.pathname;
        let target = current_path.split('/')[1];
        setPath(target);
        console.log(path);
        console.log(target)
    },[])

    const onCollapse = collapsed => {
        console.log(collapsed);
        setCollapsed({ collapsed });
    };

    const handleClick = e => {
        console.log('click', e);
    }

    const jump = e => {
        navigate('/' + e.key)
        setPath(e.key);
        console.log(path);
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={() => onCollapse(collapsed)}>
                <div className="logo" />
                <Menu theme="dark"
                      selectedKeys = {[path]}
                      mode="inline"
                      onClick={jump}>
                    <SubMenu key="sub1" icon={<DesktopOutlined />} title="System">
                        <Menu.Item key="create_did">注册DID</Menu.Item>
                        <Menu.Item key="get_did_doc">获取DID文档</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" icon={<UserOutlined />} title="User">
                        <Menu.Item key="create_credential">申请凭证</Menu.Item>
                        <Menu.Item key="create_verify_request">申请验证</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub3" icon={<BankOutlined />} title="Issuer">
                        <Menu.Item key="create_schema">创建模板</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub4" icon={<TeamOutlined />} title="Verifier">
                        <Menu.Item key="create_verify_rules">撰写验证规则</Menu.Item>
                        <Menu.Item key="verify_credential">验证凭证</Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ textAlign: 'center', color: 'grey', fontSize: '30px'}}>
                    Welcome to the distributed digital Identity and Verifiable credentials system
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    {/*<Breadcrumb style={{ margin: '16px 0' }}>*/}
                    {/*    <Breadcrumb.Item>User</Breadcrumb.Item>*/}
                    {/*    <Breadcrumb.Item>Bill</Breadcrumb.Item>*/}
                    {/*</Breadcrumb>*/}
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                        {location.pathname.split('/')[1]==='' && (
                            <Pic />
                        )}
                        {location.pathname.split('/')[1]!=='' && (
                            <Outlet/>
                        )}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>DID System Design ©2022 Created by 互联网上的你再安全也是假的</Footer>
            </Layout>
        </Layout>
    );
}

export default DefaultLayout;



// class DefaultLayout extends Component {
//     state = {
//         collapsed: false,
//         path: ''
//     };
//
//     componentDidMount() {
//         let current_location = this.props.location;
//         console.log(current_location);
//     }
//
//     onCollapse = (collapsed) => {
//         //console.log(collapsed);
//         //this.setState({ collapsed });
//     };
//
//     render() {
//         const { collapsed } = this.state;
//         return (
//             <Layout style={{ minHeight: '100vh' }}>
//                 <Sider collapsible collapsed={collapsed} onCollapse={() => this.onCollapse(collapsed)}>
//                     <div className="logo" />
//                     <Menu theme="dark" defaultSelectedKeys={[]} mode="inline" onClick={this.handleClick}>
//                         <SubMenu key="sub1" icon={<DesktopOutlined />} title="System">
//                             <Menu.Item key="create_did">
//                                 <Link to={'/create_did'}>注册DID</Link>
//                             </Menu.Item>
//                             <Menu.Item key="2">获取DID文档</Menu.Item>
//                         </SubMenu>
//                         <SubMenu key="sub2" icon={<UserOutlined />} title="User">
//                             <Menu.Item key="create_credential">
//                                 <Link to={'/create_credential'}>申请凭证</Link>
//                             </Menu.Item>
//                             <Menu.Item key="4">凭证混淆</Menu.Item>
//                             <Menu.Item key="5">选择性披露</Menu.Item>
//                         </SubMenu>
//                         <SubMenu key="sub3" icon={<TeamOutlined />} title="Issuer">
//                             <Menu.Item key="6">创建模板</Menu.Item>
//                             {/*<Menu.Item key="7"></Menu.Item>*/}
//                         </SubMenu>
//                         <SubMenu key="sub4" icon={<TeamOutlined />} title="Verifier">
//                             <Menu.Item key="7">验证凭证</Menu.Item>
//                         </SubMenu>
//                     </Menu>
//                 </Sider>
//                 <Layout className="site-layout">
//                     <Header className="site-layout-background" style={{ textAlign: 'center', color: 'grey', fontSize: '30px'}}>
//                         Welcome to the distributed digital Identity and Verifiable credentials system
//                     </Header>
//                     <Content style={{ margin: '0 16px' }}>
//                         {/*<Breadcrumb style={{ margin: '16px 0' }}>*/}
//                         {/*    <Breadcrumb.Item>User</Breadcrumb.Item>*/}
//                         {/*    <Breadcrumb.Item>Bill</Breadcrumb.Item>*/}
//                         {/*</Breadcrumb>*/}
//                         <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
//                             这里可以放一个使用流程作为首页
//                             <Outlet/>
//                         </div>
//                     </Content>
//                     <Footer style={{ textAlign: 'center' }}>DID System Design ©2022 Created by 队名</Footer>
//                 </Layout>
//             </Layout>
//         );
//     }
// }