import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Switch, TouchableNativeFeedback, Image } from 'react-native';
import { ButtonAlone, ButtonBetween, ButtonLast } from '../components/buttons';

import { SendRequestToController, CheckConnection } from '../components/SendUserRequest';

import AppTheme from '../components/theme';
import Database from '../components/database';
import { useNavigation } from '@react-navigation/native';

// change navigation bar color
export default class HomePage extends React.Component {
    constructor() {
        super();
        // store navigation 
        this.state = {
            areLightsOn: false,
        };
        this.m_device_ip = null;
    }

    async updateLightState() {
        this.setState({ areLightsOn: !this.state.areLightsOn });
        await Database.save("lightState", this.state.areLightsOn ? "true" : "false");
    }


    async prepare() {

        // store global variables DEVICE_IP and LIGHTS_STATE

        await Database.load("deviceIP").then((value) => {
            this.m_device_ip = value;
        })

        await Database.load("lightState").then(async (value) => {
            let state = value == "true" ? true : false;
            this.setState({ areLightsOn: state });
            await Database.save("lightState", state.toString());

        })

    }

    componentDidMount() {
        setTimeout(() => {
            this.prepare();
        }, 1000);
    }

    render() {

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView overScrollMode='never'>

                    <View style={styles.navbar}>
                        <View style={styles.navtitle}>
                            <Text style={styles.navbarText}>MicroLeaf Lyghts</Text>
                        </View>
                        <View style={styles.bottomBar}>
                            <Text style={styles.bottomBarText}>Connected devices: </Text>
                            {/* CHECK DEVICE CONNECTION */}
                            <CheckConnection device_ip={this.m_device_ip} />
                        </View>
                    </View>

                    <ConnectionButton screenName="Connections" />

                    {/* RENDER LIGHTS ON/OF SWITCH BUTTON */}
                    <LightSwitchButton device_ip={this.m_device_ip} areLightsOn={this.state.areLightsOn} updateLightState={this.updateLightState.bind(this)} />

                    <ButtonBetween icon={require("../assets/favicon.png")} title="Programs" description="Turn on/off your lights" />
                    <ButtonLast icon={require("../assets/favicon.png")} title="Lights" description="Turn on/off your lights" />

                    <ButtonAlone icon={require("../assets/reset-icon.png")} title="Reset App" description="Delete all data from local database" />

                </ScrollView>

            </SafeAreaView>
        );
    }
}


function ConnectionButton({ screenName }) {
    const navigation = useNavigation();

    return (
        <TouchableNativeFeedback onPress={() => navigation.replace(screenName)}>
            <View style={styles.buttonDivAlone}>
                <View style={styles.buttonWrapper} >
                    <Image style={styles.icon} source={require("../assets/wifi-icon.png")}></Image>
                    <View>
                        <Text style={styles.titleButton} >Connections</Text>
                        <Text style={styles.buttonDescription} >WiFi • Connect to your controller device</Text>
                    </View>
                </View>
            </View>
        </TouchableNativeFeedback>
    );
}

function LightSwitchButton({ areLightsOn, updateLightState, device_ip }) {

    return (
        <TouchableNativeFeedback >

            <View style={styles.buttonDivFirst}>

                <View style={styles.switchWrapper}>
                    <View style={styles.buttonWrapper} >
                        <Image style={styles.icon} source={require("../assets/power-icon.png")}></Image>
                        <View>
                            <Text style={styles.titleButton} >Lights</Text>
                            <Text style={styles.buttonDescription} >Turn on/off your lights</Text>
                        </View>
                    </View>

                    <Switch
                        trackColor={{ false: AppTheme.switchTrackOff, true: AppTheme.switchTrackOn }}
                        thumbColor={areLightsOn ? AppTheme.switchThumbOn : AppTheme.switchThumbOff}
                        ios_backgroundColor={AppTheme.default}
                        value={areLightsOn}
                        onValueChange={() => { updateLightState(); }}
                    />

                    <SendRequestToController device_ip={device_ip} params={areLightsOn ? "L" : "H"} />

                </View>

            </View>

        </TouchableNativeFeedback>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppTheme.default,
    },
    text: {
        color: AppTheme.secondary,
    },
    navbar: {
        backgroundColor: AppTheme.default,
        height: 340,
    },
    navtitle: {
        color: AppTheme.secondary,
        backgroundColor: AppTheme.default,
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navbarText: {
        color: AppTheme.secondary,
        fontSize: 32,
        fontWeight: 'semibold',
    },
    bottomBar: {
        backgroundColor: AppTheme.default,
        paddingLeft: 12,
        paddingRight: 12,
        height: 30,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        opacity: 0.5,
        fontWeight: 'light',
    },
    bottomBarText: {
        color: AppTheme.secondary,
        fontSize: 16,
    },
    switchWrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingRight: 24,
    },
    buttonWrapper: {
        display: 'flex',
        flexDirection: 'row',
        padding: 24,
        height: 80,
        alignItems: 'center',
    },
    buttonWrapperBetween: {
        display: 'flex',
        flexDirection: 'row',
        padding: 24,
        paddingTop: 18,
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
    buttonDivFirst: {
        height: 80,
        display: 'flex',
        flexDirection: 'column',
        borderTopStartRadius: 24,
        borderTopEndRadius: 24,
        backgroundColor: AppTheme.darkerGray,
    },
    buttonDivBetween: {
        height: 80,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: AppTheme.darkerGray,
    },
    buttonDivLast: {
        height: 80,
        display: 'flex',
        flexDirection: 'column',
        borderBottomEndRadius: 24,
        borderBottomStartRadius: 24,
        backgroundColor: AppTheme.darkerGray,
        marginBottom: 24,
    },
    buttonBorder: {
        width: 300,
        height: 1,
        backgroundColor: AppTheme.secondary,
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'center',
        opacity: 0.5,
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