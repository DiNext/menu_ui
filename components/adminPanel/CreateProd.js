import React, { useState } from 'react';
import { useRouter } from 'next/router'
import { Form, Input, Button, Upload, Select, InputNumber } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import cookieManager from '../../src/managers/cookieManager';
import axios from 'axios';

function CreateProd (props) {
    const [image, setImage] = useState(null);

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
            let imageURL = '';
            if(image != null){ //creating image
                const config = {
                    headers: { 'content-type': 'multipart/form-data' },
                };
                const formData = new FormData();
                
                formData.append('theFiles', image);
                await axios.post('/api/uploads', formData, config);

                imageURL = image.name;
            } 

            let token;
            if (typeof window !== "undefined") {
                token = cookie.getCookie('auth_token');
            } 

            let parent;
            props.categories.forEach(element => {
                if(element.id == values.parent) parent = element
            });
            const body = {
                name: values.name,
                image: imageURL,
                parent: parent,
                desc: values.desc,
                price: values.price
            }

            const config = {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
        }

        await axios.post('https://vkus-vostoka.kz/api/prods', body, config);
        router.reload(window.location.pathname);
        props.onChange();

    }
        return (
            <Form
            style={{width:'450px',position:"absolute", left: "40%", top:'30%'}}
            labelCol= {{ span: 10 }}
            wrapperCol= {{ span: 20 }}
            onFinish={onFinish}
            size='large'
            >   <h1 style={{fontSize:'21px', marginBottom:20}}>Создание новой продукции</h1>
                <Form.Item name="name" label="Название" rules={[{ required: true, message: 'Введите название продукции!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="price" label="Цена" rules={[{ required: true, message: 'Введите цену!' }]}>
                    <InputNumber />
                </Form.Item>
                <Form.Item name="desc" label="Описание" rules={[{ required: true, message: 'Введите описание!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Родительская категория" name="parent" rules={[{ required: true, message: 'Выбрите родительскую категорию!' }]}>
                    <Select>
                    <Select.Option value="0">Нет</Select.Option>    
                    {props.categories.map((category) => (              
                        <Select.Option key={category.id} value={category.id}>{category.name}</Select.Option>
                    ))}
                     </Select>
                </Form.Item>
                
                <Form.Item
                    name="upload" 
                    label="Загрузить изображение"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}>
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

export default CreateProd;
