var data = require("scripts/data");
var help = require("scripts/helper")
var openai = require("scripts/openai")
var categories = data.getCategories();
var textMode = "selected";
var model = $cache.get("model")?$cache.get("model"): "ChatGPT"
const template = {
  props: {
    bgcolor: $color("clear")
  },
  views: [
    {
      type: "label",
      props: {
        id: "label1",
        font: $font(16)
      },
      layout: function (make, view) {
        make.left.inset(15);
        make.top.bottom.inset(5);
      }
    },
    {
      type: "label",
      props: {
        id: "label2",
        //bgcolor: $color(""),
        textColor: $color("#aaaaaa"),
        //align: $align.left,
        font: $font(13)
      },
      layout: function (make, view) {
        make.left.equalTo($("label1").right).inset(10);
        make.right.inset(10);

        make.top.bottom.inset(5);
      }
    }
  ]
};

function render() {
  $ui.render({
    props: {
      //bgcolor: $color("#dddddd")
    },
    views: [
      {
        type: "tab",
        props: {
          items: categories,
          //bgcolor: $color("#dddddd"),
          id: "tab"
        },
        layout: function (make, view) {
          make.left.top.inset(10);
          make.right.inset(150)
         
        },
        events: {
          changed: function (sender) {
            applyTemplate(data.getItems(categories[sender.index]));
          }
        }
      },
      {
        type: "button",
        props: {
          title: "選取",
          //titleColor: $color("black"),
          //bgcolor: $color("#D0D0D1"),
          font: $font(13),
          id: "textMode"
        },
        layout: function (make, view) {
          make.top.inset(10);
          make.left.equalTo($("tab").right).offset(10)
          make.height.equalTo(30);
          make.width.equalTo(60);
        },
        events: {
          tapped: function (sender) {
            if (textMode == "selected") {
              textMode = "clip";
              $("textMode").title = "剪貼簿";
            } else {
              textMode = "selected";
              $("textMode").title = "選取";
            }
          },longPressed: function(sender) {
          $device.taptic(2);
          $app.openURL("jsbox://run?name=JBChat")
          
        },
        }
      },{
        type: "button",
        props: {
          title: model,
          //titleColor: $color("black"),
          //bgcolor: $color("#D0D0D1"),
          font: $font("AvenirNextCondensed-DemiBoldItalic",13),
          id: "model"
        },
        layout: function (make, view) {
          make.top.inset(10);
          make.left.equalTo($("textMode").right).offset(10);
          make.height.equalTo(30);
          make.width.equalTo(60);
        },
        events: {
          tapped: function (sender) {
            if (model == "ChatGPT") {
              model = "GPT3";
              $("model").title = model;
              
            } else {
              model = "ChatGPT";
              $("model").title = model;
            }
            $cache.set("model",model)
          }
        }
      },
      {
        type: "list",
        props: {
          //data: data.getItems(categories[0]),
          rowHeight: 35,
          template: template,
          id: "list"
          //bgcolor: $color("#dddddd")
        },
        layout: function (make, view) {
          make.top.equalTo($("tab").bottom).offset(10);
          make.left.right.bottom.equalTo(0);
          
        },
        events: {
          didSelect: function (sender, indexPath) {
            let text = "";
            if (textMode == "selected") {
              text = $keyboard.selectedText;
              if (!text) {
                $ui.error("請選取文字");
                return;
              }
            } else {
              text = $clipboard.text;
              if (!text) {
                $ui.error("請複製文字");
                return;
              }
            }
            var title = $("list").data[indexPath.row].label1.text;
            $keyboard.playInputClick();
            $device.taptic(1);
            var prePrompt = title == "無前綴" ? "" : data.getPreTexts(title);
            var t = prePrompt == ""?text + "\n":prePrompt + ":" + text + "\n"
            help.writeResp(help.time(), "Me📱", t);
            openai.ai($cache.get("model"),title, text);
          }
        }
      },
      
    ]
  });
  applyTemplate(data.getItems(categories[0]));
}

function applyTemplate(items) {
  var temp = [];
  $("list").data = [];
  for (let i = 0; i < items.length; i++) {
    if (data.getPreTexts(items[i]) == items[i]) {
      temp = temp.concat({
        label1: {
          text: items[i]
        },
        label2: {
          text: ""
        }
      });
    } else {
      temp = temp.concat({
        label1: {
          text: items[i]
        },
        label2: {
          text: data.getPreTexts(items[i])
        }
      });
    }
  }
  $("list").data = temp;
}



module.exports = {
  render: render
};
