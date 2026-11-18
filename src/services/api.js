import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const linkAPI = "https://vicecity-motors-api.vercel.app";

async function sacarToken() {
    let t = await AsyncStorage.getItem("token");
    if (t != null) {
        return { Authorization: "Bearer " + t };
    }
    return {};
}

export async function registrarUsuario(data) {
    let req = await axios.post(linkAPI + "/auth/registro", data);
    return req.data;
}

export async function loginUsuario(data) {
    let req = await axios.post(linkAPI + "/auth/login", data);
    return req.data;
}

export async function getVehiculos() {
    let misHeaders = await sacarToken();
    let req = await axios.get(linkAPI + "/vehiculos", { headers: misHeaders });
    return req.data;
}

export async function getVehiculoPorId(id) {
    let misHeaders = await sacarToken();
    let req = await axios.get(linkAPI + "/vehiculos/" + id, { headers: misHeaders });
    return req.data;
}

export async function crearCompra(idVehiculo) {
    let misHeaders = await sacarToken();
    let body = {
        vehiculoId: Number(idVehiculo),
        metodoPago: "transferencia"
    };
    let req = await axios.post(linkAPI + "/ventas", body, { headers: misHeaders });
    return req.data;
}

export async function getMisCompras() {
    let misHeaders = await sacarToken();
    let req = await axios.get(linkAPI + "/ventas", { headers: misHeaders });
    return req.data;
}