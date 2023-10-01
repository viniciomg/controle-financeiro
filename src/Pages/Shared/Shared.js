import React, { useState } from 'react';
import { Card, Button, Form, Input } from 'antd';
import firebase from '../../Services/firebase';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection ,addDoc} from 'firebase/firestore';
import db  from '..//../Services/firebase'
import { useParams, useNavigate } from 'react-router-dom';




const ShareLinkRegistration = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '' });

  

  const createUserWithEmailAndPassword = async () => {
    const { email, password } = formData;
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      setUser(userCredential.user);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
    }
  };

  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if(user){
        localStorage.setItem('user', JSON.stringify(user))
        const clientCollectionRef = collection(db, 'ClientCollection');     
        const clientDocRef = doc(clientCollectionRef, userId); 
        
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
    <div>
      <Card title="Cadastro/Login para Acesso">
       
          <div>
            <p>Este é um link de compartilhamento Para acessar as informações de despesas do {user?.displayname}, faça o cadastro com o google</p>
            <Form>
              <Button onClick={handleGoogleLogin}>Login com Google</Button>
            </Form>
          </div>
       
      </Card>
    </div>
  );
};

export default ShareLinkRegistration;
