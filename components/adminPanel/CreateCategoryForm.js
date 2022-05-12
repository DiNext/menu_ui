import React, { useState } from 'react';
import { Form, Input, Button, Upload, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const path = require('path');

function CreateCategoryForm (props) {
    const [image, setImage] = useState(null);

    const normFile =  (e) => {
        setImage(e.file); 
          
       
    };

    async function onClose   (){
        props.onChange();
        console.log(image)
        const config = {
            headers: { 'content-type': 'multipart/form-data' },
          };
          const formData = new FormData();
          Array.from(image).forEach((file) => {
            formData.append('theFiles', {fileName:image.name, type: image.type, uri: image.uri});
          });
          
          const response = await axios.post('/api/uploads', formData, config);
          
          console.log('response', response.data);
    }

    return (
        <Form
        style={{width:'450px',position:"absolute", left: "40%", top:'30%'}}
        labelCol= {{ span: 6.5 }}
        wrapperCol= {{ span: 20 }}
        size='large'
        ><h1 style={{fontSize:'21px', marginBottom:20}}>Создание новой категории</h1>
        <Form.Item name="name" label="Название" required>
            <Input />
        </Form.Item>
        <Form.Item label="Родительская категория" name="parent" required>
            <Select>
            <Select.Option value="demo">Demo</Select.Option>
            </Select>
        </Form.Item>
        
        <Form.Item
            name="image"
            label="Загрузить изображение"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            uploadFileName="theFiles"
            required
        ><Upload name="image" maxCount={1} listType="picture-card">
            <Button icon={<UploadOutlined />} uploadFileName="theFiles" ></Button>
            </Upload>
            </Form.Item>

        <Form.Item >
            <Button type="primary">Создать</Button>
            <Button style={{marginLeft: 20}} onClick={onClose}>Отмена</Button>
        </Form.Item>
        </Form>
    );
};

export default CreateCategoryForm;