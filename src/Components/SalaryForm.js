import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { Form, Input, Button } from 'antd';
import db from '../Services/firebase'; // Importe o módulo de banco de dados

const SalaryForm = ({ year, month ,user}) => {
    const [salary, setSalary] = useState('');
    const [description, setDescription] = useState('');

    const handleAddSalary = async () => {
        try {
            // Acesse o Firestore usando getFirestore()
            const db = getFirestore();

            // Adicione a despesa à coleção 'expenses' no Firestore
            await addDoc(collection(db, "salary"), {
                value: salary,
                description: description,
                year: year,
                month: month,
                userId:user.uid
            });
            console.log("Document written");


            // Limpe o campo após a inserção
            setSalary('');
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
