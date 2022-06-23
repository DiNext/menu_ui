import { Layout, Menu } from 'antd';
import React, { useState, useEffect } from 'react';
import { MenuUnfoldOutlined,MenuFoldOutlined } from '@ant-design/icons';
import axios from 'axios';
import Prods from '../components/adminPanel/Prods';
import Category from '../components/adminPanel/Category'
import cookieManager from '../src/managers/cookieManager';
import { useRouter } from 'next/router';
import Head from 'next/head';

const { Header, Sider, Content } = Layout;

function adminPanel({categories}) {
  const [collapsed, setToggle] = useState(false);
  const [select, setSelect] = useState('prods');
  const [cards, setCards] = useState([]);
  const cookie = new cookieManager();
  const router = useRouter();

  useEffect(async () => {
    const id = setInterval(() => {
      getCategoryes();
    }, 600);
    return () => clearInterval(id);
  }, []);

  async function getCategoryes () {
    const categories = await axios.get('https://vkus-vostoka.kz/api/category').then(res => res.data)

    setCards(categories)
  }
  
  if (typeof window !== "undefined") {
    const ck = cookie.getCookie('auth_token');

    if(ck == undefined){
      router.push('/auth');
    }
  } 
  
  function handleToggle() {
    setToggle(!collapsed);
  };

  function onSelect(){
    if(select == 'prods'){
      setSelect('cards');
    } else{
      setSelect('prods');
    }
  }

  let styleLogo ={color: "white", padding: 10, fontSize: 18};
  let txt = 'Меню'

  if(collapsed) { 
    styleLogo = {}; 
    txt = ''; 
  }
  
  return (<div style={{height:"100%", minHeight:'100vh'}}>
      <Head>
        <title>Админ панель</title>
        <link rel="icon" href="/images/logo.png" />
      </Head>
      <Layout style={{ height: '100%', minWidth:'100vh', minHeight:'100vh' }}>
        <Sider trigger={null} collapsible collapsed={collapsed} >
          <div className="logo" ><span style={styleLogo}>{txt}</span></div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            onSelect={onSelect}
            items={[
              {
                key: '1',
                label: 'Продукция',
              },
              {
                key: '2',
                label: 'Категории',
              }
            ]}
          />
        </Sider>
        <Layout className="site-layout" style={{minWidth:'100vh', minHeight:'100vh'}}>
          <Header className="site-layout-background" style={{ padding: 0, minWidth:'100vh' }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: handleToggle,
            })}
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              height:"100%",
              display: 'flex',
              justifyContent: "left",
              flexDirection: "row"
            }}> 
            {React.createElement(select == "prods" ? Prods : Category, {categories: cards }) }     
          </Content>
        </Layout>
      </Layout></div>)
}

export default adminPanel;
