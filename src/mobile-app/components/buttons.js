import React, { useEffect } from "react";
import { StyleSheet, View, Image, TouchableNativeFeedback, Text, Switch } from "react-native"
import { ChangeLightState, LIGHTS_STATE } from "./globalVariables";

import AppTheme from "./theme";

export const ButtonAlone = (props) => {
    return (
        <TouchableNativeFeedback >

            <View style={styles.buttonDivAlone}>

                <View style={styles.buttonWrapper} >

                    <Image style={styles.icon} source={props.icon}></Image>
                    <View>
                        <Text style={styles.titleButton} >{props.title}</Text>
                        <Text style={styles.buttonDescription} >{props.description}</Text>
                    </View>

                </View>

            </View>

        </TouchableNativeFeedback>
    )

}

export const ButtonFirst = (props) => {

        // mozna protoze to je tady a ne v app.js
    const [isEnabled, setIsEnabled] = React.useState(props.lightstate);


    useEffect(() => {
        console.log("LIGHTS_STATE: " + LIGHTS_STATE);



        console.log("useEffect: " + LIGHTS_STATE);
        setIsEnabled(props.lightstate);
    });
    const toggleSwitch = () => {
        console.log("ISENABLED: " + isEnabled)
        setIsEnabled(!isEnabled);
        ChangeLightState(isEnabled);
    };


    return (
        <TouchableNativeFeedback >

            <View style={styles.buttonDivFirst}>

                <View style={styles.switchWrapper}>
                    <View style={styles.buttonWrapper} >
                        <Image style={styles.icon} source={props.icon}></Image>
                        <View>
                            <Text style={styles.titleButton} >{props.title}</Text>
                            <Text style={styles.buttonDescription} >{props.description}</Text>
                        </View>
                    </View>

                    <Switch
                        trackColor={{ false: AppTheme.switchTrackOff, true: AppTheme.switchTrackOn }}
                        thumbColor={isEnabled ? AppTheme.switchThumbOn : AppTheme.switchThumbOff}
                        ios_backgroundColor={AppTheme.default}
                        value={isEnabled}
                        onValueChange={toggleSwitch}
                    />

                    <SendUserRequest light={isEnabled} params={isEnabled ? "L" : "H"} />


                </View>

            </View>

        </TouchableNativeFeedback>
    )


}

export const ButtonBetween = (props) => {
    const [isEnabled, setIsEnabled] = React.useState(false);

    if (props.switch == "true") {
        return (
            <TouchableNativeFeedback >

                <View style={styles.buttonDivBetween}>
                    <View style={styles.buttonBorder} />

                    <View style={styles.switchWrapper}>
                        <View style={styles.buttonWrapperBetween} >
                            <Image style={styles.icon} source={props.icon}></Image>
                            <View>
                                <Text style={styles.titleButton} >{props.title}</Text>
                                <Text style={styles.buttonDescription} >{props.description}</Text>
                            </View>
                        </View>

                        <Switch
                            trackColor={{ false: AppTheme.switchTrackOff, true: AppTheme.switchTrackOn }}
                            thumbColor={isEnabled ? AppTheme.switchThumbOn : AppTheme.switchThumbOff}
                            ios_backgroundColor={AppTheme.default}
                            onValueChange={() => {
                                setIsEnabled(previousState => !previousState)
                            }}
                            value={isEnabled}
                        />

                    </View>

                </View>

            </TouchableNativeFeedback>
        )
    }

    return (
        <TouchableNativeFeedback >
            <View style={styles.buttonDivBetween}>
                <View style={styles.buttonBorder} />

                <View style={styles.buttonWrapperBetween} >

                    <Image style={styles.icon} source={props.icon}></Image>
                    <View>
                        <Text style={styles.titleButton} >{props.title}</Text>
                        <Text style={styles.buttonDescription} >{props.description}</Text>
                    </View>

                </View>

            </View>

        </TouchableNativeFeedback>
    )

}

export const ButtonLast = (props) => {
    const [isEnabled, setIsEnabled] = React.useState(LIGHTS_STATE);

    if (props.switch == "true") {
        return (
            <TouchableNativeFeedback >

                <View style={styles.buttonDivLast}>
                    <View style={styles.buttonBorder} />

                    <View style={styles.switchWrapper}>
                        <View style={styles.buttonWrapperBetween} >
                            <Image style={styles.icon} source={props.icon}></Image>
                            <View>
                                <Text style={styles.titleButton} >{props.title}</Text>
                                <Text style={styles.buttonDescription} >{props.description}</Text>
                            </View>
                        </View>

                        <Switch
                            trackColor={{ false: AppTheme.switchTrackOff, true: AppTheme.switchTrackOn }}
                            thumbColor={isEnabled ? AppTheme.switchThumbOn : AppTheme.switchThumbOff}
                            ios_backgroundColor={AppTheme.default}
                            onValueChange={() => {
                                setIsEnabled(previousState => !previousState)
                            }}
                            value={isEnabled}
                        />

                    </View>

                </View>

            </TouchableNativeFeedback>
        )
    }

    return (
        <TouchableNativeFeedback >

            <View style={styles.buttonDivLast}>
                <View style={styles.buttonBorder} />

                <View style={styles.buttonWrapperBetween} >

                    <Image style={styles.icon} source={props.icon}></Image>
                    <View>
                        <Text style={styles.titleButton} >{props.title}</Text>
                        <Text style={styles.buttonDescription} >{props.description}</Text>
                    </View>

                </View>

            </View>


        </TouchableNativeFeedback>
    )

}

const styles = StyleSheet.create({
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