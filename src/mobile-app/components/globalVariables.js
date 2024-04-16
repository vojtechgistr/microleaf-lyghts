import Database from './database';

export let LIGHTS_STATE = false;

export let CURRENT_SCREEN = "Home";

export const ChangeDeviceIP = async (newIP) => {
    await Database.save("deviceIP", newIP).then(() => {
        DEVICE_IP = newIP;
    });
}

export const LoadDeviceIP = async () => {
    DEVICE_IP = value;
}

export const ChangeLightState = async (newState) => {
    LIGHTS_STATE = newState;
    await Database.save("lightState", newState ? "true" : "false");
}

export const ChangeScreen = (newScreen) => {
    CURRENT_SCREEN = newScreen;
}