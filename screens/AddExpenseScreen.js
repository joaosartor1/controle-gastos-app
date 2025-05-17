import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebase';

export default function AddExpenseScreen() {
    const navigation = useNavigation();

    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        if (!description || !value) {
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }

        const numericValue = parseFloat(value.replace(',', '.'));
        if (isNaN(numericValue) || numericValue <= 0) {
            Alert.alert('Erro', 'Valor inválido');
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            Alert.alert('Erro', 'Usuário não autenticado');
            return;
        }

        setLoading(true);

        try {
            await addDoc(collection(db, 'expenses'), {
                uid: user.uid,
                description,
                value: numericValue,
                date,
            });

            navigation.navigate('Home');
        } catch (error) {
            console.log('Erro ao salvar gasto:', error);
            Alert.alert('Erro ao salvar gasto', error.message);
        } finally {
            setLoading(false);
        }
    };

    const showDatePicker = () => setShowPicker(true);
    const onChangeDate = (_, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowPicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Novo Gasto</Text>

            <TextInput
                style={styles.input}
                placeholder="Descrição"
                placeholderTextColor="#999"
                value={description}
                onChangeText={setDescription}
            />

            <View style={styles.inputWithSymbol}>
                <Text style={styles.symbol}>R$</Text>
                <TextInput
                    style={styles.valueInput}
                    placeholder="0,00"
                    placeholderTextColor="#999"
                    value={value}
                    onChangeText={setValue}
                    keyboardType="numeric"
                />
            </View>

            <TouchableOpacity style={styles.input} onPress={showDatePicker}>
                <Text style={{ color: '#333' }}>{date.toLocaleDateString('pt-BR')}</Text>
            </TouchableOpacity>

            {showPicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                />
            )}

            <TouchableOpacity style={styles.button} onPress={handleAdd} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Salvando...' : 'Salvar Gasto'}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 48,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#ff6600',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        height: 48,
        borderColor: '#ff6600',
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 12,
        justifyContent: 'center',
        marginBottom: 16,
        backgroundColor: '#fff9f4',
        color: '#333',
        fontWeight: '600',
    },
    inputWithSymbol: {
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ff6600',
        borderRadius: 6,
        paddingHorizontal: 12,
        marginBottom: 16,
        backgroundColor: '#fff9f4',
    },
    symbol: {
        fontSize: 16,
        color: '#ff6600',
        marginRight: 4,
        fontWeight: '700',
    },
    valueInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
    },
    button: {
        backgroundColor: '#ff6600',
        paddingVertical: 14,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 12,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
});
