import Head from 'next/head'
import { Button } from 'antd';
import Link from 'next/link'
import 'antd/dist/antd.css';
import { Input, Space } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import { useState } from 'react'
import Grid from '../components/Grid.js'

const { Search } = Input;

function Main()  {
  const [flagContent, setFlagContent] = useState(true);
  const [buttonKitType, setButtonKitType] = useState("primary");
  const [buttonBarType, setButtonBarType] = useState("default");

  
  const onClickKitchen = e => {   
    if(flagContent) {
      console.log(flagContent);
    } else{
      setFlagContent(true)
      setButtonKitType('primary');
      setButtonBarType('default');
    }
  };
  
  const onClickBar = e => {   
    if(flagContent) {
      setFlagContent(false);
      setButtonBarType('primary');
      setButtonKitType('default');
    } else{console.log(flagContent);} 
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
                <h4>Электронное меню</h4>
              </span>
              <span className="desc">
                
                <a href="https://goo.gl/maps/KT63x3U4Cxk6Nrgs9" target="_blank">
                <img src="/images/address.png" 
                id='address'
                />
                г. Тараз ул. Толе би 61А</a>
                <a href="tel:+77475727600">
                <img src="/images/telephone.png" 
                id='telephone'
                />
                
                  +7(747)-572-76-00</a>
              </span>

              <div className='buttons'>
                <div className='menu_kuhnya'>
                <Button type={buttonKitType} id="menu_kuhnya" onClick={onClickKitchen}>Кухня</Button>
                </div>
                <div className='menu_bar'>
                <Button type={buttonBarType} id="menu_bar" onClick={onClickBar}>Бар</Button>
                </div>
              </div>

              <Search placeholder="Введите название блюда" 
                      allowClear  style={{ width: "80%",
                       id: "search",
                       marginLeft: "52px",
                        }} size='large'/>
          </div>
                   
            <Grid></Grid>
          
        </div>
        
      </main>

      <footer>
        <a
          href="https://nt-t.kz"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' NTT'}
          
        </a>
      </footer>
    </div>
  )}

  export default Main

 