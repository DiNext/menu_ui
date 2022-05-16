import { Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { MenuUnfoldOutlined,MenuFoldOutlined } from '@ant-design/icons';
import axios from 'axios';
import useSWR from 'swr';
import Prods from '../components/adminPanel/Prods';
import Category from '../components/adminPanel/Category'
import cookieManager from '../src/managers/cookieManager';
import { useRouter } from 'next/router';

const { Header, Sider, Content } = Layout;

function AdminPanel({ categories, cardsChildren }) {
  const [collapsed, setToggle] = useState(false);
  const [select, setSelect] = useState('prods');

  const cookie = new cookieManager();
  const router = useRouter();

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
  
  return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
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
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
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
              display: 'flex',
              justifyContent: "left",
              flexDirection: "row"
            }}> 
            {React.createElement(select == "prods" ? Prods : Category, {categories: categories, cardsChildren: cardsChildren}) }     
          </Content>
        </Layout>
      </Layout>);
}

export async function getStaticProps() {
  const res = await axios.get('http://localhost:3001/api/category').then(res => res.data)

  let categories = res
  let cardsChildren = [];

  if(res != [] && res != undefined) { //TODO
    const cards = [];//creating array
    res.forEach(element => {
      cards.push({ title: element.name, id: element.id, parent: element.parent, children: [] });
    });
    
    cards.sort((a, b) => a - b); //sorting array 
    
    

    for(let i = 0; i < cards.length; i++){
      for(let j = i + 1; j < cards.length; j++){
          if(cards[i].title == cards[j].parent && cards[i].children != undefined){
              console.log(1)
              cards[i].children.push(cards[j])
              cards[j] = {};
          }  
      }
    }

    cards.forEach(element => {
      if(element != {}){
        cardsChildren.push(element);
      }
    });
  }  
  console.log(cardsChildren)
  return {
    props: {
      categories,
      cardsChildren
    },
  }
}

export default AdminPanel;