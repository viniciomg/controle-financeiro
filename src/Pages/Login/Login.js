import React, { useRef } from 'react';
import { Form, Input, Button, Row, Col, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, setDoc, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import db from '..//../Services/firebase'

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
      if (user) {
        const documents = [];
        const snpashot = await getDocs(query(collection(db, "ClientCollection")));
        for (const doc of snpashot.docs) {
          const userRef = collection(doc.ref, 'UsersCollection');
          const userQuery = query(userRef, where('userId', '==', user.uid))
          const userQuerySnapshot = await getDocs(userQuery);
          if (!userQuerySnapshot.empty) {
            documents.push({
              clientId: doc.id,
              ...doc.data(),
            });
          }
        }
        if(documents.length ==0){
          const clientDocRef = await addDoc(collection(db, "ClientCollection"), {
            email: user.email,
          });
          const usersCollectionRef = collection(clientDocRef, 'UsersCollection');
          const userData = {
            name: user.displayName,
            userId: user.uid
          };
          await addDoc(usersCollectionRef, userData)
        }
        localStorage.setItem('user', JSON.stringify(user));
        const year= new Date().getFullYear()
        const month = new Date().getMonth();
        navigate(`/AppLancar/${year}/${month}`);
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
