if ($app.env == $env.keyboard) {
  require("scripts/keyboard").render();
  if (!$cache.get("api"))
    $ui.error("請在 JSBox APP 啟動本腳本並輸入 OpenAI API", 10);
} else {
  require("scripts/app").render();
  if (!$cache.get("api")) {
    const inputAlert = require("scripts/inputAlert");
    const api = await inputAlert({ title: "輸入 OpenAI API" });
    $cache.set("api", api);
  }
}
