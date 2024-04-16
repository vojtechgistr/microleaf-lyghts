#include "nanoleaf.h"

NanoLeaf::NanoLeaf()
{
}

NanoLeaf::~NanoLeaf()
{
}

bool NanoLeaf::setup_connection(char t_ssid[], char t_pass[])
{
    if (sizeof(t_ssid) / sizeof(t_ssid[0]) == 0 || sizeof(t_pass) / sizeof(t_pass[0]) == 0)
    {
        return false;
    }

    WiFi.mode(WIFI_STA);

    // check for the presence of the shield
    if (WiFi.status() == WL_NO_SHIELD)
    {
        Serial.println("WiFi shield not present");
        return false;
    }

    // attempt to connect to Wifi network
    while (m_status != WL_CONNECTED)
    {
        Serial.print("Attempting to connect to SSID: ");
        Serial.println(t_ssid);

        // Connect to WPA/WPA2 network. Change this line if using open or WEP network
        m_status = WiFi.begin(t_ssid, t_pass);

        // wait 10 seconds for connection
        delay(10000);
    }

    if (WiFi.getAutoConnect() == true)
    {
        WiFi.setAutoConnect(false);
    }

    if (WiFi.getAutoReconnect() == false)
    {
        WiFi.setAutoReconnect(true);
    }

    server.begin();

    digitalWrite(LED_BUILTIN, LOW);
    delay(500);
    digitalWrite(LED_BUILTIN, HIGH);
    delay(500);
    digitalWrite(LED_BUILTIN, LOW);
    delay(500);
    digitalWrite(LED_BUILTIN, HIGH);
    delay(500);
    digitalWrite(LED_BUILTIN, LOW);
    delay(500);
    digitalWrite(LED_BUILTIN, HIGH);

    return true;
}

void NanoLeaf::log_wifi_connection_details()
{
    // print the SSID of the network you're attached to:
    Serial.print("SSID: ");
    Serial.println(WiFi.SSID());

    // print your WiFi shield's IP address:
    IPAddress ip = WiFi.localIP();
    Serial.print("IP Address: ");
    Serial.println(ip);

    // print the received signal strength:
    long rssi = WiFi.RSSI();
    Serial.print("signal strength (RSSI):");
    Serial.print(rssi);
    Serial.println(" dBm");
}