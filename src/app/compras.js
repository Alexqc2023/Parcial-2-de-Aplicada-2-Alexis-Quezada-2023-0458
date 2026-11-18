import { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, Alert, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useFocusEffect } from "expo-router";
import { getMisCompras } from "../services/api";

function Compras() {
  const [compras, setCompras] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarCompras = async () => {
    setCargando(true);
    try {
      const respuesta = await getMisCompras();
      
    
      let listaCompras = [];

      if (Array.isArray(respuesta)) {
        listaCompras = respuesta;

      } else if (respuesta && Array.isArray(respuesta.data)) {
        listaCompras = respuesta.data;

      } else if (respuesta && Array.isArray(respuesta.ventas)) {
        listaCompras = respuesta.ventas;

      } else if (respuesta && Array.isArray(respuesta.compras)) {
         listaCompras = respuesta.compras;
      }

      setCompras(listaCompras);
    } catch (error) {
      Alert.alert("Error", "No se pudo obtener el historial de compras");
    } finally {
      setCargando(false);
    }
  };

  
  useFocusEffect(
    useCallback(() => {
      cargarCompras();
    }, [])
  );

  if (cargando) {
    return (
      <View style={styles.centrado}>

        <ActivityIndicator size="large" color="#d95808" />

        <Text style={{ marginTop: 10 }}>Cargando historial...</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      
      
      <TouchableOpacity style={styles.botonRecargar} onPress={cargarCompras}>
        <Text style={styles.textoBoton}>Actualizar Lista</Text>
      </TouchableOpacity>

      <FlatList
        data={compras}
        keyExtractor={(item) => String(item.id)}

        ListEmptyComponent={<Text style={styles.vacio}>No tienes compras registradas.</Text>}

        renderItem={({ item }) => {
          
          const nombreVehiculo = item.vehiculo

            ? `${item.vehiculo.marca} ${item.vehiculo.modelo}`

            : `Vehículo ID #${item.vehiculoId}`;
            
          const fecha = item.fecha || item.fechaVenta || item.createdAt || "";

          const monto = item.monto || item.precio || item.total || item.vehiculo?.precio || "No disponible";

          return (
            <View style={styles.card}>
              <Text style={styles.carro}>{nombreVehiculo}</Text>

              <Text style={styles.dato}>Fecha: {fecha ? String(fecha).split("T")[0] : "Reciente"}</Text>

              <Text style={styles.monto}>Monto: ${monto}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, padding: 15, backgroundColor: "#f5f5f5" },
  centrado: { flex: 1, justifyContent: "center", alignItems: "center" },
  botonRecargar: { backgroundColor: "#6c757d", padding: 10, borderRadius: 6, alignItems: "center", marginBottom: 15 },
  textoBoton: { color: "#fff", fontWeight: "bold" },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: "#ddd" },
  carro: { fontSize: 17, fontWeight: "bold", marginBottom: 5 },
  dato: { fontSize: 14, color: "#555" },
  monto: { fontSize: 16, fontWeight: "bold", color: "#d6e018", marginTop: 5 },
  vacio: { textAlign: "center", marginTop: 30, color: "#666" }
});

export default Compras;