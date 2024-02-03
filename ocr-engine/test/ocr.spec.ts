import { Engine } from '../ocr';

describe('Engine', () => {
  let engine: Engine;

  beforeEach(async () => {
    engine = new Engine();
    await engine.Setup();
  });

  afterEach(async () => {
    await engine.Terminate();
  });

  it('should recognize text from an image', async () => {
    const imagePath = 'https://tesseract.projectnaptha.com/img/eng_bw.png';
    
    const expectedText = 
`Mild Splendour of the various-vested Night!
Mother of wildly-working visions! hail
I watch thy gliding, while with watery light
Thy weak eye glimmers through a fleecy veil;
And when thou lovest thy pale orb to shroud
Behind the gather’d blackness lost on high;
And when thou dartest from the wind-rent cloud
Thy placid lightning o’er the awaken’d sky.\n`

    const recognizedText = await engine.Recognize(imagePath);

    expect(recognizedText).toEqual(expectedText);
  });
});
