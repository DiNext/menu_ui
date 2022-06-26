import React, { useState, useEffect } from 'react';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Empty, Button, Table, Space, Tree, Modal, Input } from 'antd';
import CreateProd from './CreateProd';
import EditProd from './EditProd';
import cookieManager from '../../src/managers/cookieManager';
import axios from 'axios';

const { Search } = Input;

export default function AdminPanelProds({categories, loading}) {
    const [data, setData] = useState([]);
    const [createProd, setCreateProd] = useState(false);
    const [selectedNode, setSelectedNode] = useState(undefined);
    const [selectedNameCat, setSelectedNameCat] = useState(undefined);
    const [selectedProd, setSelectedProd] = useState(undefined);
    const [edit, setEdit] = useState(false);
    const [status, setStatus] = useState('default');
    const [del, setDel] = useState(false);
    const [prods, setProds] = useState(null);
    
    const { confirm } = Modal;
    const cookie = new cookieManager();
    const cards = categories.filter(cards => cards.parent == null);

    async function getProds() {
      const response = await axios.get('https://vkus-vostoka.kz/api/prods').then(res => res.data);
      setProds(response);
    }
    
    useEffect(() => {
      getProds();
    }, []);

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

      if(id === undefined) return console.log(0);
      setSelectedNode(id);
      setSelectedNameCat(e)

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

      const res = await axios.get(`https://vkus-vostoka.kz/api/prods/find?id=${id}`, config);
      setData(res.data);
    }

     async function onDelete(record){
      const id = record.id;
      
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

      await axios.delete(`https://vkus-vostoka.kz/api/prods?id=${id}`, config);

      const idCat = selectedNode;
      const res = await axios.get(`https://vkus-vostoka.kz/api/prods/find?id=${idCat}`, config);
      setData(res.data);

      setDel(false);
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
            <a onClick={ (e) => { showDeleteConfirm(record);} }>Удалить</a>
          </Space>
        ),
      },
    ];

    const showDeleteConfirm = (record) => {
      confirm({
        title: `Вы уверены что хотите удалить продукцию: ${record.name}?`,
        icon: <ExclamationCircleOutlined />,
        content: 'Если согласны нажмите Ок, иначе нажмите Отмена.',
        okText: 'Ок',
        okType: 'danger',
        cancelText: 'Отмена',
        width: 500,
    
        async onOk() {
          await onDelete(record) 
        },
    
        onCancel() {
          console.log('Cancel');
        },
      });
    };

    const onSearch = async (value) => {
      let list = [];
      if(value === "") {
        list = []
        if(selectedNameCat != undefined){
          await onSelect(selectedNameCat)
        }else{
          setData(list)
        }
        return setStatus('default')
      } else {
        let flag = true;
        prods.forEach((element) => {
          if(element.name.toLowerCase().includes(value.toLowerCase())){
            list.push(element)
            flag = false
          }
        });
        if(flag == true) {
          return setStatus('error')
        }else{
          setStatus('default')
        }
      }
      
      setData(list)
    };

    async function onCreatedProd() {
      const id = selectedNode;
      
      if(id === undefined) return setCreateProd(false);

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

      const res = await axios.get(`https://vkus-vostoka.kz/api/prods/find?id=${id}`, config);
      setData(res.data);
      setCreateProd(false);
    }

    async function onEditProd() {
      const id = selectedNode;
      
      if(id === undefined) return setEdit(false);

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

      const res = await axios.get(`https://vkus-vostoka.kz/api/prods/find?id=${id}`, config);
      setData(res.data);
      setEdit(false);
    }

    /* if(!categories || categories == undefined || categories.length == 0){
      return ( <><div style={{  width: 200, height: "100%", borderRight: "1px solid black"}}>
    <Tree showLine
          switcherIcon={<DownOutlined />}
          defaultExpandedKeys={['1']}
          defaultExpandAll={true}
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
    }
    else{ */
    return ( <><div style={{  width: 250, height: "100%"}}>
      <Search placeholder="Поиск товара" allowClear size='large' status={status}onSearch={onSearch} style={{ width: 210, position:'relative', left:"50%", transform:'none',  margin:-100, fontSize:'16px' }} />
    <h1 style={{position: 'relative', top: "-94px", left:'115%', marginBottom: -55, marginTop: -25,fontSize:24, width:400}}>{selectedNameCat ? categories.filter(card => card.id == selectedNode)[0].name : 'Выберите категорию'}</h1>
    <Tree showLine={{showLeafIcon: false}}
          switcherIcon={<DownOutlined />}
          defaultExpandedKeys={['1']}
          defaultExpandAll={false}
          onSelect={onSelect}
          selectable
          style={{margin:0, marginLeft: -7, marginTop: 15}}
          treeData={cards}
          />
    </div>
    
    <div style={{width: '100%', height:'100%'}} >
          <Button onClick={(e) => {setCreateProd(true);}} type="primary" style={{marginLeft:'1%', position: 'relative', top: "-90px", left:'87%', margin:-100}}>Создать новую продукцию</Button>
          <Table columns={columns} loading={loading} dataSource={data} style={{ width:"100%", height:"98%", marginLeft:'1%', margin:0, marginTop:-42}}/>

          <Modal
          title="Создание новой продукции"
          visible={createProd}
          footer={[]}
          forceRender={true}
          width={"40%"}
          onCancel={()=>{setCreateProd(false)}}
          >
           <CreateProd onChange={(e) => {onCreatedProd()}} categories={categories}
           selectedCategory={categories.filter(card =>  card.id == selectedNode) }></CreateProd> 
          </Modal> 

          <Modal
          title={`Редактирование продукции "${selectedProd ? selectedProd.name: ''}"`}
          visible={edit}
          footer={[]}
          width={"40%"}
          forceRender={true}
          onCancel={()=>{setEdit(false)}}
          >
           {edit == true? <EditProd onChange={(e) => {onEditProd()}} categories={categories} selectedProd={selectedProd}></EditProd> : <>{console.log('s')}</> }
          </Modal>
    </div>
    </> ) 
    }
/* } */


