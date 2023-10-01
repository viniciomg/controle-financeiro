import React, { useState } from 'react';
import { getFirestore, collection, addDoc, doc } from 'firebase/firestore';
import { Form, Input, Button } from 'antd';
import db from '../Services/firebase'; // Importe o módulo de banco de dados

const SalaryForm = ({ year, month, user, onAddSalary,docRef }) => {
    const [salary, setSalary] = useState('');
    const [description, setDescription] = useState('');
    const handleAddSalary = async () => {
        try {
            const db = getFirestore();
            const uid = user.uid;
            const clientCollectionRef = collection(db, 'ClientCollection');
            const ExpenseCollectionRef = collection(docRef, 'salary')
            const expenseData = {
                value: salary,
                description: description,
                year: year,
                month: month,
            };
            const newSalaryDocRef = await addDoc(ExpenseCollectionRef, expenseData);

            const newSalary = {
                key: newSalaryDocRef.id, // Defina 'newExpense' com os dados da despesa
                value: salary,
                description: description,
                year: year,
                month: month,
                type: "salary"
            };
            onAddSalary(newSalary);
            setSalary('');
            setDescription('');

        } catch (e) {
            console.error("Error adding document: ", e);
        };
    }

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
                    placeholder="Receita"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                />
            </Form.Item>

            <Form.Item>
                <Button type="primary" onClick={handleAddSalary}>
                    Adicionar Receita
            </Button>
            </Form.Item>
        </Form>
    );
};
export default SalaryForm;
