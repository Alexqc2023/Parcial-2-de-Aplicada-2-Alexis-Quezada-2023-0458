import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { registrarUsuario } from "../services/api";

function Registro() {
  const [nombre, setNombre] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const router = useRouter();

  const guardar = async () => {
    if (!nombre || !email || !password) {
      Alert.alert("AVISO", " De llenar todos los campos son obligatorios");
      return;
    }

    try {
      const nuevoUsuario = {
        nombre: nombre,
        email: email,
        password: password
      };

      await registrarUsuario(nuevoUsuario);
      Alert.alert("Exito", "Usuario registrado de forma correctab");


      router.replace("/");

    } catch (error) {

      const mensaje = error.response?.data?.error || error.response?.data?.message || "No se pudo completar el registro";
      
      Alert.alert("Error al registrar usuario ", mensaje);
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Registrar Cuenta</Text>

      <Text style={styles.label}>Nombre Completo</Text>
      <TextInput
        style={styles.input}

        placeholder="Tu nombre"

        value={nombre}

        onChangeText={setNombre}
      />

      <Text style={styles.label}>Correo Electronico</Text>
      <TextInput
        style={styles.input}

        placeholder="MI@correo.com"

        value={email}

        onChangeText={setEmail}

        autoCapitalize="none"

        keyboardType="email-address"
      />

      <Text style={styles.label}>Contrasena</Text>
      <TextInput
        style={styles.input}


        placeholder="Contrasena"

        value={password}

        onChangeText={setPassword}

        secureTextEntry
      />

      <TouchableOpacity style={styles.botonGuardar} onPress={guardar}>
        <Text style={styles.textoBoton}>Guardar Registro</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f5f5f5"
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333"
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 15
  },
  botonGuardar: {
    backgroundColor: "#198754",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 5
  },
  textoBoton: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  }
});

export default Registro;