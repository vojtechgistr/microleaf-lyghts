import React from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, TouchableNativeFeedback, Image } from 'react-native';

import Dialog from "react-native-dialog";
import { BlurView } from "expo-blur";

import AppTheme from '../components/theme';
import Database from '../components/database';

import { SafeAreaView } from 'react-navigation';

import { useNavigation } from '@react-navigation/native';


export default class Connections extends React.Component {

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView overScrollMode='never'>
                    <View style={styles.header}>
                        <GoBackButton screenName="HomePage" />

                        <Text style={styles.headerText}>Connections</Text>
                    </View>

                    <View style={styles.container} >
                        <DeviceHistory />

                    </View>

                </ScrollView>

            </SafeAreaView>
        )
    }
}

function GoBackButton({ screenName }) {
    const navigation = useNavigation();
    return (
        <TouchableNativeFeedback onPress={() => navigation.navigate(screenName)}>
            <Image source={require('../assets/back-icon.png')} style={styles.backButton} />
        </TouchableNativeFeedback>
    );
}


class DeviceHistory extends React.Component {
    constructor() {
        super()

        this.state = {
            m_device_ip: "Loading...",
            hteObject: [],
            dialogVisible: false,
        }

        this.m_new_device_name = "New Device";
        this.m_new_device_ip = null;
        this.blurComponentIOS = (<BlurView style={StyleSheet.absoluteFill} blurType="xlight" intensity={50} />);
    }


    async prepare() {
        try {

            // store global variables DEVICE_IP and LIGHTS_STATE
            await Database.load("deviceIP").then((value) => {
                this.setState({ m_device_ip: value });
            })

            await Database.load("deviceHistory").then((value) => {
                let history = JSON.parse(value);
                if (history != null) {
                    this.setState({ hteObject: history });
                }

            })

        } catch (error) {
            console.log(error)
        }
    }



    async connectToDevice(ip, lightState) {
        this.setState({ m_device_ip: ip });
        await Database.save("deviceIP", ip);
        await Database.save("lightState", lightState ? "true" : "false");
    }

    async handleNewDevice(ip, deviceName) {
        if (ip == null || ip == undefined || ip == "") {
            return;
        }

        if (deviceName == null || deviceName == "" || deviceName == undefined || deviceName == " ") {
            deviceName = "New Device";
        }

        await Database.load("deviceHistory").then((value) => {
            let history = JSON.parse(value);
            if (history == null) return;
            
            history.push({ deviceIP: ip, lightState: false, deviceName: deviceName });
            this.setState({ hteObject: history });

            Database.save("deviceHistory", JSON.stringify(history));
        });
    }

    handleDialogVisibilityState(newState) {
        this.setState({ dialogVisible: newState });
    }

    componentDidMount() {
        setTimeout(() => {
            this.prepare();
        }, 500);
    }


    render() {
        console.log("rendering device history");
        return (
            <View style={styles.container}>

                <Dialog.Container
                    visible={this.state.dialogVisible}
                    onBackdropPress={() => { this.handleDialogVisibilityState(false) }}
                    blurComponentIOS={this.blurComponentIOS}
                    contentStyle={{ backgroundColor: AppTheme.darker, borderRadius: 10, borderColor: AppTheme.primary, borderWidth: 2, shadowColor: AppTheme.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, elevation: 20 }}
                    onRequestClose={() => { this.handleDialogVisibilityState(false) }}
                    verticalButtons={true}
                >
                    <Dialog.Title style={{ color: "#fff" }}>Connection failed</Dialog.Title>
                    <Dialog.Description style={{ color: "#fff", opacity: 0.6 }}>
                        Enter the IP address of the device you want to connect to. Name is optional.
                    </Dialog.Description>
                    <Dialog.Input style={{ color: "#fff" }} placeholder="Enter new device name" onChangeText={(text) => { this.m_new_device_name = text }} />
                    <Dialog.Input style={{ color: "#fff" }} placeholder="Enter IP address" onChangeText={(text) => { this.m_new_device_ip = text }} />
                    <Dialog.Button label="Add" onPress={() => { this.handleDialogVisibilityState(false); this.handleNewDevice(this.m_new_device_ip, this.m_new_device_name) }} />
                    <Dialog.Button label="Cancel" onPress={() => { this.handleDialogVisibilityState(false) }} />
                </Dialog.Container>

                <View>
                    <TouchableNativeFeedback>
                        <View style={styles.buttonDivAloneCurrentConnection}>
                            <View style={styles.buttonWrapper} >
                                <Image style={styles.icon} source={require("../assets/wifi-icon.png")}></Image>
                                <View>
                                    <Text style={styles.titleButton} >Current Controller</Text>
                                    <Text style={styles.buttonDescription} >{this.state.m_device_ip}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableNativeFeedback>

                    <View style={styles.addDeviceWrapper}>
                        <TouchableNativeFeedback onPress={() => this.handleDialogVisibilityState(true)}>
                            <View style={styles.deviceContent}>
                                <Text style={styles.titleButton} >Add Device</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>


                    <Text style={styles.historyText}>Connection history</Text>
                    {this.state.hteObject.map((data, key) => {
                        return (
                            <TouchableNativeFeedback key={key} onPress={() => { this.connectToDevice(data.deviceIP, data.lightState) }}>
                                <View style={styles.buttonDivAlone}>
                                    <View style={styles.buttonWrapper} >
                                        <Image style={styles.icon} source={require("../assets/history-icon.png")}></Image>
                                        <View>
                                            <Text style={styles.titleButton} >{data.deviceName}</Text>
                                            <Text style={styles.buttonDescription} >{data.deviceIP}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        )
                    })}
                </View>
            </View>
        )
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppTheme.default,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        backgroundColor: AppTheme.default,
    },
    addDeviceWrapper: {
        margin: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deviceContent: {
        display: 'flex',
        width: 200,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: AppTheme.warning,
        borderRadius: 24,
    },
    headerText: {
        color: AppTheme.secondary,
        fontSize: 18,
    },
    historyText: {
        color: AppTheme.secondary,
        fontSize: 20,
        fontWeight: 'bold',
        margin: 12,
    },
    backButton: {
        position: 'absolute',
        left: 20,
        width: 20,
        height: 20,
    },
    buttonWrapper: {
        display: 'flex',
        flexDirection: 'row',
        padding: 24,
        height: 80,
        alignItems: 'center',
    },
    buttonDivAlone: {
        height: 80,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 24,
        backgroundColor: AppTheme.darkerGray,
        marginBottom: 24,
    },
    buttonDivAloneCurrentConnection: {
        height: 80,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 24,
        backgroundColor: AppTheme.primary,
        marginBottom: 24,
    },
    buttonTitle: {
        color: AppTheme.secondary,
    },
    icon: {
        width: 26,
        height: 26,
        marginRight: 24,
        marginLeft: 8,
    },
    titleButton: {
        color: AppTheme.secondary,
        fontSize: 18,
        letterSpacing: 0.5,
    },
    buttonDescription: {
        color: AppTheme.secondary,
        opacity: 0.7,
        fontSize: 13,
    },
});