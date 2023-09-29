import db from './firebase'; // Importe o Firebase aqui
import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Statistic, Table } from 'antd';
import ExpenseForm from './ExpenseForm';
import SalaryForm from './SalaryForm'
import { doc, onSnapshot, collection, query, where } from "firebase/firestore";

import './App.css';

// Resto do seu código...

function App() {
  const [expenses, setExpenses] = useState([]);
  const [salary, setSalary] = useState(0);
  const { Header, Content } = Layout;
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const q = query(collection(db, "expenses")); // Corrigido o nome da coleção
        const unsub = onSnapshot(q, (querySnapshot) => {
          const expensesData = querySnapshot.docs.map((doc) => ({ description: doc.data().description, value: doc.data().value }));

          setExpenses(expensesData);
        });
      } catch (error) {
        console.error('Erro ao buscar despesas:', error);
      }
    };

    fetchExpenses();
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {

        const qS = query(collection(db, "salary")); // Corrigido o nome da coleção
        const unsubS = onSnapshot(qS, (querySnapshot) => {
          const salaryData = querySnapshot.docs.map((doc) => ({ description: doc.data().description, value: doc.data().value }));

          setSalary(salaryData);
        });
      }
      catch (error) {
        console.error('Erro ao buscar salaruis:', error);
      }
    };

    fetchExpenses();
  }, [])


  const handleAddExpense = async (expense) => {
    setExpenses([...expenses, expense]);
    const expensesCollection = db.collection('expenses');
    await expensesCollection.add({ expense });
  };

  const handleAddSalary = async (salarys) => {
    setSalary([...salarys, salary]);
    const salaryCollection = db.collection('salary');
    await salaryCollection.add({ salary });
  };

  useEffect(() => {
    // Atualize totalExpense sempre que a lista de despesas mudar
    const totalSalary = calculateTotalSalary();
    // Faça o que você deseja com o totalExpense aqui, como armazená-lo em um estado.
  }, [salary]);

  const calculateTotalSalary = () => {
    return salary.length > 0
      ? salary.reduce((acc, expense) => acc + parseFloat(expense.value), 0)
      : 0;
  };

  useEffect(() => {
    // Atualize totalExpense sempre que a lista de despesas mudar
    const totalExpense = calculateTotalExpense();
    // Faça o que você deseja com o totalExpense aqui, como armazená-lo em um estado.
  }, [expenses]);

  const calculateTotalExpense = () => {

    return expenses.length > 0
      ? expenses.reduce((acc, expense) => acc + parseFloat(expense.value), 0)
      : 0;
  };

  const totalSalary = calculateTotalSalary();
  const totalExpense = calculateTotalExpense();


  const remainingBalance = totalSalary - totalExpense;
  const columns = [
    {
      title: 'Descrição',
      dataIndex: 'description', // Deve corresponder à chave no objeto de despesa
      key: 'description',
    },
    {
      title: 'Valor',
      dataIndex: 'value',
      key: 'value',
      render: (text) => <span>R$ {text}</span>,
    },
  ];

  return (
    <Layout>
      <Header span={12}>
        <h1 style={{ color: 'white', margin: 0 }}>Controle de Despesas</h1>
      </Header>
      <Content style={{ padding: '24px' }}>
        <Row gutter={16}>
          <Col span={14}>
            <Card title="Lançar receitas">
              <SalaryForm onAddSalary={handleAddSalary} />
            </Card>
            <Card title="Lançar Despesas">
              <ExpenseForm onAddExpense={handleAddExpense} />
            </Card>
          </Col>
          <Col span={10}>
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

        {/* Lista de despesas */}
        <Row>
          <Col span={12}>
            <Card title="Lista de receitas" style={{ marginTop: '20px' }}>
              <Table dataSource={salary} columns={columns} />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Lista de Despesas" style={{ marginTop: '20px' }}>
              <Table dataSource={expenses} columns={columns} />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
export default App;
