import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";

export default function AppNavigator() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: true, title: "Gastos" }}
            />
            <Stack.Screen
                name="EditExpense"
                component={EditExpenseScreen}
                options={{ headerShown: true, title: "Editar Gasto" }}
            />
        </Stack.Navigator>

    )
}