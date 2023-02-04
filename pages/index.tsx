import Head from 'next/head';
import { Drawer, Input, ConfigProvider, Button, Badge, Space, Table, Form} from 'antd';
import { ShoppingCartOutlined, EnvironmentOutlined, PhoneOutlined, PlusOutlined, InstagramOutlined, MinusOutlined } from '@ant-design/icons';
import React,{  useState, useEffect } from 'react';
import Grid from '../components/Grid.js';
import useSWR from 'swr';
import axios from 'axios';
import 'antd/dist/antd.variable.min.css'
import Link from "next/link";
import type { ColumnsType } from 'antd/lib/table';

interface DataType {
  key: React.Key;
  name: string;
  price: number;
  qnty: string;
  id: number
}

ConfigProvider.config({
  theme: {
    primaryColor: '#ee3a3a',
  },
});

const { Search } = Input;

function Main()  {
  const fetcher = (url: any) => axios.get(url).then(res => res.data);
  const { data, error } = useSWR('https://hilal-taraz.kz/api/category', fetcher);

  const [prods, setProds] = useState(null as any);
  const [status, setStatus] = useState('default' as any);
  const [listProds, setListProds] = useState([] as any);
  const [count, setCount] = useState(0);
  const [item, setItem] = useState('Кухня');
  const [typeChicken, setTypeChicken] = useState('primary'as any);
  const [typeChickenBar, setTypeChickenBar] = useState('default' as any);
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
  async function getProds() {
    const response = await axios.get('https://hilal-taraz.kz/api/prods').then(res => res.data);
    setProds(response);
  }
  
  useEffect(() => {
    getProds();
  }, []);

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

  const onChicken = () => {
    if(typeChicken == 'primary') {
      return
    }else{
      setTypeChicken('primary');
      setTypeChickenBar('default');
      setItem('Кухня')
    }
    
  };
  const onBar = () => {
    if(typeChickenBar == 'primary') {
      return
    }else{
      setTypeChickenBar('primary');
      setTypeChicken('default');
      setItem('Бар');
    }
  };
  const sum = () => {
    let sum = 0;
    try{
      backetData.forEach((element) => {
        sum += Number(element['price'] * element['qnty'])
      });
      return <>
                <p>Обслуживание 15%: {(Math.round(sum * 0.15))}тг.</p>
                <p>Итого: {(Math.round(sum + sum * 0.15))}тг.</p>
              </>;
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
      dataIndex: 'cena',
      render: (text, record) => <>{record.price + " тг."}</>
    },
    {
      title: 'Cумма',
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

  const onClear = () => {
    setListProds([]);
  }
  
  const onSearch = (value: any, event: any) => {
    console.log(value);
    let list = [] as any;
    if(value === "") {
      list = []
      setStatus('default')
    } else {
      let flag = true;
      prods.forEach((element: any) => {
        if(element.name.toLowerCase().includes(value.toLowerCase())){
          list.push(element)
          flag = false
        }
      });
      if(flag == true) {
        setStatus('error')
      }else{
        setStatus('default')
      }
    }
    
    setListProds(list);
  }

  return (
    <div className="container">
      <Head>
        <title>Hilal Restobar</title>
        <link rel="icon" href="/images/logo.jpeg" />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" ></link>
        <link href="https://fonts.googleapis.com/css2?family=MuseoModerno:wght@100;500;800;900&family=Prompt:ital,wght@1,500&display=swap" rel="stylesheet"></link>
      </Head>

      <main>
        <h1 className="title">
          <div className='placeholder'>
            <div>
            <img src="/images/3.jpeg" alt="title_image" className="title_img"/>
            </div>
          </div>
          {/* <div className='icon'>
            <img src="/images/logo.png" alt="logo" className="title_icon" />
          </div> */}
        </h1>
        <div className='content'>
          <div className='description_title'>
              <span className="span"> 
              <img src="/images/logo.jpeg" alt="logo" className='title_icon_h4' /> 
                <div className='logoWrapper'>
                <span className='logoName'>HILAL</span>
                <span className='logoSubName'>RESTOBAR</span>
                </div>
                {/* <h4 style={{fontWeight: 'bold',  fontFamily: "'Poppins', sans-serif", fontSize:50, color:"#00853E", marginTop:-10, marginBottom:-5}}>Пинта</h4> */}              
              </span>
              
              <span className="desc">
              
                <a href="https://goo.gl/maps/fxU2SbaEhxD29nJH6" target="_blank" style={{marginTop:-10, color: "#ee3a3a !important", zIndex: 999}}>
                <EnvironmentOutlined />
                г. Тараз ул. просп. Абая 202</a>
                
                <a href="tel:+77077766539" className='tel' style={{marginTop:-10, color: "#ee3a3a !important"}}>
                <PhoneOutlined/>
                  +7 (707)-776-65-39</a>
                  <div className="buttons" style={{position:'relative', left:'-41%', marginTop:30, marginLeft:-138, zIndex: 1000}}>
                    <Button type={typeChicken} style={{marginRight:10} }shape="round" onClick={onChicken}> Основное меню</Button>  
                    <Button type={typeChickenBar} onClick={onBar}shape="round"> Бар</Button> 
                  </div>
              </span>
              <div style={{position: 'relative', left:'74%', top:"5%", width:100}} onClick={showLargeDrawer}><Badge  count={count} style={{marginLeft:'200px'}}status="success" showZero={false} ><Button icon={<ShoppingCartOutlined />} type="primary" size='large' >Корзина</Button></Badge></div>

              <Search placeholder="Введите название блюда" 
                      allowClear  style={{ width: "90%",
                      marginLeft: "27px", marginTop: "25px", fontSize: "16px", marginBottom:"20px"}} size='large' onSearch={onSearch} status={status}/>
          </div>
                   
            <Grid cards={data} item={item} listProds={listProds} onChange={onClear}></Grid>
          
        </div>
        <Drawer
        title={`Корзина`}
        placement="right"
        closable={false}
        width={"90%"}
        onClose={onClose}
        visible={visible}
        style={{padding:0}}
        extra={
          <Space>
            <Button onClick={onClose}>Отмена</Button>
            {React.createElement(backetData && backetData.length ! ?  buttonPay: buttonMenu, {}) }
          </Space>
        }
      >
            <div style={{display:"flex", width:"100%"}}>
              <Table style={{width:"100%", margin:0}} columns={columns} pagination={false} dataSource={backetData} size="middle" footer={sum}/>
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

      <footer style={{height:45}}>
      <Link href="https://instagram.com/hilal_restobar_taraz?igshid=YmMyMTA2M2Y=" >    
        <a target="_blank" style={{fontSize:35}}><InstagramOutlined /></a>
      </Link>
      </footer>
    </div>
  )}

  export default Main

 
