import AsyncStorage from "@react-native-async-storage/async-storage";

export default class Database {
    static async save(key, value) {
        try {
            await AsyncStorage.setItem(key, value)
        } catch (e) {
            return e;
        }
    }

    static async load(key) {
        try {
            const value = await AsyncStorage.getItem(key)

            if (value !== null) {
                // value previously stored
                return value;
            }

            return null;

        } catch (error) {
            return error;
        }
    }

    static async remove(key) {
        try {
            await AsyncStorage.removeItem(key)
        } catch (e) {
            return e;
        }
    }
}