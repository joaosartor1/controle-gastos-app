import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    Modal
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';

export default function HomeScreen() {
    const navigation = useNavigation();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [valueFilter, setValueFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [filterVisible, setFilterVisible] = useState(false);

    const user = auth.currentUser;

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'expenses'),
            where('uid', '==', user.uid),
            orderBy('date', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date.toDate(),
            }));
            setExpenses(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Account")}> 
                        <Text style={{ marginRight: 16, color: '#ff6600', fontWeight: 'bold' }}>Conta</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLogout}>
                        <Text style={{ marginRight: 16, color: '#ff3b00', fontWeight: 'bold' }}>Sair</Text>
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.replace("Login");
        } catch (error) {
            console.error("Erro ao sair:", error);
        }
    };

    const filteredExpenses = expenses.filter((item) => {
        const matchesValue = valueFilter
            ? item.value >= parseFloat(valueFilter.replace('>', '').replace('<', '')) && valueFilter.includes('>')
              || item.value <= parseFloat(valueFilter.replace('>', '').replace('<', '')) && valueFilter.includes('<')
              || item.value === parseFloat(valueFilter)
            : true;

        const matchesDate = dateFilter
            ? format(item.date, 'yyyy-MM-dd').includes(dateFilter)
            : true;

        return matchesValue && matchesDate;
    });

    const totalValue = filteredExpenses.reduce((sum, item) => sum + item.value, 0).toFixed(2);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('EditExpense', { expenseId: item.id })}
            style={styles.cardTouchable}
        >
            <View style={styles.card}>
                <Text style={styles.date}>{format(item.date, 'dd/MM/yyyy')}</Text>
                <Text style={styles.description} numberOfLines={1}>{item.description}</Text>
                <Text style={styles.value}>R$ {item.value.toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Total de Gastos</Text>
                <Text style={styles.total}>R$ {totalValue}</Text>
            </View>

            <Modal
                visible={filterVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setFilterVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.filterTitle}>Filtros</Text>

                        <TextInput
                            style={styles.filterInput}
                            placeholder="Valor (ex: >50 ou <30)"
                            placeholderTextColor="#bbb"
                            value={valueFilter}
                            onChangeText={setValueFilter}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.filterInput}
                            placeholder="Data (ex: 2025-05)"
                            placeholderTextColor="#bbb"
                            value={dateFilter}
                            onChangeText={setDateFilter}
                        />

                        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(false)}>
                            <Text style={styles.filterButtonText}>Aplicar Filtros</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setValueFilter('');
                            setDateFilter('');
                        }}>
                            <Text style={styles.clearText}>Limpar filtros</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {loading ? (
                <ActivityIndicator size="large" color="#ff6600" />
            ) : (
                <FlatList
                    key="two-columns"
                    data={filteredExpenses}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                />
            )}

            <View style={styles.fabContainer}>
                <TouchableOpacity style={styles.filterFab} onPress={() => setFilterVisible(true)}>
                    <Text style={styles.fabText}>🔍</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddExpense')}>
                    <Text style={styles.fabText}>＋</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 48,
    },
    header: {
        marginBottom: 16,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        color: '#555',
        fontWeight: '600',
    },
    total: {
        fontSize: 32,
        fontWeight: '700',
        color: '#ff6600',
        marginTop: 8,
    },
    cardTouchable: {
        flex: 1,
        marginBottom: 16,
        marginHorizontal: 4,
        borderRadius: 4,
        overflow: 'hidden',
        maxWidth: '48%',
    },
    card: {
        backgroundColor: '#fff9f4',
        padding: 16,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ff6600',
        shadowColor: '#ff6600',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center',
        height: 130,
    },
    date: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ff6600',
        marginBottom: 8,
        textAlign: 'center',
    },
    description: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
        textAlign: 'center',
    },
    value: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ff6600',
        textAlign: 'center',
    },
    fabContainer: {
        position: 'absolute',
        flexDirection: 'row',
        right: 24,
        bottom: 32,
        gap: 12,
    },
    fab: {
        backgroundColor: '#ff6600',
        width: 56,
        height: 56,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
    },
    filterFab: {
        backgroundColor: '#ff3b00',
        width: 56,
        height: 56,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
    },
    fabText: {
        fontSize: 28,
        color: '#fff',
        marginBottom: 2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(255, 102, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        borderColor: '#ff6600',
        borderWidth: 1,
    },
    filterTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#ff6600',
        marginBottom: 16,
        textAlign: 'center',
    },
    filterInput: {
        backgroundColor: '#fff9f4',
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 12,
        color: '#333',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ff6600',
        fontSize: 16,
    },
    filterButton: {
        backgroundColor: '#ff6600',
        paddingVertical: 14,
        borderRadius: 4,
        alignItems: 'center',
    },
    filterButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    clearText: {
        color: '#999',
        textAlign: 'center',
        marginTop: 12,
        fontSize: 14,
        fontWeight: '600',
    },
});
