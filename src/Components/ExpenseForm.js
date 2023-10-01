import React, { useState } from 'react';
import { getFirestore, collection, addDoc, doc } from 'firebase/firestore';

import { Form, Input, Button } from 'antd';
import db from '../Services/firebase'; // Importe o módulo de banco de dados
import { useParams } from 'react-router-dom';
const ExpenseForm = ({ year, month, user, onAddExpense }) => {
    const [expense, setExpense] = useState('');
    const [description, setDescription] = useState('');
    const handleAddExpense = async () => {
        try {

            const db = getFirestore();
            const uid = user.uid;
            const clientCollectionRef = collection(db, 'ClientCollection');
            const clientDocRef = doc(clientCollectionRef, uid);
            const ExpenseCollectionRef = collection(clientDocRef, 'expenses')
            const expenseData = {
                value: expense,
                description: description,
                year: year,
                month: month,
                userId: user.uid
            };
            const newExpenseRef = await addDoc(ExpenseCollectionRef, expenseData);

            const newExpense = {
                key: newExpenseRef.id,// Defina 'newExpense' com os dados da despesa
                value: expense,
                description: description,
                year: year,
                month: month,
                userId: user.uid,
                type: "expenses"
            };
            onAddExpense(newExpense);
            setExpense('');
            setDescription('');
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };
    return (
        <Form layout="inline">
            <Form.Item>
                <Input
                    placeholder="Descrição" // Adicione um campo de entrada para a descrição
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Form.Item>
            <Form.Item>
                <Input
                    placeholder="Despesa"
                    value={expense}
                    onChange={(e) => setExpense(e.target.value)}
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" onClick={handleAddExpense}>
                    Adicionar Despesa
        </Button>
            </Form.Item>
        </Form>
    );
};

export default ExpenseForm;
