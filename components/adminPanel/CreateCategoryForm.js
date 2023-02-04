import React, { useState } from 'react';
import { useRouter } from 'next/router'
import { Form, Input, Button, Upload, Select, Alert, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import cookieManager from '../../src/managers/cookieManager';
import axios from 'axios';

function CreateCategoryForm (props) {
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

    async function onClose() {
        props.onChange();
    }

    function onRemove() {
        setImage(null);
    }

    async function onFinish(values) {
        let uniqName = true;
        props.categories.forEach(element => {
            if(element.name == values.name){
                uniqName = false
            }
        });

        if(uniqName) {
            let imageURL = '';
            if(image != null){ //creating image
                const config = {
                    headers: { 'content-type': 'multipart/form-data' },
                };
                const formData = new FormData();
                
                formData.append('image', image);
                try{
                    await axios.post('https://api.imgbb.com/1/upload?key=d42f9350d06e01de27700edc3831d61c', formData, config)
                    .then(res => imageURL = res.data.data.display_url);
                } catch{
                    router.reload(window.location.pathname);
                }
            } 

            let token;
            if (typeof window !== "undefined") {
                token = cookie.getCookie('auth_token');
            } 

            let body;
            if(values.parent == "none"){
                body = {
                    name: values.name,
                    image: imageURL
                }
            }else{
                body = {
                    name: values.name,
                    image: imageURL,
                    parent: values.parent
                }
            }
            

            const config = {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
        }

        await axios.post('https://hilal-taraz.kz/api/category', body, config);

        props.onChange();
        } else{
            setTrigger(true);
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
        style={{position:"relative", top:"-10%"}}
        closable
      />
    }else{
        return (
            <Form
            style={{width:'500px',position:"relative", top:'-10%'}}
            labelCol= {{ span: 10 }}
            wrapperCol= {{ span: 20 }}
            onFinish={onFinish}
            size='large'
            >   
                <Form.Item name="name" label="Название" rules={[{ required: true, message: 'Введите название категории!' }]}>
                    <Input maxLength={20}/>
                </Form.Item>
                <Form.Item label="Родительская категория" name="parent" rules={[{ required: true, message: 'Выбрите родительскую категорию!' }]}>
                    <Select>
                    {props.categories.map((category) => (              
                        category.name == 'Кухня' || category.name == "Бар" ? <Select.Option key={category.id} value={category.id}>{category.name}</Select.Option>: console.log(1)
                    ))}
                     </Select>
                </Form.Item>
                
                <Form.Item
                    name="upload" 
                    label="Загрузить изображение"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    >
                    <Upload maxCount={1} listType="picture-card" action={'/'} onRemove={onRemove}>
                        <Button icon={<UploadOutlined />}></Button>
                    </Upload>
                </Form.Item>
    
                <Form.Item >
                    <Button type="primary" htmlType='submit'>Создать</Button>
                    <Button style={{marginLeft: 20}} onClick={onClose}>Отмена</Button>
                </Form.Item>
            </Form>
        );
    } 
};

export default CreateCategoryForm;
