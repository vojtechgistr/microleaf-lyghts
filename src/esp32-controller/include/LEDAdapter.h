#ifndef LED_ADAPTER_H
#define LED_ADAPTER_H

#include <vector>
#include <utility>
#include <map>
#include <FastLED.h>
#include <random>
#include <chrono>
#include "data.h"

class LEDAdapter
{
public:
    typedef std::pair<int, int> LEDPair;
    typedef std::vector<LEDPair> LEDSector;
    typedef std::map<int, LEDSector> LEDSectorMap;
    
    // LEDAdapter(CRGB &leds);
    LEDAdapter();

    LEDSector getLEDSector(int sector);
    void changeLEDSectorColor(int sector, CRGB color);
    void clearLEDSector(int sector);
    void clearAllLEDs();
    void ChangeAllLEDs();

    // animations
    void fade_all();
    void rain();
    void rainbow();

private:
    CRGB _leds[NUM_LEDS];
    LEDSectorMap _LED_sectors;

    LEDSectorMap initLEDSectors();
};

#endif