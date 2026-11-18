import { Stack } from "expo-router";

function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Iniciar sesion", headerShown: false }} />
      
      <Stack.Screen name="registro" options={{ title: "Crear Cuenta", headerShown: false }} />
      
      
      <Stack.Screen 
        name="catalogo" 
        options={{ 
          title: "Vice City Motors", 
          headerBackVisible: false,
          headerShown: true
        }} 
      />
      
      
      <Stack.Screen name="detalle" options={{ title: "Detalle del vehiculo", headerShown: true }} />

      <Stack.Screen name="compras" options={{ title: "Mis Compras", headerShown: true }} />
    </Stack>
  );
}

export default Layout;