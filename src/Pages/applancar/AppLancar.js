import db from '../../Services/firebase'; // Importe o Firebase aqui
import React, { useState, useEffect } from 'react';
import { Popconfirm, Button, Layout, Row, Col, Card, Statistic, Table, Breadcrumb, Dropdown } from 'antd';
import ExpenseForm from '../../Components/ExpenseForm';
import SalaryForm from '../../Components/SalaryForm';
import UserMenu from '../../Components/UserMenu';
import { doc, onSnapshot, collection, query, where, deleteDoc, getDocs } from "firebase/firestore";
import { useParams, Link } from 'react-router-dom';
import { DeleteOutlined, UserOutlined, SettingOutlined, DownOutlined, AlignCenterOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';



import './AppLancar.css';

// Resto do seu código...

function AppLancar() {
    const navigate = useNavigate();
    const { year, month } = useParams();
    const [expenses, setExpenses] = useState([]);
    const [salary, setSalary] = useState(0);
    const [ClientDocRef, setClientDocRef] = useState(null);
    const { Header, Content } = Layout;

    const [userMenuVisible, setUserMenuVisible] = useState(false);
    const [user, setUser] = useState(null);

    // Adicione este código ao início do seu componente

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUser(user);
        }

    }, []);
    useEffect(() => {
        const fetchExpense = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                const q = query(collection(db, "ClientCollection"));
                const snp = await getDocs(q);
                const documents = [];
                for (const docRef of snp.docs) {
                    const usersCollectionRef = collection(docRef.ref, 'UsersCollection');
                    const userQuery = query(usersCollectionRef, where('userId', '==', storedUser.uid));
                    const userQuerySnapshot = await getDocs(userQuery);
                    if (!userQuerySnapshot.empty) {
                        documents.push({
                            clientId: docRef.id,
                            ...docRef.data(),
                        });
                    }
                }
                const clientCollectionRef = collection(db, 'ClientCollection');
                console.log(documents[0].clientId)
                const clientDocRef = doc(clientCollectionRef, documents[0].clientId);
                setClientDocRef(clientDocRef)
                const qS = query(collection(clientDocRef, 'expenses'));
                const unsubS = onSnapshot(qS, (querySnapshot) => {
                    const expensesData = querySnapshot.docs
                        .filter((doc) => {
                            const data = doc.data();
                            return data.year === year && data.month === month;
                        })
                        .map((doc) => ({
                            key: doc.id,
                            description: doc.data().description,
                            value: doc.data().value,
                            type: 'expense'
                        }));
                    console.log(expensesData)
                    setExpenses(expensesData);
                });
            } catch (error) {
                console.error('Erro ao buscar expenses:', error);
            }
        };

        fetchExpense();

    }, [user, year, month]);

    useEffect(() => {

        const fetchSalary = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                const q = query(collection(db, "ClientCollection"));
                const snp = await getDocs(q);
                const documents = [];
                for (const docRef of snp.docs) {
                    const usersCollectionRef = collection(docRef.ref, 'UsersCollection');
                    const userQuery = query(usersCollectionRef, where('userId', '==', storedUser.uid));
                    const userQuerySnapshot = await getDocs(userQuery);
                    if (!userQuerySnapshot.empty) {
                        documents.push({
                            clientId: docRef.id,
                            ...docRef.data(),
                        });
                    }
                }
                const clientCollectionRef = collection(db, 'ClientCollection');
                const clientDocRef = doc(clientCollectionRef, documents[0].clientId);
                setClientDocRef(clientDocRef)
                const qS = query(collection(clientDocRef, 'salary'));
                const unsubS = onSnapshot(qS, (querySnapshot) => {
                    const expensesData = querySnapshot.docs
                        .filter((doc) => {
                            const data = doc.data();
                            return data.year === year && data.month === month;
                        })
                        .map((doc) => ({
                            key: doc.id,
                            description: doc.data().description,
                            value: doc.data().value,
                            type: 'salary'
                        }));
                    console.log(expensesData)
                    setSalary(expensesData);
                });
            } catch (error) {
                console.error('Erro ao buscar expenses:', error);
            }
        };
        fetchSalary();

    }, [user, year, month])


    const handleAddExpense = (newExpense) => {
        setExpenses([...expenses, newExpense]);
    };


    const handleAddSalary = async (newsalary) => {
        setSalary([...salary, newsalary]);

    };

    useEffect(() => {
        const totalSalary = calculateTotalSalary();
    }, [salary]);

    const calculateTotalSalary = () => {
        return salary.length > 0
            ? salary.reduce((acc, salary) => acc + parseFloat(salary.value), 0)
            : 0;
    };

    useEffect(() => {
        const totalExpense = calculateTotalExpense();
    }, [expenses]);

    const calculateTotalExpense = () => {

        return expenses.length > 0
            ? expenses.reduce((acc, expense) => acc + parseFloat(expense.value), 0)
            : 0;
    };

    const totalSalary = calculateTotalSalary();
    const totalExpense = calculateTotalExpense();

    const handleDelete = async (recordKey, collectionName) => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const clientCollectionRef = collection(db, 'ClientCollection');
            const clientDocRef = doc(clientCollectionRef, ClientDocRef.id);
            const documentRef = doc(clientDocRef, collectionName, recordKey);
            await deleteDoc(documentRef);
        } catch (error) {
            console.error('Erro ao excluir lançamento:', error);
        }
    };


    const remainingBalance = totalSalary - totalExpense;

    const columns = [
        {
            title: 'Descrição',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Valor',
            dataIndex: 'value',
            key: 'value',
            render: (text) => <span>R$ {text}</span>,
        },
        {
            title: 'Ação',
            key: 'action',
            render: (text, record) => (
                <Popconfirm
                    title="Tem certeza de que deseja excluir?"
                    onConfirm={() => handleDelete(record.key, record.type)}
                    okText="Sim"
                    cancelText="Não"
                >
                    <Button type="danger" icon={<DeleteOutlined />} />
                </Popconfirm>
            ),
        },
    ];

    const items = [
        {
            key: 'Calendar',
            content: <Link to="/Calendar">Calendario</Link>,
        },
        {
            key: 'AppLancar',
            content: <Link to={`/AppLancar/${year}/${month}`}></Link>,
        },

    ];


    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate(`/`);
    };
    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril',
        'Maio', 'Junho', 'Julho', 'Agosto',
        'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];

      const nomeDoMes = meses[month - 1];

    return (
        <Layout>

            <Header span={12} className="header">
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={19}>
                        <div className="header-title">
                            <h1 style={{ color: 'white', margin: 0 }}>Controle de Despesas</h1>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={5}>
                        <div className="header-icons">
                            {user ? (
                                <UserMenu user={user} docRef={ClientDocRef} onLogout={handleLogout} />
                            ) : (
                                    <UserOutlined style={{ fontSize: '24px', marginLeft: '16px' }} />
                                )}
                            <SettingOutlined style={{ color: 'white', fontSize: '24px', marginLeft: '16px' }} />
                        </div>
                    </Col>

                </Row>

            </Header>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>
                    <Link to="/Calendar">Calendário</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to={`/AppLancar/${year}/${month}`}>Lançamentos</Link>
                </Breadcrumb.Item>
            </Breadcrumb>
            <h2 style={{textAlign:'center'}}>{nomeDoMes}/{year}</h2>
            <Content style={{ padding: '24px' }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={14}>
                        <Card title="Lançar receitas">
                            <SalaryForm year={year} month={month} user={user} docRef={ClientDocRef} onAddSalary={handleAddSalary} />
                        </Card>
                        <Card title="Lançar Despesas">
                            <ExpenseForm year={year} month={month} user={user} docRef={ClientDocRef} onAddExpense={handleAddExpense} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={10}>
                        <Card title="Salário e Saldo">
                            <Statistic title="Salário" value={totalSalary} prefix="R$" />
                            <Statistic
                                title="Total da Dívida"
                                value={totalExpense}
                                prefix="R$"
                            />
                            <Statistic
                                title="Saldo Restante"
                                value={remainingBalance}
                                prefix="R$"
                            />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={12}>
                        <Card title="Lista de receitas" style={{ marginTop: '20px' }}>
                            <Table dataSource={salary} columns={columns} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                        <Card title="Lista de Despesas" style={{ marginTop: '20px' }}>
                            <Table dataSource={expenses} columns={columns} />
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
}
export default AppLancar;
