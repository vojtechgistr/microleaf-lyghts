import React, { useState } from "react";
import { StyleSheet, SafeAreaView, Text, View } from "react-native";

import Dialog from "react-native-dialog";
import { BlurView } from "expo-blur";

import { WebView } from "react-native-webview";

import AppTheme from './theme';

import Database from "./database";


export const SendRequestToController = (props) => {
    const [visible, setVisible] = useState(false);
    const m_device_ip = props.device_ip;
    const request_uri = "http://" + m_device_ip + "/" + props.params;

    // store the webview reference
    let WebViewRef = React.useRef();

    const handleWebViewRef = (ref) => {
        WebViewRef.current = ref;
    };

    const handleDialogVisibility = (newState) => {
        setVisible(newState);
    }

    const blurComponentIOS = (
        <BlurView style={StyleSheet.absoluteFill} blurType="xlight" intensity={50} />
      );

    if (m_device_ip == null || m_device_ip == "" || m_device_ip == undefined) {
        return (
            <SafeAreaView style={{ display: "none" }} />
        )
    }

    return (
        <View style={{ display: visible ? "flex" : "none" }}>
            <Dialog.Container 
            visible={visible}
            onBackdropPress={() => { handleDialogVisibility(false) }}
            blurComponentIOS={blurComponentIOS}
            contentStyle={{ backgroundColor: AppTheme.darker, borderRadius: 10, borderColor: AppTheme.primary, borderWidth: 2, shadowColor: AppTheme.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, elevation: 20 }}
            onRequestClose={() => { handleDialogVisibility(false) }}
            verticalButtons={true}

            >
                <Dialog.Title style={{ color: "#fff" }}>Connection failed</Dialog.Title>
                <Dialog.Description style={{ color: "#fff", opacity: 0.6 }}>
                    Go to "Connections" tab, enter the IP address and check the validity of the connection..
                </Dialog.Description>
                <Dialog.Button color={AppTheme.primary} bold={true} label="Confirm" onPress={() => { handleDialogVisibility(false) }} />
            </Dialog.Container>

            <SafeAreaView style={{ display: "none" }}>
                <WebView
                    ref={(ref) => handleWebViewRef(ref)}
                    onMessage={(event) => {
                        const controllerResponse = event.nativeEvent.data;

                        // handle LED control
                        if (controllerResponse.includes("led=")) {

                            // if the device is connected, change the state of the lights
                            if (controllerResponse.includes("led=on")) {
                                
                                Database.save("lightState", "true")
                                console.log("Received light state: ON ✓");
                            } else {
                                Database.save("lightState", "false")
                                console.log("Received light state: OFF ✓");
                            }

                        } else {
                            Database.save("lightState", "false")
                            console.log("Invalid response from controller, light state set to false ✓\nCONTROLLER RESPONSE: " + controllerResponse);
                        }


                    }}

                    onLoadStart={() => {
                        console.log("-----------------------------------------------");
                        console.log("Sending user request with params \"" + props.params + "\"... " + m_device_ip);
                    }}

                    onLoadEnd={() => {
                        if (WebViewRef.current) {
                            WebViewRef.current.stopLoading();
                        }
                        console.log("-----------------------------------------------");
                    }}

                    onError={() => {
                        handleDialogVisibility(true)
                        console.log("Error when sending user request, could not connect... [" + m_device_ip + "]");
                    }}

                    source={{ uri: request_uri }}
                />
            </SafeAreaView>
        </View>
    )
}

export const CheckConnection = (props) => {

    const [readableResponse, setReadableResponse] = useState("Connecting...");
    const [visible, setVisible] = useState(false);
    const m_device_ip = props.device_ip;
    const request_uri = "http://" + m_device_ip + "/STATUS";

    // store the webview reference
    let WebViewRef = React.useRef();

    const handleWebViewRef = (ref) => {
        WebViewRef.current = ref;
    };

    const handleDialogVisibility = (newState) => {
        setVisible(newState);
    }

    const blurComponentIOS = (
        <BlurView style={StyleSheet.absoluteFill} blurType="xlight" intensity={50} />
      );

    if (m_device_ip == null || m_device_ip == "" || m_device_ip == undefined) {
        return (
            <View style={{ display: "none" }} />
        )
    }

    return (
        <View >
            <Dialog.Container 
            visible={visible}
            onBackdropPress={() => { handleDialogVisibility(false) }}
            blurComponentIOS={blurComponentIOS}
            contentStyle={{ backgroundColor: AppTheme.darker, borderRadius: 10, borderColor: AppTheme.primary, borderWidth: 2, shadowColor: AppTheme.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, elevation: 20 }}
            onRequestClose={() => { handleDialogVisibility(false) }}
            verticalButtons={true}

            >
                <Dialog.Title style={{ color: "#fff" }}>Connection failed</Dialog.Title>
                <Dialog.Description style={{ color: "#fff", opacity: 0.6 }}>
                    Go to "Connections" tab, enter the IP address and check the validity of the connection..
                </Dialog.Description>
                <Dialog.Button color={AppTheme.primary} bold={true} label="Confirm" onPress={() => { handleDialogVisibility(false) }} />
            </Dialog.Container>

            <View style={{ display: "none" }}>
                <WebView
                    ref={(ref) => handleWebViewRef(ref)}
                    onMessage={(event) => {
                        const controllerResponse = event.nativeEvent.data;

                        if (controllerResponse.includes("led=")) {
                            setReadableResponse("1");

                            // if the device is connected, change the state of the lights
                            if (controllerResponse.includes("led=on")) {
                                
                                Database.save("lightState", "true")
                                console.log("CHECK: Received light state: ON ✓");
                            } else {
                                
                                Database.save("lightState", "false")
                                console.log("CHECK: Received light state: OFF ✓");
                            }

                        } else {
                            setReadableResponse("0");
                            
                            Database.save("lightState", "false")
                            console.log("CHECK: Invalid response from controller, light state set to false ✓\nCONTROLLER RESPONSE: " + controllerResponse);
                        }
                    }}

                    onLoadStart={() => {
                        console.log("-----------------------------------------------");
                        console.log("Checking connection status... " + m_device_ip);
                    }}

                    onLoadEnd={() => {
                        if (WebViewRef.current) {
                            WebViewRef.current.stopLoading();
                        }
                        console.log("-----------------------------------------------");
                    }}

                    onError={() => {
                        console.log("Error when checking connection status... [" + m_device_ip + "]");
                    }}

                    source={{ uri: request_uri }}
                />
            </View>
            <Text style={styles.bottomNavBarText}>{readableResponse}</Text>
        </View>
    )


}

const styles = StyleSheet.create({
    webView: {
        opacity: 0,
    },
    text: {
        color: AppTheme.secondary,
        textAlign: 'center',
        fontSize: 20,
    },
    bottomNavBarText: {
        color: AppTheme.secondary,
        fontSize: 16,
    },
});
