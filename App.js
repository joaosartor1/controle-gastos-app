import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';

import AccountScreen from './screens/AccountScreen';
import AddExpenseScreen from './screens/AddExpenseScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import EditExpenseScreen from './screens/EditExpenseScreen';

const Stack = createNativeStackNavigator();

const bancoInterLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',          // fundo branco
    card: '#FFFFFF',                // header branco
    text: '#222222',                // texto escuro
    primary: '#ff6600',             // verde Banco Inter
    border: '#E0E0E0',              // bordas suaves
    notification: '#007A3D',        // verde mais escuro para notificações
  },
};

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <NavigationContainer theme={bancoInterLightTheme}>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: bancoInterLightTheme.colors.card,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
              borderBottomWidth: 1,
              borderBottomColor: bancoInterLightTheme.colors.border,
            },
            headerTintColor: bancoInterLightTheme.colors.primary,
            headerTitleStyle: {
              fontWeight: '600',
            },
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Criar Conta' }} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Recuperar Senha' }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Gastos' }} />
          <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: 'Novo Gasto' }} />
          <Stack.Screen name="Account" component={AccountScreen} options={{ title: 'Minha Conta' }} />
          <Stack.Screen name="EditExpense" component={EditExpenseScreen} options={{ title: "Editar Gasto" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
