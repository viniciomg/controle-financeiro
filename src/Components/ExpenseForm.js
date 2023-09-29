import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

import { Form, Input, Button } from 'antd';
import db from '../Services/firebase'; // Importe o módulo de banco de dados
import { useParams } from 'react-router-dom';
const ExpenseForm = ({ year, month, user }) => {
    const [expense, setExpense] = useState('');
    const [description, setDescription] = useState('');
    const handleAddExpense = async () => {
        try {
            console.log(user)
            // Acesse o Firestore usando getFirestore()
            const db = getFirestore();

            // Adicione a despesa à coleção 'expenses' no Firestore
            await addDoc(collection(db, "expenses"), {
                value: expense,
                description:description,
                year: year,
                month: month,
                userId: user.uid
            });
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
