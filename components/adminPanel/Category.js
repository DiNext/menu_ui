import { Table, Space, Button, Alert } from 'antd';
import React, {  useState } from 'react';
import { useRouter } from 'next/router';
import cookieManager from '../../src/managers/cookieManager';
import CreateCategoryForm from './CreateCategoryForm';
import EditCategoryForm from './EditCategoryForm';
import axios from 'axios';

export default function AdminPanelCategoty(props) {
    const [createCategory, setCreateCategory] = useState(false);
    const [selectedCol, setselectedCol] = useState(null);
    const [edit, setEdit] = useState(false);
    const [del, setDel] = useState(false);

    const router = useRouter()
    const cookie = new cookieManager();

    function handleCreateCategory() {
      setCreateCategory(!createCategory);
    }

    function handleEditCategory() {
      setEdit(!edit);
    }

    async function onDelete(){
      const id = selectedCol.id;
      
      let token;
      if (typeof window !== "undefined") {
          token = cookie.getCookie('auth_token');
      } 
      console.log(token)
      const config = {
          headers: {
              'content-type': 'application/json',
              'Authorization': 'Bearer ' + token
          }
      }

      await axios.delete(`http://localhost:3001/api/category?id=${id}`, config);

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
              {record.prods.length == 0 && record.chil.length == 0? <a onClick={ (e) => { setselectedCol(record); setDel(true);} }>Удалить</a> : ''}
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
            chil: element.children
          })
        } else{
          data.push({
            id: element.id,
            name: element.name,
            parent: 'Нет',
            prods: element.prods,
            chil: element.children
          })
        }
      });

    }
    
    
      if(del){
        return <Alert
        message="Вы уверены что хотите удалить категорию?"
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

      if(createCategory){
        return <CreateCategoryForm onChange={handleCreateCategory} categories={props.categories}></CreateCategoryForm>
      } else if(edit){
        return <EditCategoryForm onChange={handleEditCategory} categories={props.categories} selectedCategory={selectedCol}></EditCategoryForm>
      }else{
        return (<div style={{ width:"100%", height:"95%"}}>
          <Table columns={columns} dataSource={data} style={{ width:"100%", height:"100%"}}/>
          <Button onClick={handleCreateCategory} type="primary">Создать новую</Button>
      </div> ) 
      } 
}