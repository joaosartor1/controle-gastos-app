import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function EditExpenseScreen({ route, navigation }) {
  const { expenseId } = route.params;
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const ref = doc(db, 'expenses', expenseId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setDescription(data.description);
          setValue(data.value.toString());
          setDate(new Date(data.date.seconds * 1000));
        } else {
          Alert.alert('Erro', 'Gasto não encontrado.');
          navigation.goBack();
        }
      } catch (error) {
        Alert.alert('Erro ao carregar', error.message);
      }
    };

    fetchExpense();
  }, []);

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, 'expenses', expenseId), {
        description,
        value: Number(value),
        date
      });
      Alert.alert('Sucesso', 'Gasto atualizado.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro ao atualizar', error.message);
    }
  };

  const handleDelete = async () => {
    Alert.alert('Confirmar exclusão', 'Deseja realmente excluir este gasto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          try {
            await deleteDoc(doc(db, 'expenses', expenseId));
            Alert.alert('Excluído', 'Gasto removido com sucesso.');
            navigation.goBack();
          } catch (error) {
            Alert.alert('Erro ao excluir', error.message);
          }
        }
      }
    ]);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Editar Gasto</Text>

        <Text style={styles.label}>Descrição:</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Ex: Mercado, Gasolina..."
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Valor:</Text>
        <View style={styles.inputWithSymbol}>
          <Text style={styles.symbol}>R$</Text>
          <TextInput
            style={styles.valueInput}
            value={value}
            onChangeText={setValue}
            keyboardType="numeric"
            placeholder="0,00"
            placeholderTextColor="#999"
          />
        </View>

        <Text style={styles.label}>Data:</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
          <Text style={{ color: '#333' }}>{date.toISOString().split('T')[0]}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Excluir Gasto</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ff6600',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ff6600',
    borderRadius: 6,
    padding: 12,
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
    marginTop: 16,
    elevation: 3,
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
