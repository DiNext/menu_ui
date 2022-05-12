import { Table, Space, Button } from 'antd';
import React, {  useState } from 'react';
import CreateCategoryForm from './CreateCategoryForm';

export default function AdminPanelProds({categories}) {
    const [createCategory, setCreateCategory] = useState(false);

    function handleCreateCategory() {
      setCreateCategory(!createCategory);
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
              <a>Редактировать</a>
              <a>Удалить</a>
            </Space>
          ),
        },
      ];

      const data = [
        {
          key: '1',
          name: 'John Brown'
        },
        {
          key: '2',
          name: 'Jim Green'
        },
        {
          key: '3',
          name: 'Joe Black'
        }
      ];
    if(createCategory){
      return <CreateCategoryForm onChange={handleCreateCategory}></CreateCategoryForm>
    } else{
      return (<div style={{ width:"100%", height:"95%"}}>
        <Table columns={columns} dataSource={data} style={{ width:"100%", height:"100%"}}/>
        <Button onClick={handleCreateCategory} style={{}} type="primary">Создать новую</Button>
    </div> ) 
    }
    
}