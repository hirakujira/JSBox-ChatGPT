var data = require("scripts/data");
var helper = require("scripts/helper");
const template = {
  props: {
    bgcolor: $color("clear")
  },
  views: [
    {
      type: "label",
      props: {
        id: "label1",
        font: $font(17)
      },
      layout: function (make, view) {
        make.left.inset(10);
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
        font: $font(17)
      },
      layout: function (make, view) {
        make.left.equalTo($("label1").right).inset(10);
        make.right.inset(10);
        make.top.bottom.inset(5);
      }
    }
  ]
};

function showItems(category) {
  var items = data.getItems(category);

  function createItem() {
    $input.text({
      handler: function (text) {
        if (text.length > 0) {
          $app.tips(
            "新增後點擊短語可填寫具體的 Prompt 前綴，若不輸入則預設為短語本身作為前綴"
          );
          items.unshift(text);
          var temp = $("list-items").data;
          $("list-items").data = [];
          temp.unshift({
            label1: {
              text: text
            },
            label2: {
              text: ""
            }
          });
          $("list-items").data = temp;
          //$("list-items").insert({ value: text, index: 0 })
          saveItems();
        }
      }
    });
  }

  function saveItems() {
    data.setItems(category, items);
  }

  $ui.push({
    props: {
      title: category
    },
    views: [
      {
        type: "button",
        props: {
          id: "btn-create-snippet",
          title: $l10n("CREATE_SNIPPET")
        },
        layout: function (make, view) {
          make.left.right.inset(10);
          make.bottom.inset(50);
          make.height.equalTo(44);
        },
        events: { tapped: createItem }
      },
      {
        type: "list",
        props: {
          id: "list-items",
          //data: items,
          template: template,
          reorder: true,
          actions: [
            {
              title: "delete",
              handler: function (sender, indexPath) {
                data.deleteDataPreText(items[indexPath.row]);
                helper.array_remove(items, indexPath.row);
                saveItems();
              }
            },
            {
              title: $l10n("CHECK"),
              handler: function (sender, indexPath) {
                //$ui.alert($("list-items").data[indexPath.row].label2.text)
                $ui.alert({
                  title: $l10n("TEMPLATE"),
                  message: $("list-items").data[indexPath.row].label2.text,
                  actions: [
                    {
                      title: $l10n("COPY"),
                      disabled: false, // Optional

                      handler: function () {
                        $clipboard.text = $("list-items").data[
                          indexPath.row
                        ].label2.text;
                      }
                    },
                    {
                      title: $l10n("CANCEL"),
                      //style: $alertActionType.destructive, // Optional
                      handler: function () {}
                    }
                  ]
                });
              }
            }
          ]
        },
        layout: function (make, view) {
          make.left.top.right.equalTo(0);
          make.bottom.equalTo($("btn-create-snippet").top).offset(-10);
        },
        events: {
          didSelect: function (sender, indexPath) {
            var item = items[indexPath.row];
            $input.text({
              placeholder: data.getPreTexts(item),
              text: data.getPreTexts(item),
              handler: function (text) {
                if (text.length > 0) {
                  data.setPreTexts(item, text);
                  applyTemplate(items);
                }
              }
            });
          },
          reorderMoved: function (fromIndexPath, toIndexPath) {
            helper.array_move(items, fromIndexPath.row, toIndexPath.row);
          },
          reorderFinished: function () {
            saveItems();
          }
        }
      }
    ]
  });

  applyTemplate(items);
}

function applyTemplate(items) {
  var temp = [];
  $("list-items").data = [];
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
  //console.log(temp)
  $("list-items").data = temp;
}

module.exports = {
  showItems: showItems
};
