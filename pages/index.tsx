import Head from 'next/head';
import { Drawer, Input, ConfigProvider, Button, Badge, Space } from 'antd';
import { ShoppingCartOutlined, EnvironmentOutlined, PhoneOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { MouseEventHandler, useState, useEffect } from 'react';
import Grid from '../components/Grid.js';
import useSWR from 'swr';
import axios from 'axios';
import 'antd/dist/antd.variable.min.css'

const { Search } = Input;

ConfigProvider.config({
  theme: {
    primaryColor: '#d46b08',
  },
});

function Main()  {
  const fetcher = (url: any) => axios.get(url).then(res => res.data);
  const { data, error } = useSWR('http://localhost:3001/api/category', fetcher);
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [backetData, setBacketData] = useState([]);

  const showLargeDrawer = () => {
    setVisible(true);
  };

  function increment(cardId : any) {
    backetData.forEach(function (element: any) {
      element.id == cardId ? element.qnty += 1 : console.log(1); 
    })

    localStorage.setItem ("Backet", JSON.stringify(backetData));
  }

  function decrement(cardId : any) {
    backetData.forEach(function (element: any, index: any) {
      if(element.id == cardId) {
        if(element.qnty == 1){
          backetData.splice(index, 1);
        } else{
          element.qnty -= 1
        }
      } 
    })

    localStorage.setItem ("Backet", JSON.stringify(backetData));
  }

  useEffect(() => {
    const id = setInterval(() => {
      checkBacket();
    }, 300);
    return () => clearInterval(id);
  }, []);

   function checkBacket() {
     try{
      const backet = JSON.parse(localStorage.getItem ("Backet") || "");

      if(backet != ""){
        backet.forEach(function (element: any, index: any){
          setCount(index + 1)
        });
        setBacketData(backet);
      } else{
        setCount(0)
      }
     } catch{
       setCount(0)
     }
  } 
  const onClose = () => {
    setVisible(false);
  };

  return (
    <div className="container">
      <Head>
        <title>Электронное меню</title>
        <link rel="icon" href="/images/logo.jpg" />
      </Head>

      <main>
        <h1 className="title">
          <div className='placeholder'>
            <div>
            <img src="/images/3.jpg" alt="title_image" className="title_img" />
            </div>
          </div>
          <div className='icon'>
          <img src="/images/logo.jpg" alt="logo" className="title_icon" />
          </div>
        </h1>
        <div className='content'>
          <div className='description_title'>
              <span className="span">     
                <h4>Ресторан Вкус Востока</h4>              
              </span>
              
              <span className="desc">
              
                <a href="https://goo.gl/maps/KT63x3U4Cxk6Nrgs9" target="_blank" >
                <EnvironmentOutlined />
                г. Тараз ул. Толе би 61А</a>
                
                <a href="tel:+77475727600" className='tel'>
                <PhoneOutlined/>
                  +7(747)-572-76-00</a>
                  
              </span>
              <div style={{position: 'relative', left:'74%', width:100}} onClick={showLargeDrawer}><Badge  count={count} style={{marginLeft:'200px'}}status="success" showZero={false} ><Button icon={<ShoppingCartOutlined />} type="primary" size='large' >Корзина</Button></Badge></div>

              <Search placeholder="Введите название блюда" 
                      allowClear  style={{ width: "90%",
                      marginLeft: "27px", marginTop: "45px",
                       }} size='large'/>
          </div>
                   
            <Grid cards={data} ></Grid>
          
        </div>
        <Drawer
        title={`Корзина`}
        placement="right"
        closable={false}
        width={500}
        onClose={onClose}
        visible={visible}
        extra={
          <Space>
            <Button onClick={onClose}>Отмена</Button>
            <Button type="primary" onClick={onClose}>
              Оформить заказ!
            </Button>
          </Space>
        }
      >
        {
          backetData.map((card) => (
            <div style={{display:"flex"}}><p style={{width:"260px"}}>{card['name']}</p><PlusOutlined  style={{marginLeft:'100px'}}onClick={()=>{increment(card['id'])}} key="edit" /> <p style={{marginLeft:'5px'}}> {card['qnty'] + " шт."}</p><MinusOutlined style={{marginLeft:'5px'}} onClick={(e)=>{decrement(card['id'])}} key="ellipsis" /></div>
          ))
        }
      </Drawer>
      </main>

      <footer>
      
      </footer>
    </div>
  )}

  export default Main

 