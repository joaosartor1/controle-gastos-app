import { useNavigation } from '@react-navigation/native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { auth } from '../firebase';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Atenção', 'Por favor, informe o e-mail cadastrado');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Sucesso', 'Link para redefinir a senha enviado para seu e-mail.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.box}>
        <Text style={styles.title}>Redefinição de Senha</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#b3774a"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Enviando...' : 'Enviar link de redefinição'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Voltar para login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff9f4',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  box: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 8,
    shadowColor: '#ff6600',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ff6600',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderColor: '#ff6600',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fff9f4',
    color: '#333',
  },
  button: {
    backgroundColor: '#ff6600',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  link: {
    color: '#0a84ff',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});
