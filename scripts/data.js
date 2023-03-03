const Keys = {
  Categories: ["常用", "翻譯", "角色"],
  Items: {
    常用: ["回答", "翻譯", "潤色", "續寫", "無前綴"],
    翻譯: ["翻譯成中文", "翻譯成英文", "翻譯成日文"],
    角色: ["Javascipt 終端機", "英文老師", "辯論專家", "程式專家", "Emoji 翻譯"]
  },
  preTexts: {
    "JavaScript 終端機":
      "I want you to act as a javascript console. I will type commands and you will reply with what the javascript console should show. I want you to only reply with the terminal output inside one unique code block, and nothing else. do not write explanations. do not type commands unless I instruct you to do so. when I need to tell you something in english, I will do so by putting text inside curly brackets {like this}. My command is",
    英文老師:
      "I want you to act as a spoken English teacher and improver. I will speak to you in English and you will reply to me in English to practice my spoken English. I want you to keep your reply neat, limiting the reply to 100 words. I want you to strictly correct my grammar mistakes, typos, and factual errors. Remember, I want you to strictly correct my grammar mistakes, typos, and factual errors.Here's my sentence",
    辯論專家:
      "I want you to act as a debater. I will provide you with some topics related to current events and your task is to research both sides of the debates, present valid arguments for each side, refute opposing points of view, and draw persuasive conclusions based on evidence. Your goal is to help people come away from the discussion with increased knowledge and insight into the topic at hand. My request is",
    程式專家:
      "I want you to act as a senior programmer, your primary goal is to assist users to write code. This may involve designing/writing/editing/describing code or providing helpful information. Where possible you should provide code examples to support your points and justify your recommendations or solutions. Make sure the code you provide is correct and can be run without errors. Be detailed and thorough in your responses. Your ultimate goal is to provide a helpful and enjoyable experience for the user. Write code inside <code>, </code> tags.",
    "Emoji 翻譯":
      "I want you to translate the sentences I wrote into emojis. I will write the sentence, and you will express it with emojis. I just want you to express it with emojis. I don't want you to reply with anything but emoji. My sentence is"
  }
};

const LocalDataPath = "JBChat.json";

if ($drive.exists(LocalDataPath)) {
  var LocalData = JSON.parse($drive.read(LocalDataPath).string);
} else {
  LocalData = Keys;
}
function getCategories() {
  return LocalData.Categories;
}

function setCategories(categories) {
  LocalData.Categories = categories;
  var items = getAllItems();
  for (let key in items) {
    if (categories.indexOf(key) < 0) {
      items[key] = [];
    }
  }
  setAllItems(items);
}

function getItems(category) {
  return getAllItems()[category] || ["Item 1"];
}

function setItems(category, items) {
  var allItems = getAllItems();
  allItems[category] = items;
  setAllItems(allItems);
}

function getAllItems() {
  return LocalData.Items;
}

function setAllItems(items) {
  LocalData.Items = items;
  writeCache();
}

function getPreTexts(item) {
  return getAllPreTexts()[item] || item;
}

function setPreTexts(item, preText) {
  var allPreTexts = getAllPreTexts();
  allPreTexts[item] = preText;
  setAllPreTexts(allPreTexts);
}

function getAllPreTexts() {
  return LocalData.preTexts;
}

function setAllPreTexts(preTexts) {
  LocalData.preTexts = preTexts;
  writeCache();
}

function deleteDataItem(item) {
  //console.log(item)
  for (let p = 0; p < LocalData.Items[item].length; p++) {
    deleteDataPreText(LocalData.Items[item][p]);
  }
  delete LocalData.Items[item];
  writeCache();
}

function deleteDataPreText(preText) {
  delete LocalData.preTexts[preText];
  writeCache();
}

function writeCache() {
  $drive.write({
    data: $data({ string: JSON.stringify(LocalData) }),
    path: LocalDataPath
  });
}

module.exports = {
  getCategories: getCategories,
  setCategories: setCategories,
  getItems: getItems,
  setItems: setItems,
  getPreTexts: getPreTexts,
  setPreTexts: setPreTexts,
  deleteDataItem: deleteDataItem,
  deleteDataPreText: deleteDataPreText
};
