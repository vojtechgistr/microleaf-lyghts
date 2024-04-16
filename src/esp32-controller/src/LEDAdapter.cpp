#include <LEDAdapter.h>
#include "data.h"

LEDAdapter::LEDAdapter()
{
    // initialize the LED strip
    FastLED.addLeds<WS2812B, LED_PIN, GRB>(_leds, NUM_LEDS);
    _LED_sectors = initLEDSectors();
}

LEDAdapter::LEDSectorMap LEDAdapter::initLEDSectors()
{
    LEDSectorMap sectorLEDs;

    // 1 = index 0
    // rewrite this function if hardware changes
    sectorLEDs[1] = {{18, 19}, {20, 21}, {22, 23}}; // 22 SVITI BLBA BARVA
    sectorLEDs[2] = {{26, 27}, {28, 29}, {42, 43}};
    sectorLEDs[3] = {{16, 17}, {24, 25}, {44, 45}};
    sectorLEDs[4] = {{12, 13}, {14, 15}, {46, 47}}; // OD 46 DO 53 (konec) NESVITI
    sectorLEDs[5] = {{32, 33}, {34, 35}, {36, 37}};
    sectorLEDs[6] = {{30, 31}, {38, 39}, {40, 41}};
    sectorLEDs[7] = {{0, 1}, {50, 51}, {52, 53}};
    sectorLEDs[8] = {{2, 3}, {10, 11}, {48, 49}};
    sectorLEDs[9] = {{4, 5}, {6, 7}, {8, 9}};

    return sectorLEDs;
}

LEDAdapter::LEDSector LEDAdapter::getLEDSector(int sector)
{
    LEDSector sectorLEDs;

    if (_LED_sectors.find(sector) != _LED_sectors.end())
    {
        sectorLEDs = _LED_sectors[sector];
    }

    return sectorLEDs;
}

void LEDAdapter::changeLEDSectorColor(int sector, CRGB color)
{
    LEDSector sectorLEDs = getLEDSector(sector);
    for (LEDPair led : sectorLEDs)
    {
        if (led.first >= NUM_LEDS || led.second >= NUM_LEDS)
            continue;

        _leds[led.first] = color;
        FastLED.show();
        _leds[led.second] = color;
        FastLED.show();
    }
}

void LEDAdapter::clearLEDSector(int sector)
{
    LEDSector sectorLEDs = getLEDSector(sector);

    for (LEDPair led : sectorLEDs)
    {
        if (led.first >= NUM_LEDS || led.second >= NUM_LEDS)
            continue;

        _leds[led.first] = CRGB::Black;
        FastLED.show();
        _leds[led.second] = CRGB::Black;
        FastLED.show();
    }
}

void LEDAdapter::clearAllLEDs()
{
    for (int i = 0; i < NUM_LEDS; i++)
    {
        _leds[i] = CRGB::Black;
        FastLED.show();
    }
}

void LEDAdapter::ChangeAllLEDs()
{
    for (int i = 0; i < NUM_LEDS; i++)
    {
        _leds[i] = CRGB::White;
        FastLED.show();
    }
}


// ANIMATIONS

// Shuffle array
void shuffle_array(int arr[], int n)
{

    // To obtain a time-based seed
    unsigned seed = std::chrono::system_clock::now().time_since_epoch().count();

    // Shuffling our array
    std::shuffle(arr, arr + n,
                 std::default_random_engine(seed));
}

// void LEDAdapter::fade_all()
// {
//     // fade through all colors
//     for (int j = 0; j < 256; j++)
//     {
//         for (int i = 0; i < NUM_LEDS; i++)
//         {
//             _leds[i] = CHSV(j, 255, 255);
//         }
//         FastLED.show();
//         delay(100);
//     }
// }

void LEDAdapter::rain()
{
    // create array of led sectors, use NUM_OF_SECTORS
    int *sectorArray = new int[NUM_OF_SECTORS];

    for (int i = 0; i < NUM_OF_SECTORS; i++)
    {
        sectorArray[i] = i + 1;
    }

    shuffle_array(sectorArray, NUM_OF_SECTORS);

    // rain animaton
    for (int i = 0; i < NUM_OF_SECTORS; i++)
    {
        for (int j = 30; j > 0; j--)
        {
            changeLEDSectorColor(sectorArray[i], CRGB(0, 0, j));
            delay(1);
        }
        return;
    }

    // std::random_device rd;
    // std::mt19937 gen(rd());                                   // seed the generator
    // std::uniform_int_distribution<> distr(1, NUM_OF_SECTORS); // define the range

    // for (int j = 30; j > 0; j--)
    // {
    //     changeLEDSectorColor(distr(gen), CRGB(0, 0, j));
    //     delay(1);
    // }

    delete[] sectorArray;
}

void LEDAdapter::rainbow()
{
    for (int i = 0; i < 255; i++)
    {
        fill_rainbow(_leds, NUM_LEDS, i, 255 / NUM_LEDS);
        FastLED.show();
        delay(10);
    }
}