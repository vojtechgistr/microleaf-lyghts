#include "data.h"
#include "nanoLeaf.h"
#include <LEDAdapter.h>
#include "Thread"

// store connection credentials
char ssid[] = NETWORK_SSID;
char pass[] = NETWORK_PASSWORD;

NanoLeaf nanoleaf;
LEDAdapter ledAdapter;

void setup()
{
  // initialize serial for debugging
  Serial.begin(9600);

  // initialize the LED pin as an output:
  pinMode(LED_BUILTIN, OUTPUT);

  // setup connection to WiFi
  nanoleaf.setup_connection(ssid, pass);

  // for debugging purposes - log WiFi connection details
  nanoleaf.log_wifi_connection_details();
}


// allocate space for the response string
int responseCode = 0;

std::string getParamFromQueryString(std::string queryString, std::string key)
{
  // example queryString: "GET /api/changeColors?color=(123,123,123)&triangleSectorNumber=[1,2,3] HTTP/1.1"
  int keyPos = queryString.find(key);
  if (keyPos == std::string::npos)
    return "";

  int equalsPos = queryString.find("=", keyPos);
  if (equalsPos == std::string::npos)
    return "";

  int ampersandPos = queryString.find("&", keyPos);
  if (ampersandPos == std::string::npos)
  {
    ampersandPos = queryString.find("HTTP/1.1", keyPos);
    if (ampersandPos == std::string::npos)
      return "";
  }

  return queryString.substr(equalsPos + 1, ampersandPos - equalsPos - 1);
}

CRGB parseColor(std::string colorString)
{
  // example colorString: "(123,123,123)"
  int firstCommaPos = colorString.find(",");
  int secondCommaPos = colorString.find(",", firstCommaPos + 1);
  int closingBracketPos = colorString.find(")");

  int red = std::stoi(colorString.substr(1, firstCommaPos - 1));
  int green = std::stoi(colorString.substr(firstCommaPos + 1, secondCommaPos - firstCommaPos - 1));
  int blue = std::stoi(colorString.substr(secondCommaPos + 1, closingBracketPos - secondCommaPos - 1));

  return CRGB(red, green, blue);
}

enum aniTypes
{
  // FADE_ALL,
  RAIN,
  RAINBOW,
  NONE
};

int currentAnimation = aniTypes::NONE;

void getAnimationFunction(aniTypes aniType)
{
  switch (aniType)
  {
  // case aniTypes::FADE_ALL:
  //   ledAdapter.fade_all();
  //   break;
  case aniTypes::RAIN:
    ledAdapter.rain();
    break;
  case aniTypes::RAINBOW:
    ledAdapter.rainbow();
    break;
  default:
    break;
  }
}

void loop()
{
  // listen for incoming clients
  WiFiClient client = nanoleaf.server.available();

  // RUN ANIMATIONS
  if (currentAnimation != aniTypes::NONE)
  {
    getAnimationFunction((aniTypes)currentAnimation);
  }

  if (!client)
  {
    return;
  }

  // create variable to hold a line of a request
  std::string currentLine = "";

  while (client.connected())
  {
    if (!client.available())
    {
      continue;
    }

    // read a byte from the client
    char c = client.read();

    // if the byte is a newline character, that's the end of the client HTTP request, so send a response
    if (c == '\n')
    {
      if (currentLine.length() == 0)
      {
        // send a standard http response header
        client.println("HTTP/1.1 200 OK");
        client.println("Content-type:text/html");
        client.println();

        // send response message
        client.print("<h1>");
        client.print("RESPONSE CODE:");
        client.print("</h1>");
        client.print("<h1>");
        client.print(responseCode);
        client.print("</h1>");

        // The HTTP response ends with another blank line
        client.println();

        // clear the response message
        responseCode = 0;
        break;
      }
      else
      {
        // if you got a new line, then clear currentLine
        currentLine = "";
      }
    }
    // if the line is still going, then add the character to the currentLine
    else if (c != '\r')
    {
      currentLine += c;
    }

    /////////////////////////
    // HANDLE THE REQUESTS //
    /////////////////////////

    // Serial.println(currentLine.c_str());
    if (currentLine.find("GET /api/connectionStatus HTTP/1.1") != std::string::npos)
    {
      // Serial.println("connection status");
      currentLine = "";
      responseCode = 99;
    }

    if (currentLine.find("GET /H") != std::string::npos)
    {
      ledAdapter.ChangeAllLEDs();
      currentLine = "";
      responseCode = 100;
    }

    if (currentLine.find("GET /L") != std::string::npos)
    {
      ledAdapter.clearAllLEDs();
      currentLine = "";
      responseCode = 101;
    }

    if (currentLine.find("GET /api/clearLeds HTTP/1.1") != std::string::npos)
    {
      ledAdapter.clearAllLEDs();
      // Serial.println("cleared leds");
      responseCode = 101;
      currentAnimation = aniTypes::NONE;
      currentLine = "";
    }

    if (currentLine.find("GET /api/animate") != std::string::npos && currentLine.find("HTTP/1.1") != std::string::npos)
    {
      std::string rawAnimationType = getParamFromQueryString(currentLine, "type");

      rawAnimationType.erase(std::remove_if(rawAnimationType.begin(), rawAnimationType.end(), ::isspace),
                             rawAnimationType.end());

      if (rawAnimationType == "rain")
      {
        currentAnimation = aniTypes::RAIN;
      }
      else if (rawAnimationType == "rainbow")
      {
        currentAnimation = aniTypes::RAINBOW;
      }
      // else if (rawAnimationType == "fade_all")
      // {
      //   currentAnimation = aniTypes::FADE_ALL;
      // }
      else
      {
        currentAnimation = aniTypes::NONE;
      }

      
      ledAdapter.clearAllLEDs();

      responseCode = 101;
      currentLine = "";
    }

    if (currentLine.find("GET /api/changeColors") != std::string::npos && currentLine.find("HTTP/1.1") != std::string::npos)
    {
      std::string rawColor = getParamFromQueryString(currentLine, "color");
      std::string rawTriangleSectorNumber = getParamFromQueryString(currentLine, "triangleSectorNumber");
      //////////////////////////////////////////
      // Serial.print(rawTriangleSectorNumber.c_str());
      // Serial.println("-----------");
      /////////////////////////
      // Serial.println("Changing colors");

      CRGB color = parseColor(rawColor);

      if (rawTriangleSectorNumber.length() > 0 && rawTriangleSectorNumber != " ")
      {
        currentAnimation = aniTypes::NONE;

        std::string currentTriangleSectorNumber = "";
        for (int i = 0; i < rawTriangleSectorNumber.length(); i++)
        {
          if (rawTriangleSectorNumber[i] == '[' || rawTriangleSectorNumber[i] == ']')
            continue;

          if (rawTriangleSectorNumber[i] == ',' || i == rawTriangleSectorNumber.length() - 1)
          {
            int triangleSectorNumber = std::stoi(currentTriangleSectorNumber);
            ledAdapter.changeLEDSectorColor(triangleSectorNumber, color);

            currentTriangleSectorNumber = "";
            continue;
          }
          currentTriangleSectorNumber += rawTriangleSectorNumber[i];
        }
      }

      currentLine = "";
      responseCode = 102;
    }
  }

  delay(500);
}