import React, { useState } from 'react';
import { useRouter } from 'next/router'
import { Form, Input, Button, Upload, Select, Alert, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import cookieManager from '../../src/managers/cookieManager';
import axios from 'axios';

const { TextArea } = Input;

function EditProd (props) {
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

    function onClose() {
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
                await axios.post('https://vkus-vostoka.kz/api/uploads', formData, config);

                imageURL = image.name;
                console.log(imageURL)
            } 

            const id = props.selectedProd.id;

            let token;
            if (typeof window !== "undefined") {
                token = cookie.getCookie('auth_token');
            } 
            
            let body;
            if(image != null){
                body = {
                    name: values.name,
                    image: imageURL,
                    desc: values.desc,
                    price: values.price,
                    parent: values.parent
                }
            } else{
                body = {
                    name: values.name,
                    desc: values.desc,
                    price: values.price,
                    parent: values.parent
                }
    
            }
            
            const config = {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }
            await axios.put(`https://vkus-vostoka.kz/api/prods?id=${id}`, body, config);
            router.reload(window.location.pathname);
            props.onChange(); 
    }
        return (
            <Form
            style={{width:'450px',position:"absolute", left: "40%", top:'30%'}}
            labelCol= {{ span: 6.5 }}
            wrapperCol= {{ span: 20 }}
            onFinish={onFinish}
            size='large'
            >   <h1 style={{fontSize:'21px', marginBottom:20}}>Редактирование продукции "{props.selectedProd.name}"</h1>
                <Form.Item name="name" label="Название" initialValue={props.selectedProd.name} rules={[{ required: true, message: 'Введите новое название!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="price" label="Цена" initialValue={props.selectedProd.price} rules={[{ required: true, message: 'Выбрите новую цену!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="desc" label="Описание" initialValue={props.selectedProd.desc} rules={[{ required: true, message: 'Выбрите новое описание!' }]}>
                    <TextArea />
                </Form.Item>
                <Form.Item
                    name="upload" 
                    label="Загрузить новое изображение"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}>
                    <Upload maxCount={1} listType="picture-card" action={'/'} onRemove={onRemove} >
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

export default EditProd;
