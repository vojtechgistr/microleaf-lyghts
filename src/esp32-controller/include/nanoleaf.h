#ifndef NANOLEAF_H
#define NANOLEAF_H

#include <Arduino.h>

#include <iostream>
#include <SPI.h>         // What is used to communicate with the WiFi chip
#include <ESP8266WiFi.h> // WiFi library for ESP8266

class NanoLeaf
{

private:
    int m_ledControl;
    int m_ledControlPin;
    int m_status = WL_IDLE_STATUS; // status of wifi

public:
    NanoLeaf();
    ~NanoLeaf();

    bool setup_connection(char t_ssid[], char t_pass[]);

    void log_wifi_connection_details();

    // Create a server on port 80
    WiFiServer server = WiFiServer(80);
};

#endif