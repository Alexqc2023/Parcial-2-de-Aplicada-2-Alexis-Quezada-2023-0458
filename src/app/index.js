import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUsuario } from '../services/api';

export default function LoginScreen() {
    const [emailTxt, setEmailTxt] = useState("");
    const [passTxt, setPassTxt] = useState("");
    const [cargando, setCargando] = useState(false);
    
    const router = useRouter();

    useEffect(() => {
        async function verSiHaySesion() {
            let tokenGuardado = await AsyncStorage.getItem("token");
            if (tokenGuardado) {
                router.replace("/catalogo");
            }
        }
        verSiHaySesion();
    }, []);

    const btnLogin = async () => {
        if (cargando == true) return;
        
        if (emailTxt == "" || passTxt == "") {
            Alert.alert("Atencion", "pro favor de llenar todos los campos vacios que veas");
            return;
        }

        setCargando(true);
        try {
            let peticion = await loginUsuario({ email: emailTxt, password: passTxt });
            
        
            
            if (peticion.token) {
                await AsyncStorage.setItem("token", peticion.token);
                router.replace("/catalogo");
            }
        } catch (e) {
            let msjError = "Credenciales incorrectas";
            
            if (e.response && e.response.data && e.response.data.error) {
                msjError = e.response.data.error;
            }
            Alert.alert("Fallo el login", msjError);
        }
        setCargando(false);
    }

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.tituloApp}>Vice City Motors</Text>

            <Text style={styles.label}>Correo:</Text>
            <TextInput
                style={styles.cajaTexto}
                placeholder="ejemplo@correo.com"
                value={emailTxt}
                onChangeText={setEmailTxt}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <Text style={styles.label}>Clave:</Text>
            <TextInput
                style={styles.cajaTexto}
                placeholder="****"
                value={passTxt}
                onChangeText={setPassTxt}
                secureTextEntry={true}
            />

            <TouchableOpacity style={styles.btnAzul} onPress={btnLogin}>
                {cargando ? <ActivityIndicator color="white" /> : <Text style={styles.txtBtn}>Ingresar</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={{ marginTop: 20, alignItems: 'center' }} onPress={() => router.push("/registro")}>
                <Text style={{ color: "blue" }}>Registrar cuenta nueva</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, padding: 20, justifyContent: 'center' },
    tituloApp: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
    label: { fontSize: 15, marginBottom: 5 },
    cajaTexto: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 15, backgroundColor: 'white' },
    btnAzul: { backgroundColor: '#0d6efd', padding: 15, borderRadius: 5, alignItems: 'center' },
    txtBtn: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});