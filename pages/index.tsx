import Head from 'next/head';
import { Drawer, Input, ConfigProvider, Button, Badge, Space, Table, Form} from 'antd';
import { ShoppingCartOutlined, EnvironmentOutlined, PhoneOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import React,{ MouseEventHandler, useState, useEffect } from 'react';
import Grid from '../components/Grid.js';
import useSWR from 'swr';
import axios from 'axios';
import 'antd/dist/antd.variable.min.css'
import type { ColumnsType } from 'antd/lib/table';

interface DataType {
  key: React.Key;
  name: string;
  price: number;
  qnty: string;
  id: number
}

const { Search } = Input;

ConfigProvider.config({
  theme: {
    primaryColor: '#d46b08',
  },
});

function Main()  {
  const fetcher = (url: any) => axios.get(url).then(res => res.data);
  const { data, error } = useSWR('https://vkus-vostoka/api/category', fetcher);
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [backetData, setBacketData] = useState([]);
  const [childrenDrawer, setChildrenDrawer] = useState(false);

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
    console.log(backetData)
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
      setBacketData(backet);
      
      if(backet != ""){ 
        backet.forEach(function (element: any, index: any){
          setCount(index + 1)
        });
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

  const sum = () => {
    let sum = 0;
    try{
      backetData.forEach((element) => {
        sum += Number(element['price'] * element['qnty'])
      });
      return "Итого: " + sum + ' тг.';
    }catch{
      return "Добавьте блюдо в корзину."
    }
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Название',
      dataIndex: 'name',
    },
    {
      title: 'Количество',
      dataIndex: 'qnty',
      render: (text, record) => <><a><PlusOutlined  style={{marginRight:'8px'}}onClick={()=>{increment(record['id'])}} key="edit" /></a> {text} <a><MinusOutlined style={{marginLeft:'8px'}} onClick={(e)=>{decrement(record['id'])}} key="ellipsis" /></a></>,
    },
    {
      title: 'Цена',
      dataIndex: 'price',
      render: (text, record) => <>{(Number(record.qnty) * record.price) + " тг."}</>
    },
  ];

  const showChildrenDrawer = () => {
    setChildrenDrawer(true);
  };

  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
  };
  
  function onFinish(values: any){
    let order = '';
    backetData.forEach(function (element: any){
      order += `${element.name} ${element.qnty}шт. `
    })

    const text = `Новый заказ!%0AИмя: ${values['name']}.%0AТелефон: ${values['tel']}.%0AАдрес: ${values['address']}.%0AКомментарий: ${values['comment']}.%0AЗаказ: ${order}`

    const options = {
      url: `https://api.telegram.org/bot5527777720:AAEnirVmNAbYX1qDLBtjuJmGRERxbmBBW-0/sendMessage?chat_id=489950830&text=${text}`,
      method: 'GET'
    };
    
    axios(options)
      .then(response => {
        console.log(response.status);
      });

    setVisible(false)
    setChildrenDrawer(false)
    localStorage.setItem ("Backet", JSON.stringify(""));
  }

  const buttonPay = () => {
    return <Button type="primary" onClick={showChildrenDrawer}>Оформить заказ!</Button>
  }

  const buttonMenu = () => {
    return <Button type="primary" onClick={onClose}>Вернутся в меню</Button>
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
        width={"70%"}
        onClose={onClose}
        visible={visible}
        extra={
          <Space>
            <Button onClick={onClose}>Отмена</Button>
            {React.createElement(backetData && backetData.length ! ?  buttonPay: buttonMenu, {}) }
          </Space>
        }
      >
            <div style={{display:"flex", width:"100%"}}>
              <Table style={{width:"100%"}} columns={columns} pagination={false} dataSource={backetData} size="middle" footer={sum}/>
            </div>
            <Drawer
            title="Заказ"
            width={"70%"}
            closable={false}
            onClose={onChildrenDrawerClose}
            visible={childrenDrawer}
          >
            <Form
            layout="vertical"
            style={{maxWidth:450}}
            onFinish={onFinish}
            
            >   
                <Input.Group >
                  <Form.Item name="name" label="Ваше имя" rules={[{ required: true, message: 'Введите ваше имя!' }]}>
                      <Input />
                  </Form.Item>
                  <Form.Item name="tel" label="Телефон" rules={[{ required: true, message: 'Введите номер телефона!' }]}>
                      <Input  maxLength={10} addonBefore="+7"/>
                  </Form.Item>
                  <Form.Item name="address" label="Адрес" rules={[{ required: true, message: 'Введите адрес!' }]}>
                      <Input style={{ width: '100%', height:33 }} />
                  </Form.Item>
                  <Form.Item name="comment" label="Комментарий" >
                      <Input.TextArea style={{ minHeight:100 }}/>
                  </Form.Item>
                  <p style={{fontSize:"16px"}}>{sum()}</p>
                  <Form.Item >
                      <Button type="primary" htmlType='submit'>Заказать!</Button>
                      <Button style={{marginLeft: 20}} onClick={onChildrenDrawerClose}>Отмена</Button>
                  </Form.Item>
                </Input.Group>
            </Form>
          </Drawer>
      </Drawer>
      </main>

      <footer>
      
      </footer>
    </div>
  )}

  export default Main

 
