import React, { useState } from "react";

import { 
  Modal, 
  TouchableWithoutFeedback, 
  Keyboard,
  Alert 
} from "react-native";

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from 'react-native-uuid';

import { useForm } from 'react-hook-form';
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../hooks/auth";

import { InputForm } from "../../components/Form/InputForm";
import { Button } from "../../components/Form/Button";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";

import { CategorySelect } from '../CategorySelect';

import { 
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionTypes,
} from './styles';


interface FormData {
  [name: string]: any;
}

const schema = Yup.object().shape({
  name: Yup
  .string()
  .required('Nome é obrigatório!'),
  amount: Yup
  .number()
  .typeError('Informe um valor numérico!')
  .positive('O valor não pode ser negativo!')
  .required('O valor é obrigatório!')
});

export function Register({navigation}: {navigation: any}){
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    const { user } = useAuth();

    const [category, setCategory] = useState({
      key:'category',
      name: 'Categoria'
    });

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors }
    } = useForm({
      resolver: yupResolver(schema)
    });

    function handleTransactionTypesSelect(type: 'positive' | 'negative'){
      setTransactionType(type);
    }

    function handleOpenSelectCategoryModal(){
      setCategoryModalOpen(true);
    }

    function handleCloseSelectCategoryModal(){
      setCategoryModalOpen(false);
    } 

    async function handleSubmitRegister(form: FormData) { 
      if(!transactionType) {
        return Alert.alert('Selecione o tipo de transação');
      }
  
      if(category.key === 'category') {
        return Alert.alert('Selecione a categoria');
      }
  
      const newTransaction = {
        id: String(uuid.v4()),
        name: form.name,
        amount: form.amount,
        type: transactionType,
        category: category.key,
        date: new Date()
      }

      try {
        const datakey = `@gofinances:transactions_user:${user.id}`;
        const data = await AsyncStorage.getItem(datakey); 
        const currentData = data ? JSON.parse(data) : [];  

        const dataFormatted = [
          ...currentData,
          newTransaction
        ];

        await AsyncStorage.setItem(datakey, JSON.stringify(dataFormatted));
        
        reset();
        setTransactionType ('');
        setCategory({
          key: 'category',
          name: 'Categoria'
        });

        navigation.navigate('Listagem');

      } catch (error) {
        console.log(error);
        Alert.alert("Não foi possível salvar");        
      }
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
        
          <Header>
              <Title>Cadastro</Title>
          </Header>

        <Form>
            <Fields>
                <InputForm 
                    name="name"
                    control={control}
                    placeholder="Nome" 
                    autoCapitalize="sentences"
                    autoCorrect={false}
                    error={errors.name && errors.name.message}
                /> 
                
                <InputForm 
                    name="amount"
                    control={control}
                    placeholder="Preço"
                    keyboardType="numeric" 
                    error={errors.amount && errors.amount.message}
                /> 

                <TransactionTypes>
                    <TransactionTypeButton
                      type="up"
                      title="Income"
                      onPress={() => handleTransactionTypesSelect('positive')}
                      isActive={transactionType === 'positive'}
                    />
                    <TransactionTypeButton
                      type="down"
                      title="Outcome"
                      onPress={() => handleTransactionTypesSelect('negative')}
                      isActive={transactionType === 'negative'}
                    />
                </TransactionTypes>

                <CategorySelectButton 
                title={category.name}
                onPress={handleOpenSelectCategoryModal}
                />
            </Fields>

            <Button 
            title='Enviar'
            onPress={handleSubmit(handleSubmitRegister)}
            />
        </Form>
            
        <Modal visible = {categoryModalOpen}>
          <CategorySelect 
            category= {category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>        
      </Container>
  </TouchableWithoutFeedback>
    );
}