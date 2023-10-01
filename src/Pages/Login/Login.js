import React from 'react';
import { Form, Input, Button, Row, Col, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, setDoc, collection ,addDoc} from 'firebase/firestore';
import db  from '..//../Services/firebase'

const Login = () => {
    const navigate = useNavigate(); 
  const onFinish = (values) => {
    console.log('Valores do formulário:', values);
  };

  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if(user){
        const clientCollectionRef = collection(db, 'ClientCollection');     
        const clientDocRef = doc(clientCollectionRef, user.uid); 
        const usersCollectionRef = collection(clientDocRef, 'UsersCollection');
        const userData = {
          name: user.displayName,
          userId: user.uid         
        };
        await addDoc(usersCollectionRef, userData);
        localStorage.setItem('user', JSON.stringify(user));
       
        navigate(`/Calendar`);
      }
      // Você pode redirecionar o usuário para a próxima página ou executar ações adicionais aqui.
    } catch (error) {
      console.error('Erro ao fazer login com o Google:', error);
    }
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}
    >
      <Col xs={22} sm={16} md={12} lg={8}>
        <Card title="Login" style={{ borderRadius: '8px' }}>
          <Form
            name="login-form"
            onFinish={onFinish}
            layout="vertical"
            initialValues={{ remember: true }}
          >
            <Form.Item
              name="username"
              label="Nome de usuário"
              rules={[{ required: true, message: 'Digite seu nome de usuário!' }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Nome de usuário"
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="Senha"
              rules={[{ required: true, message: 'Digite sua senha!' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Senha"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: '100%' }}
              >
                Entrar
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="default"
                onClick={handleGoogleLogin}
                style={{ width: '100%' }}
              >
                Entrar com o Google
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
