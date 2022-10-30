import React, { useState } from 'react';
import { useRouter } from 'next/router'
import { Form, Input, Button, Upload, Alert, Space, Image, Modal } from 'antd';
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import cookieManager from '../../src/managers/cookieManager';
import axios from 'axios';

const { confirm } = Modal;

function useForceUpdate(){
    const [value, setValue] = useState(0); 
    return () => setValue(value => value + 1); 
}

function EditCategoryForm (props) {
    const [image, setImage] = useState(null);
    const [trigger, setTrigger] = useState(false);
    const [form] = Form.useForm();
    
    const router = useRouter()
    const cookie = new cookieManager();
    const forceUpdate = useForceUpdate();

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
    const showDeleteConfirm = () => {
        confirm({
          title: `Вы уверены что хотите удалить фотографию?`,
          icon: <ExclamationCircleOutlined />,
          content: '',
          okText: 'Ок',
          okType: 'danger',
          cancelText: 'Отмена',
      
          async onOk() {
            const id = props.selectedCategory.id;

            let token;
            if (typeof window !== "undefined") {
                token = cookie.getCookie('auth_token');
            } 
            
            const body = {
                image: ''
            }

            const config = {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }

            await axios.put(`https://duman-taraz.kz/api/category?id=${id}`, body, config);
            props.selectedCategory.image = ""; 
            forceUpdate()
            props.onChange()  
          },
      
          onCancel() {
            console.log('Cancel');
          },
        });
      };

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
                
                formData.append('image', image);
                
                try{
                    await axios.post('https://api.imgbb.com/1/upload?key=d42f9350d06e01de27700edc3831d61c', formData, config)
                    .then(res => imageURL = res.data.data.display_url);
                } catch{
                    router.reload(window.location.pathname);
                }
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
            await axios.put(`https://duman-taraz.kz/api/category?id=${id}`, body, config);

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
        style={{position:"relative", top:"-10%"}}
        closable
      />
    }
    else{
        return (
            <Form
            style={{width:500,position:"relative", top:'-20%'}}
            labelCol= {{ span: 10 }}
            wrapperCol= {{ span: 20 }}
            onFinish={onFinish}
            size='large'
            form={form}
            >   
                <Form.Item name="name" label="Новое название" rules={[{ required: true, message: 'Введите название категории!' }]} initialValue={props.selectedCategory.name}>
                    <Input  maxLength={20}/>
                </Form.Item>
                <Form.Item name="image" label="Текущее изображение">
                    {props.selectedCategory.image != '' ? <><Image width={200} src={props.selectedCategory? props.selectedCategory.image: ''} /> <Button type="danger" size={'small'}onClick={() => {showDeleteConfirm()}}>Удалить</Button></>: 'Нет фотографии.'}
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
                    <Button type="primary" htmlType='submit'>Сохранить</Button>
                    <Button style={{marginLeft: 20}} onClick={onClose}>Отмена</Button>
                </Form.Item>
            </Form>
        );
    } 
};

export default EditCategoryForm;
