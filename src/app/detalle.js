import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getVehiculoPorId, crearCompra } from "../services/api";

function Detalle() {
  const { id } = useLocalSearchParams();
  const [vehiculo, setVehiculo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  const cargarDetalle = async () => {
    try {
      const respuesta = await getVehiculoPorId(id);
      
    
      let datosVehiculo = respuesta;
      if (respuesta && respuesta.data) {
        datosVehiculo = respuesta.data;
      } else if (respuesta && respuesta.vehiculo) {
        datosVehiculo = respuesta.vehiculo;
      }

      setVehiculo(datosVehiculo);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar la informacion de este vehiculo");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (id) {
      cargarDetalle();
    }
  }, [id]);

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#0d6efd" />
        <Text style={{ marginTop: 10 }}>Cargando el vehiculo...</Text>
      </View>
    );
  }

  if (!vehiculo) {
    return (
      <View style={styles.centrado}>
        <Text>No se encontraron los datos del vehiculo que busca.</Text>
      </View>
    );
  }

  const disponible =
    typeof vehiculo.disponible === "boolean"
      ? vehiculo.disponible
      : (vehiculo.estado || "").toLowerCase() === "disponible";

  const confirmarCompra = () => {
    Alert.alert(
      "Confirmar Compra",
      `¿Comprar ${vehiculo.marca} ${vehiculo.modelo} por $${vehiculo.precio}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              await crearCompra(vehiculo.id);
              Alert.alert("Éxito", "Compra realizada exitosamente");
              
              router.replace("/compras");
            } catch (error) {
              const mensaje = error.response?.data?.error || error.response?.data?.message || "No se pudo realizar la compra";
              Alert.alert("Error en la compra", mensaje);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.contenedor}>
      <View style={styles.card}>
        
        <Text style={styles.titulo}>
          {vehiculo.marca} {vehiculo.modelo}
        </Text>
        
        <Text style={styles.dato}>Año: {vehiculo.anio || vehiculo.año || "N/A"}</Text>
        <Text style={styles.dato}>Precio: ${vehiculo.precio || 0}</Text>
        
        {vehiculo.color && <Text style={styles.dato}>Color: {vehiculo.color}</Text>}
        {vehiculo.descripcion && <Text style={styles.dato}>Descripción: {vehiculo.descripcion}</Text>}
        
        <Text style={[styles.dato, { marginTop: 10, fontWeight: "bold" }]}>
          Estado: {vehiculo.estado ? vehiculo.estado : (disponible ? "Disponible" : "No disponible")}
        </Text>

        {disponible && (
          <TouchableOpacity style={styles.botonComprar} onPress={confirmarCompra}>
            <Text style={styles.textoBoton}>Comprar Vehiculo</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  centrado: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 8, borderWidth: 1, borderColor: "#ddd" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  dato: { fontSize: 16, marginBottom: 8, color: "#333" },
  botonComprar: { backgroundColor: "#abef24", padding: 14, borderRadius: 6, alignItems: "center", marginTop: 20 },
  textoBoton: { color: "#fff", fontWeight: "bold", fontSize: 16 }
});

export default Detalle;