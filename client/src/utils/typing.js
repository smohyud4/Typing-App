/*const TEXTS = [
    "There once was a man from nantucket.",
    "The quick brown fox jumps over the lazy dog.",
    "Ocean man, take me by the hand, lead me to the land that you understand.",
    "The rain in Spain falls mainly on the plain.",
    "Want to keep track of your progress? Sign in or create an account to save your stats!",
    "The slow black wolf burrowed under the energetic cat.",
    "The AI-powered code completion tool GitHub Copilot generated over 82 billion lines of code within its first year.",
    "Artificial Intelligence has profoundly influenced our everyday lives, and this influence continues to expand.",
    "What is the difference between right and wrong? Good and evil? Do these concepts exist on a spectrum? A powerful tool that can help guide these questions is ethics. At its core, ethics encompasses all facets of society, dictating what humans ought to do. For example, ethics provide the standards that impose reasonable obligations from common vices such as rape, stealing, murder, assault, slander, and fraud. These standards also include those that enjoin common virtues such as honesty, compassion, and loyalty",
    "What sha'll we do with the drunken sailor?",
    "Want to keep track of your progress? Sign in or create an account to save your stats!"
];*/ 

const TEXTS = [
  "test"
];

export function getGameText() {
    const selectedText = TEXTS[Math.floor(Math.random() * TEXTS.length)];
    const textArray = Array.from(selectedText);
    const converted = textArray.map((char, index) => {
      if (index === 0) return { character: char, currState: 'current'};
      return { character: char, currState: ''}
    });

    return converted;
}

export function calculateWPM(start, end, totalChars) {
  const elapsedTimeInMinutes = (end - start) / 1000 / 60; // Convert milliseconds to minutes
  const totalWords = totalChars / 5; // Approximate words by dividing total characters by 5
  const wpm = totalWords / elapsedTimeInMinutes;
  return wpm; // Round to the nearest integer
}

export function validateInput(key1, key2) {
    
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-;':,.<>/? ";

    if (key1 == '' || key2 == '') 
        return "Characters must not be empty";

    if (key1.toLowerCase() === key2.toLowerCase()) 
        return "Characters must be distinct";

    if (!characters.includes(key1) || !characters.includes(key2)) 
        return "Characters must be found in " + characters;
    
    return "None";
}

export function generateText(key1, key2, capitals) {
    let str = "";
    const words = Math.floor(Math.random() * 6) + 15;

    for (let i = 0; i < words; i++) {
      const length = Math.floor(Math.random() * 4) + 2;
      for (let j = 0; j < length; j++) {
        if (Math.random() < 0.5) 
          j === 0 && capitals ? str += key1.toUpperCase() : str += key1;
        else 
          j === 0 && capitals ? str += key2.toUpperCase() : str += key2;
      }
      str += " ";
    }

    return str.trim();
}
