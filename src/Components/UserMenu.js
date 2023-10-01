import React, { useState, useEffect } from 'react';
import { Menu, Dropdown ,Modal,Button,Input } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import db from '../Services/firebase'; 

const UserMenu = ({ user, docRef, onLogout }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [linkCompartilhamento, setLinkCompartilhamento] = useState('');
  const handleMenuClick = (e) => {
    if (e.key === 'logout') {
      onLogout();
    }
    if(e.key ==='shared'){
        gerarLinkCompartilhamento();
    }
  };

  const gerarLinkCompartilhamento = () => {

  
    // Montar o URL de compartilhamento
    console.log(docRef)
    const linkCompartilhamento = `${window.location.host}/shared/${docRef.id}`;
  
    // Criar um elemento de input temporário para copiar o texto para a área de transferência
    const inputElement = document.createElement('input');
    inputElement.value = linkCompartilhamento;
  
    // Adicionar o elemento à página, selecioná-lo e copiar o texto
    document.body.appendChild(inputElement);
    inputElement.select();
    document.execCommand('copy');
  
    // Remover o elemento de input temporário
    document.body.removeChild(inputElement);

    setLinkCompartilhamento(linkCompartilhamento);

    // Defina a visibilidade da modal como verdadeira
    setModalVisible(true);
  
    // Ação bem-sucedida, você pode exibir uma mensagem de sucesso
    console.log('Link copiado para a área de transferência: ', linkCompartilhamento);
  };
  

  const modal = (
    <Modal
      title="Link de Compartilhamento"
      visible={modalVisible}
      onCancel={() => setModalVisible(false)}
      footer={[
        <Button key="fechar" onClick={() => setModalVisible(false)}>
          Fechar
        </Button>,
        <Button
          key="copiar"
          type="primary"
          onClick={() => {
            const inputElement = document.createElement('input');
            inputElement.value = linkCompartilhamento;
            document.body.appendChild(inputElement);
            inputElement.select();
            document.execCommand('copy');
            document.body.removeChild(inputElement);
            setModalVisible(false);
          }}
        >
          Copiar
        </Button>,
      ]}
    >
      <p>Link de Compartilhamento:</p>
      <Input  type="text" value={linkCompartilhamento} readOnly />
    </Modal>
  );


  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile">Perfil</Menu.Item>
      <Menu.Item key="settings">Configurações</Menu.Item>
      <Menu.Item key="shared">Compartilhar</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">Sair</Menu.Item>
    </Menu>
  );

  return (
    <>
    <Dropdown overlay={menu} trigger={['click']}>
      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
        {user.displayName} <DownOutlined />
      </a>
    </Dropdown>

{modal}
</>
  );
};

export default UserMenu;
