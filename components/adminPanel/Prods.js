import { Tree } from 'antd';
import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { Empty, Button, Table, Space, Alert } from 'antd';
import CreateProd from './CreateProd';
import EditProd from './EditProd';
import cookieManager from '../../src/managers/cookieManager';
import axios from 'axios';

export default function AdminPanelProds({categories}) {
    const [data, setData] = useState([]);
    const [createProd, setCreateProd] = useState(false);
    const [selectedNode, setSelectedNode] = useState(undefined);
    const [selectedProd, setSelectedProd] = useState(undefined);
    const [edit, setEdit] = useState(false);
    const [del, setDel] = useState(false);

    const cookie = new cookieManager();
    const router = useRouter()
    const cards = categories.filter(cards => cards.parent == null);

    if(categories != undefined, categories.length != 0){
      getFiniteValue(cards)
      function getFiniteValue(obj) {
        getProp(obj);
    
        function getProp(o) {
            for(var prop in o) {
                if(typeof(o[prop]) === 'object') {
                    getProp(o[prop]);
                } else {
                  if(o.name){
                    o.title = o.name
                    o.key = o.id
                  }
                }
            }
        }
      }
    }
    
    async function onSelect(e) {
      const id = e[0];
      console.log(e)
      if(id === undefined) return console.log(0);
      setSelectedNode(id);

      let token;
      if (typeof window !== "undefined") {
        token = cookie.getCookie('auth_token');
      } 

      const config = {
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
      }

      const res = await axios.get(`http://localhost:3001/api/prods/find?id=${id}`, config);
      setData(res.data);
      res.data.forEach
    }

    async function onDelete(){
      const id = selectedProd.id;
      
      let token;
      if (typeof window !== "undefined") {
          token = cookie.getCookie('auth_token');
      } 

      const config = {
          headers: {
              'content-type': 'application/json',
              'Authorization': 'Bearer ' + token
          }
      }

      await axios.delete(`http://localhost:3001/api/prods?id=${id}`, config);

      setDel(false);
      router.reload(window.location.pathname);
    }

    const columns = [
      {
        title: 'Название',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
      },
      {
        title: 'Цена',
        dataIndex: 'price',
        key: 'price'
      },
      {
        title: 'Описание',
        dataIndex: 'desc',
        key: 'desc'
      },
      {
        title: 'Родительская группа',
        dataIndex: 'parent',
        key: 'parent',
        render: (text, record) => (
          <Space size="middle">
             <p>{record.parent.name}</p>
          </Space>
        )
      },
      {
        title: 'Действие',
        key: 'action',
        render: (text, record) => (
          <Space size="middle">
            <a onClick={ (e) => { setSelectedProd(record); setEdit(true);} }>Редактировать</a>
            <a onClick={ (e) => { setSelectedProd(record); setDel(true);} }>Удалить</a>
          </Space>
        ),
      },
    ];
    
    if(del){
      return <Alert
      message="Вы уверены что хотите удалить продукцию?"
      description={<><p>Если согласны нажмите принять, иначе нажмите отмена.</p>
                    <Space direction="horizontal">
                    <Button size="small" danger type="ghost" onClick={onDelete}>
                      Принять
                    </Button>
                    <Button size="small" type="primary" onClick={e => {setDel(false)}}>
                      Отмена 
                    </Button>
                  </Space></>}
      type="info"
      onClose={e =>{setDel(false)}}
      style={{position:"relative", left: "30%", top:"-10%"}}
      closable
    />
    }
    

    if(!categories || categories == undefined || categories.length == 0){
      return ( <><div style={{  width: 200, height: "100%", borderRight: "1px solid black"}}>
    <Tree showLine
          switcherIcon={<DownOutlined />}
          defaultExpandedKeys={['0']}
          defaultExpandAll={true}
          style={{}}
          treeData={[
            {
              title: 'Нет категорий',
              key: '1',
              children: []  
            },
          ]}/>
    </div>
    <div style={{marginLeft: "40%", marginTop:'-10%'}}>
    <Empty
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        imageStyle={{
          height: 60,
        }}
        description={
          <span>
            Нет продукции
          </span>
        }
      >
      </Empty>
    </div>
    </> ) 

    }else if(createProd){
      return <CreateProd onChange={(e) => {setCreateProd(false)}} categories={categories}></CreateProd>
    } else if(edit){
      return <EditProd onChange={(e) => {setEdit(false)}} categories={categories} selectedProd={selectedProd}></EditProd>
    } else{
    return ( <><div style={{  width: 200, height: "100%"}}>

    <Tree showLine
          switcherIcon={<DownOutlined />}
          defaultExpandedKeys={['0']}
          defaultExpandAll={true}
          onSelect={onSelect}
          selectable
          treeData={cards }/>
    </div>
    <div style={{width: '100%', height:'100%'}} >

          <Table columns={columns} dataSource={data} style={{ width:"100%", height:"98%", marginLeft:'1%'}}/>
          <Button onClick={(e) => {setCreateProd(true);}} type="primary" style={{marginLeft:'1%'}}>Создать новую</Button>
    </div>
    </> ) 
    }
}


