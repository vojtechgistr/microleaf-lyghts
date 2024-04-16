import { View, Text, StyleSheet } from 'react-native';
import AppTheme from './theme';

import { CheckLightStatus, CheckConnection } from './SendUserRequest';

const Navbar = () => {
    return (
        <View style={styles.navbar}>
            <View style={styles.navtitle}>
                <Text style={styles.navbarText}>Microleaf Lyghts</Text>
            </View>
            <View style={styles.bottomBar}>
                <Text style={styles.bottomBarText}>Connected devices: </Text>

                <CheckConnection />
                <CheckLightStatus />
            </View>
        </View>
    )
}

export default Navbar;

const styles = StyleSheet.create({
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
    }
})