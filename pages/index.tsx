import Head from 'next/head';
import { Input, ConfigProvider, Button, Badge } from 'antd';
import { ShoppingCartOutlined, EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons';
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

  useEffect(() => {
    const id = setInterval(() => {
      checkBacket();
    }, 100);
    return () => clearInterval(id);
  }, []);

  /* useEffect(() => {
    setInterval(function() {
      checkBacket()
    }, 100);
    


    
  }); */

   function checkBacket() {
      const backet = JSON.parse(localStorage.getItem ("Backet") || "");

      if(backet != ""){
        backet.forEach(function (element: any, index: any){
          setCount(index+1)
        });}
  } 

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
              <Badge  count={count} style={{marginLeft:'200px'}}status="success" showZero={false} ></Badge><Button icon={<ShoppingCartOutlined />} type="primary" size='large' style={{ position:'relative', right:'-40%'}}>Корзина</Button>

              <Search placeholder="Введите название блюда" 
                      allowClear  style={{ width: "90%",
                      marginLeft: "27px", marginTop: "45px",
                       }} size='large'/>
          </div>
                   
            <Grid cards={data} ></Grid>
          
        </div>
        
      </main>

      <footer>
      
      </footer>
    </div>
  )}

  export default Main

 