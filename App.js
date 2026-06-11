import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';

// Criando os navegadores
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- 1. TELA HOME ---
function HomeScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simula carregamento de dados (UX: Loading)
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsEmpty(false); // Altere para true se quiser testar o estado Empty
      setData([{ id: '1' }]);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.statusText}>Carregando dados da Home...</Text>
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View style={styles.center}>
        <Text style={styles.statusText}>Nenhum dado encontrado por aqui. 🏜️</Text>
        <Button title="Atualizar" onPress={() => setIsLoading(true)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela Home</Text>
      <Text style={styles.subtitle}>Dados carregados com sucesso!</Text>
      <Button 
        title="Ir para Details (ID: 1)" 
        onPress={() => navigation.navigate('Details', { id: '1' })} 
      />
    </View>
  );
}

// --- 2. TELA DETAILS ---
function DetailsScreen({ route, navigation }) {
  const { id } = route.params || { id: 'Não informado' };
  const [isError, setIsError] = useState(true); // Começa em erro para simular UX
  const [isLoading, setIsLoading] = useState(false);

  const handleRetry = () => {
    setIsError(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Ops! Ocorreu um erro ao carregar. ❌</Text>
        <Button title="Tentar Novamente" onPress={handleRetry} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff0000" />
        <Text style={styles.statusText}>Recarregando detalhes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela Details</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>Parâmetro ID: {id}</Text>
      </View>
      <Button title="Voltar para Home" onPress={() => navigation.goBack()} />
    </View>
  );
}

// --- 3. STACK INTERNO DA HOME ---
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
      <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Detalhes' }} />
    </Stack.Navigator>
  );
}

// --- 4. TELA PROFILE ---
function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela Profile</Text>
      <Text style={styles.subtitle}>Configurações do usuário.</Text>
    </View>
  );
}

// --- 5. CONFIGURAÇÃO DO DEEP LINKING NO SNACK ---
const prefix = Linking.createURL('/');

const linking = {
  prefixes: [prefix, 'meuapp://'],
  config: {
    screens: {
      HomeTab: {
        screens: {
          Details: 'details/:id',
        },
      },
      ProfileTab: 'profile',
    },
  },
};

// --- 6. COMPONENTE PRINCIPAL ---
export default function App() {
  return (
    <NavigationContainer linking={linking} fallback={<Text>Carregando Link...</Text>}>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
        <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile', headerShown: true }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Estilos de UX
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  statusText: { marginTop: 10, fontSize: 16, color: '#333' },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center', marginBottom: 20 },
  card: { padding: 20, backgroundColor: '#fff', borderRadius: 8, elevation: 3, marginBottom: 20 },
  cardText: { fontSize: 18, fontWeight: '500' }
});
