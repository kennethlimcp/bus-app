#include <Adafruit_NeoPixel.h>


uint8_t numpixelA = 24;
uint8_t numpixelB = 15;
uint8_t numpixelC = 17;
Adafruit_NeoPixel stripA = Adafruit_NeoPixel(numpixelA, 5, NEO_GRB + NEO_KHZ800);
Adafruit_NeoPixel stripB = Adafruit_NeoPixel(numpixelA, 6, NEO_GRB + NEO_KHZ800);
Adafruit_NeoPixel stripC = Adafruit_NeoPixel(numpixelA, 7, NEO_GRB + NEO_KHZ800);

void setup() {
	Serial.begin(9600);

	stripA.begin();
	stripB.begin();
	stripC.begin();

	stripA.show(); // Initialize all pixels to 'off'
	stripB.show(); // Initialize all pixels to 'off'
	stripC.show(); // Initialize all pixels to 'off'
}

void loop() {
	if(Serial.available())	{
		char incomingByte = Serial.read();

		if(incomingByte == 'a') {
			setColour(stripA,numpixelA,0,0,0,0);
			setColour(stripB,numpixelB,0,0,0,0);
			setColour(stripC,numpixelC,0,0,0,0);
			delay(1000);
			setColour(stripA,numpixelA,150,0,0,100);
			Serial.print("Arduino: a");
		}
		else if(incomingByte == 'b') {
			setColour(stripA,numpixelA,0,0,0,0);
			setColour(stripB,numpixelB,0,0,0,0);
			setColour(stripC,numpixelC,0,0,0,0);
			delay(1000);
			setColour(stripB,numpixelB,0,150,0,100);
			Serial.print("Arduino: b");
		}
		else if(incomingByte == 'c') {
			setColour(stripA,numpixelA,0,0,0,0);
			setColour(stripB,numpixelB,0,0,0,0);
			setColour(stripC,numpixelC,0,0,0,0);
			delay(1000);
			setColour(stripC,numpixelC,0,0,150,100);
			Serial.print("Arduino: c");
		}
	}
}

void setColour(Adafruit_NeoPixel& strip, uint8_t numpixel, uint8_t r,uint8_t g, uint8_t b, unsigned long delayval) {
	for(int i=0;i<numpixel;i++){
		strip.setPixelColor(i, strip.Color(r,g,b)); // Moderately bright green color.
		strip.show(); // This sends the updated pixel color to the hardware.
		delay(delayval);
	}
}
