import React, { useState  } from 'react';
import { useRouter } from 'next/router'
import { Form, Input, Button, Upload, Image, InputNumber, Modal } from 'antd';
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import cookieManager from '../../src/managers/cookieManager';
import ImageManager from '../../src/managers/imageManager';
import axios from 'axios';

const { confirm } = Modal;
const { TextArea } = Input;

function useForceUpdate(){
    const [value, setValue] = useState(0); 
    return () => setValue(value => value + 1); 
}

function EditProd (props) {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
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
            const id = props.selectedProd.id;

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

            await axios.put(`https://hilal-taraz.kz/api/prods?id=${id}`, body, config);
            props.selectedProd.image = ""; 
            forceUpdate()
              
          },
      
          onCancel() {
            console.log('Cancel');
          },
        });
      };

    async function onFinish(values) {
            let imageURL = 'https://imagesmenubucket.s3.amazonaws.com/images/';
            if(image != null){ //creating image
                const config = {
                    headers: { 'content-type': 'multipart/form-data' },
                };
                const formData = new FormData();
                
                formData.append('image', image);
                try{
                    const res = ImageManager.uploadImage(image, image.name)
                    imageURL += encodeURIComponent(image.name)
                } catch{
                    router.reload(window.location.pathname);
                }
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

           const res = await axios.put(`https://hilal-taraz.kz/api/prods?id=${id}`, body, config);

           if(res.status == 200) {
            setLoading(false)
            props.onChange(); 
           } else{
            setLoading(true)
           }
            
    }
        return (
            <Form
            style={{width:'500px',position:"relative", top:'-10%'}}
            labelCol= {{ span: 10 }}
            wrapperCol= {{ span: 20 }}
            onFinish={onFinish}
            size='large'
            form={form}
            initialValues={{name:props.selectedProd? props.selectedProd.name : ''}}
            >  
                <Form.Item name="name" label="Название"  rules={[{ required: true, message: 'Введите новое название!' }]}>
                    <Input maxLength={37}/>
                </Form.Item>
                <Form.Item name="price" label="Цена" initialValue={props.selectedProd? props.selectedProd.price : ''} rules={[{ required: true, message: 'Выбрите новую цену!' }]}>
                    <InputNumber />
                </Form.Item>
                <Form.Item name="desc" label="Описание" initialValue={props.selectedProd? props.selectedProd.desc : ''} rules={[{ required: true, message: 'Выбрите новое описание!' }]}>
                    <TextArea />
                </Form.Item>
                <Form.Item name="image" label="Текущее изображение">
                    {props.selectedProd.image != '' ? <><Image width={200} src={props.selectedProd? props.selectedProd.image: ''} /> <Button type="danger" size={'small'}onClick={() => {showDeleteConfirm()}}>Удалить</Button></>: 'Нет фотографии.'}
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
                    <Button type="primary" htmlType='submit' loading={loading}>Сохранить</Button>
                    <Button style={{marginLeft: 20}} onClick={onClose}>Отмена</Button>
                </Form.Item>
            </Form>
        );
    } 

export default EditProd;
