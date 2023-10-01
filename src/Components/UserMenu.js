import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import db from '../Services/firebase'; 

const UserMenu = ({ user, onLogout }) => {
  const handleMenuClick = (e) => {
    if (e.key === 'logout') {
      onLogout();
    }
    if(e.key ==='shared'){
        gerarLinkCompartilhamento();
    }
  };

  const gerarLinkCompartilhamento = () => {
    // Suponha que você tenha informações como userId e documentId disponíveis
    const userId = 'ID_DO_USUÁRIO'; // Substitua pelo ID do usuário
    const documentId = 'ID_DO_DOCUMENTO'; // Substitua pelo ID do documento
  
    // Montar o URL de compartilhamento
    const linkCompartilhamento = `${window.location.host}/shared/${user.uid}`;
  
    // Criar um elemento de input temporário para copiar o texto para a área de transferência
    const inputElement = document.createElement('input');
    inputElement.value = linkCompartilhamento;
  
    // Adicionar o elemento à página, selecioná-lo e copiar o texto
    document.body.appendChild(inputElement);
    inputElement.select();
    document.execCommand('copy');
  
    // Remover o elemento de input temporário
    document.body.removeChild(inputElement);
  
    // Ação bem-sucedida, você pode exibir uma mensagem de sucesso
    console.log('Link copiado para a área de transferência: ', linkCompartilhamento);
  };
  

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
    <Dropdown overlay={menu} trigger={['click']}>
      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
        {user.displayName} <DownOutlined />
      </a>
    </Dropdown>
  );
};

export default UserMenu;
