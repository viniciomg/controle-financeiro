import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const UserMenu = ({ user, onLogout }) => {
  const handleMenuClick = (e) => {
    if (e.key === 'logout') {
      onLogout();
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile">Perfil</Menu.Item>
      <Menu.Item key="settings">Configurações</Menu.Item>
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
