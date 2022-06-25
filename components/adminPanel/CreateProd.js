import React, { useState } from 'react';
import { useRouter } from 'next/router'
import { Form, Input, Button, Upload, Select, InputNumber } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import cookieManager from '../../src/managers/cookieManager';
import axios from 'axios';
import TextArea from 'antd/lib/input/TextArea';

function CreateProd (props) {
    const [image, setImage] = useState(null);
    const router = useRouter()
    const cookie = new cookieManager();
    const [form] = Form.useForm();
    
    form.resetFields()

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
                
                formData.append('image', image);
                
                try{
                    await axios.post('https://api.imgbb.com/1/upload?key=8b2b93aaf0b8e6ca1e7c94a10f33ac2d', formData, config)
                    .then(res => imageURL = res.data.data.display_url);
                } catch{
                    router.reload(window.location.pathname);
                }
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

        props.onChange();

    }  
        return (
            <Form
            style={{width:'500px',position:"relative", top:'-10%'}}
            labelCol= {{ span: 10 }}
            wrapperCol= {{ span: 20 }}
            onFinish={onFinish}
            size='large'
            form={form}
            initialValues={{parent:props.selectedCategory[0] != undefined?props.selectedCategory[0].id: ''}}
            > 
                <Form.Item name="name" label="Название" rules={[{ required: true, message: 'Введите название продукции!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="price" label="Цена" rules={[{ required: true, message: 'Введите цену!' }]}>
                    <InputNumber />
                </Form.Item>
                <Form.Item name="desc" label="Описание" rules={[{ required: true, message: 'Введите описание!' }]}>
                    <TextArea />
                </Form.Item>
                <Form.Item label="Родительская категория" name="parent" rules={[{ required: true, message: 'Выбрите родительскую категорию!' }]}>
                    <Select 
                    showSearch 
                    autoClearSearchValue={true}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>   
                    {props.categories.map((category) => (              
                        category.name != 'Бар' && category.name != "Кухня" ? <Select.Option key={category.id} value={category.id}>{category.name}</Select.Option> : console.log(1) 
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
    
                <Form.Item style={{marginLeft:206}}>
                    <Button type="primary" htmlType='submit'>Создать</Button>
                    <Button style={{marginLeft: 20}} onClick={onClose}>Отмена</Button>
                </Form.Item>
            </Form>
        );
    } 

export default CreateProd;
