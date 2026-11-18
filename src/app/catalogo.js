import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getVehiculos } from '../services/api';

export default function CatalogoVehiculos() {
    const [datos, setDatos] = useState([]);
    const [filtroDisp, setFiltroDisp] = useState(false);
    const router = useRouter();

    const cargarDatos = async () => {
        try {
            let res = await getVehiculos();
            
            
            let arregloAux = [];
            
            if (Array.isArray(res)) {
                arregloAux = res;
            } else if (res && res.data) {
                arregloAux = res.data;
            } else if (res && res.vehiculos) {
                arregloAux = res.vehiculos;
            }

            setDatos(arregloAux);
        } catch (error) {
            Alert.alert("Aviso", "No pudimos cargar la lista de vehiculos.");
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const logout = async () => {
        await AsyncStorage.removeItem("token");
        router.replace("/");
    }

    
    const verSiTaDisponible = (obj) => {
        if (typeof obj.disponible === 'boolean') {
            return obj.disponible;
        }
        if (obj.estado) {
            if (obj.estado.toLowerCase() == "disponible") {
                return true;
            } else {
                return false;
            }
        }
        return true; 
    }

    let listaParaMostrar = datos;
    if (filtroDisp == true) {
        listaParaMostrar = datos.filter((carro) => verSiTaDisponible(carro));
    }

    return (
        <View style={styles.pantalla}>
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.btnInfo} onPress={() => router.push("/compras")}>
                    <Text style={styles.txtB}>Ver mis compras</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnDanger} onPress={logout}>
                    <Text style={styles.txtB}>Cerrar Sesion</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.btnGris} onPress={() => setFiltroDisp(!filtroDisp)}>
                <Text style={styles.txtB}>
                    {filtroDisp ? "Viendo solamente Disponibles" : "Ver todos los vehiculos"}
                </Text>
            </TouchableOpacity>

            <FlatList
                data={listaParaMostrar}
                keyExtractor={(x) => String(x.id)}
                onRefresh={cargarDatos}
                refreshing={false}
                ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>Nada por aqui.</Text>}
                renderItem={({ item }) => {
                    let disponible = verSiTaDisponible(item);
                    return (
                        <TouchableOpacity style={styles.tarjeta} onPress={() => router.push({ pathname: "/detalle", params: { id: item.id } })}>
                            <Text style={styles.nombre}>{item.marca} {item.modelo}</Text>
                            <Text>Año: {item.anio || item.año}</Text>
                            <Text style={styles.dinero}>Precio: ${item.precio}</Text>
                            <Text style={{ color: disponible ? 'green' : 'red', marginTop: 5, fontWeight: 'bold' }}>
                                Estado: {item.estado ? item.estado : (disponible ? "Disponible" : "Vendido")}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    pantalla: { flex: 1, padding: 15 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    btnInfo: { backgroundColor: '#0d6efd', padding: 10, borderRadius: 5 },
    btnDanger: { backgroundColor: 'red', padding: 10, borderRadius: 5 },
    btnGris: { backgroundColor: 'gray', padding: 12, borderRadius: 5, alignItems: 'center', marginBottom: 15 },
    txtB: { color: 'white', fontWeight: 'bold' },
    tarjeta: { backgroundColor: 'white', padding: 15, marginBottom: 10, borderRadius: 8, elevation: 2 },
    nombre: { fontSize: 18, fontWeight: 'bold' },
    dinero: { fontSize: 16, color: 'blue', marginTop: 4 }
});