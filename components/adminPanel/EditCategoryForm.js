import React, { useState } from 'react';
import { useRouter } from 'next/router'
import { Form, Input, Button, Upload, Select, Alert, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import cookieManager from '../../src/managers/cookieManager';
import axios from 'axios';

function EditCategoryForm (props) {
    const [image, setImage] = useState(null);
    const [trigger, setTrigger] = useState(false);

    const router = useRouter()
    const cookie = new cookieManager();

    const normFile = (e)=> {
        if(e.fileList == undefined){
            return e
        } else if(e.fileList[0] != undefined){
            setImage(e.fileList[0].originFileObj);
        }
    };

    function onClose() {
        props.onChange();
    }

    function onRemove() {
        setImage(null);
    }

    async function onFinish(values) {
        let uniqName = true;
        let emptyCategory = true;

        props.categories.forEach(element => {
            if(props.selectedCategory.name != values.name && element.name == values.name){
                uniqName = false
                setTrigger(true)
            }
        });

        if(uniqName && emptyCategory) {
            let imageURL = '';
            if(image != null){ //creating image
                const config = {
                    headers: { 'content-type': 'multipart/form-data' },
                };
                const formData = new FormData();
                
                formData.append('theFiles', image);
                await axios.post('/api/uploads', formData, config);

                imageURL = image.name;
                console.log(imageURL)
            } 

            const id = props.selectedCategory.id;

            let token;
            if (typeof window !== "undefined") {
                token = cookie.getCookie('auth_token');
            } 
            let body;
            if(image != null){
                body = {
                    name: values.name,
                    image: imageURL
                }
            } else{
                body = {
                    name: values.name
                }
            }

            const config = {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }
            await axios.put(`http://216556.fornex.cloud:3001/api/category?id=${id}`, body, config);
            router.reload(window.location.pathname);
            props.onChange();
         }
    }
    if(trigger){
        return <Alert
        message="Название категории не уникально."
        description={<><p>Введите другое название.</p>
                      <Space direction="horizontal">
                      <Button size="small"  type="primary" onClick={e =>{setTrigger(false)}}>
                        Ок
                      </Button>
                    </Space></>}
        type="info"
        onClose={e =>{setTrigger(false)}}
        style={{position:"relative", left: "30%", top:"-10%"}}
        closable
      />
    }
    else{
        return (
            <Form
            style={{width:'450px',position:"absolute", left: "40%", top:'30%'}}
            labelCol= {{ span: 6.5 }}
            wrapperCol= {{ span: 20 }}
            onFinish={onFinish}
            size='large'
            >   <h1 style={{fontSize:'21px', marginBottom:20}}>Редактирование категории "{props.selectedCategory.name}"</h1>
                <Form.Item name="name" label="Новое название" rules={[{ required: true, message: 'Введите название категории!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="upload" 
                    label="Загрузить новое изображение"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}>
                    <Upload maxCount={1} listType="picture-card" action={'/'} onRemove={onRemove}>
                        <Button icon={<UploadOutlined />}></Button>
                    </Upload>
                </Form.Item>
    
                <Form.Item >
                    <Button type="primary" htmlType='submit'>Редактировать</Button>
                    <Button style={{marginLeft: 20}} onClick={onClose}>Отмена</Button>
                </Form.Item>
            </Form>
        );
    } 
};

export default EditCategoryForm;
