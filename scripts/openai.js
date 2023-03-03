var help = require("scripts/helper")
var data = require("scripts/data");

async function ai(model,title,text){
  if(model=="ChatGPT")
    await chatgpt(title,text)
  else
    await gpt3(title,text)
  
}
async function gpt3(title, text) {
  $ui.toast(title + "...", 15);
  var prePrompt = title == "無前綴" ? "" : data.getPreTexts(title);
  await $http.request({
    method: "post",
    url: "https://api.openai.com/v1/completions",
    showsProgress: true,
    header: {
      Authorization: "Bearer " + $cache.get("api")
    },
    body: {
      model: "text-davinci-003",
      prompt: prePrompt + ":" + text,
      max_tokens: 500
    },
    handler: function (resp) {
      //$ui.clearToast()

      var respText = resp.data.choices[0].text;
      $keyboard.delete();
      if (title.indexOf("續寫") >= 0) {
        text = text + "\n" + respText.trim();
        $keyboard.insert(text);
      } else {
        $keyboard.insert(respText.trim());
      }

      help.writeResp(help.time(), "GPT3🤖", respText.trim() + "\n\n" + "---\n");
    }
  });
}



async function chatgpt(title, text) {
  $ui.toast(title + "...", 15);
  var query = []
  if(title!=data.getPreTexts(title)){
    $ui.toast("sys")
    query = [
      {"role":"system","content":data.getPreTexts(title)},
      {"role":"user","content":text}
    ]
  }else{
    
    var prePrompt = title == "無前綴" ? "" : data.getPreTexts(title);
      var content = prePrompt?prePrompt+":"+text:text
      query = [{"role": "user", "content": content}]
  }
  
  await $http.request({
    method: "post",
    url: "https://api.openai.com/v1/chat/completions",
    showsProgress: true,
    header: {
      Authorization: "Bearer " + $cache.get("api")
    },
    body: {
      model: "gpt-3.5-turbo",
      "messages": query,
      max_tokens: 500
    },
    handler: function (resp) {
      //$ui.clearToast()
      console.log(resp.data)
      var respText = resp.data.choices[0].message.content;
      $keyboard.delete();
      if (title.indexOf("續寫") >= 0) {
        text = text + "\n" + respText.trim();
        $keyboard.insert(text);
      } else {
        $keyboard.insert(respText.trim());
      }
      console.log(respText)

      help.writeResp(help.time(), "ChatGPT💬", respText.trim() + "\n\n" + "---\n");
    }
  });
}


module.exports = {
  ai:ai
};
