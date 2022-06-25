import { Table, Space, Button, Alert, Modal } from 'antd';
import React, {  useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import cookieManager from '../../src/managers/cookieManager';
import CreateCategoryForm from './CreateCategoryForm';
import EditCategoryForm from './EditCategoryForm';
import axios from 'axios';
const { confirm } = Modal;

function useForceUpdate(){
  const [value, setValue] = useState(0);
  return () => setValue(value => value + 1); 
}

export default function AdminPanelCategory(props) {
    const [createCategory, setCreateCategory] = useState(false);
    const [selectedCol, setselectedCol] = useState(null);
    const [edit, setEdit] = useState(false);
    const [del, setDel] = useState(false);

    const router = useRouter()
    const cookie = new cookieManager();
    const forceUpdate = useForceUpdate();

    async function handleCreateCategory() {
      props.onChange();
      forceUpdate()
      setCreateCategory(!createCategory);
    }

    function handleEditCategory() {
      props.onChange();
      forceUpdate()
      setEdit(!edit);
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

      await axios.delete(`https://vkus-vostoka.kz/api/category?id=${id}`, config);

      setDel(false);
      props.onChange();
      forceUpdate()
    }
    
    const showDeleteConfirm = (record) => {
      confirm({
        title: `Вы уверены что хотите удалить категорию: ${record.name}?`,
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

    const columns = [
        {
          title: 'Название',
          dataIndex: 'name',
          key: 'name',
          render: text => <a>{text}</a>,
        },
        {
          title: 'Родительская группа',
          dataIndex: 'parent',
          key: 'parent',
        },
        {
          title: 'Действие',
          key: 'action',
          render: (text, record) => (
            <Space size="middle">
              <a onClick={ (e) => { setselectedCol(record); setEdit(true);} }>Редактировать</a>
              {record.prods.length == 0 && record.chil.length == 0? <a onClick={ (e) => { showDeleteConfirm(record);} }>Удалить</a> : ''}
            </Space>
          ),
        },
    ];

    const data = [];
    
    if(props.categories && props.categories != []){
      props.categories.forEach(element => {
        if(element.parent != null){
          data.push({
            id: element.id,
            name: element.name,
            parent: element.parent.name,
            prods: element.prods,
            chil: element.children,
            image: element.image
          })
        } 
      })
    }
    return (<div style={{ width:"100%", height:"95%"}}>
          <Button onClick={handleCreateCategory} type="primary" style={{marginLeft:'1%', position: 'relative', top: "-110px", left:'87%', margin:-100}}>Создать новую категорию</Button>
          <Table columns={columns} dataSource={data} style={{ width:"100%", height:"100%", marginLeft:'1%', margin:0, marginTop:-60}}/>
          <Modal
          title="Создание новой категории"
          visible={createCategory}
          footer={[]}
          forceRender={true}
          width={"40%"}
          onCancel={()=>{setCreateCategory(false)}}
          >
           <CreateCategoryForm onChange={handleCreateCategory} categories={props.categories}></CreateCategoryForm>
          </Modal> 

          <Modal
          title={`Редактирование категории "${selectedCol ? selectedCol.name: ''}"`}
          visible={edit}
          footer={[]}
          forceRender={true}
          width={"40%"}
          onCancel={()=>{setEdit(false)}}
          >
           {edit == true? <EditCategoryForm onChange={handleEditCategory} categories={props.categories} selectedCategory={selectedCol}></EditCategoryForm> : <>{console.log('s')}</> }
          </Modal> 
      </div> ) 
      } 