import { Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { MenuUnfoldOutlined,MenuFoldOutlined } from '@ant-design/icons';
import axios from 'axios';
import useSWR from 'swr';
import AdminPanelProds from '../components/adminPanelProds';

const { Header, Sider, Content } = Layout;

function AdminPanel() {
  const [collapsed, setToggle] = useState(false);
  const [select, setSelect] = useState('prods');
  
  const fetcher = (url) => axios.get(url).then(res => res.data);
  const { data, error } = useSWR('http://localhost:3001/api/category', fetcher);

  let categories = [];

  if(!error && data != [] && data != undefined){ //TODO
    const array = [];//creating array
    data.forEach(element => {
      array.push({title: element.title, key: element.id, parent: element.parent, children: []});
    });

    array.sort((a, b) => a - b); //sorting array 

    const cards = [];

    for(let i = 0; i < cards.length; i++){
      for(let j = i + 1; j < cards.length; j++){
          if(cards[i].id == cards[j].parent && cards[i].childs != undefined){
              cards[i].childs.push(cards[j])
              cards[j] = {};
          }  
      }
    }

    const res = [];
    cards.forEach(element => {
      if(element != {}){
        categories.push(element);
      }
    });

  } else {
    categories = [];
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
  if(collapsed){
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
              
            }}
          > 
            {React.createElement(select == "prods" ? AdminPanelProds : MenuFoldOutlined, {
              categories: categories,
              
            })}        
          </Content>
        </Layout>
      </Layout>
      
    );
  
}

export default AdminPanel;