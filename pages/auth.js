import { Form, Input, Button, Checkbox, Card } from 'antd';
import cookieManager from '../src/managers/cookieManager';
import axios from 'axios';
import { useRouter } from 'next/router';

function Auth () {
  const cookie = new cookieManager();
  const router = useRouter();

  async function onFinish  (values)  {
    await axios.post('https://pinta-taraz.kz/auth/login', {login: values.username, password: values.password})
         .then(res => cookie.setCookie('auth_token', res.data.data.token, 1));
    router.push('/adminPanel');
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
      <Card title="Авторизация" bordered={true} style={{width: '500px', height: '400px', position:'absolute', left:'35%', top: '20%'}}>
      <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      style={{width: '300px', height: '200px', position:'absolute', top: '30%'}}
    >
      <Form.Item
        label="Логин"
        name="username"
        rules={[{ required: true, message: 'Введите имя пользователя!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Пароль"
        name="password"
        rules={[{ required: true, message: 'Введите пароль!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Войти
        </Button>
      </Form.Item>
    </Form>
        </Card>
  );
};

export default Auth;
