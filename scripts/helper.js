var LocalDataPath = "JBChat-Record.md";
function array_move(array, oldIndex, newIndex) {
  if (newIndex >= array.length) {
    var k = newIndex - array.length + 1;
    while (k--) {
      array.push(undefined);
    }
  }
  array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
}

function array_remove(array, index) {
  array.splice(index, 1);
}

function writeResp(time, player, prompt) {
  if ($drive.exists(LocalDataPath)) {
    var file = $drive.read(LocalDataPath);
    sizeAlert(file.info.size);
    var Record = file.string;
  } else {
    Record = "";
  }
  Record = Record + time + "\n" + player + ": " + prompt + "\n";
  $drive.write({
    data: $data({ string: Record }),
    path: LocalDataPath
  });
}

function sizeAlert(size) {
  var savedFileSize = $cache.get("savedFileSize") || 0.1;
  var currentFileSize = size / 1000 / 1000;
  //$ui.toast("csize:"+currentFileSize+" ssize:"+savedFileSize)
  if (Math.floor(currentFileSize) - Math.floor(savedFileSize) >= 1) {
    $cache.set("savedFileSize", currentFileSize);
    $ui.error("目前已紀錄 " + (size / 1000000).toFixed(1) + " KB 的檔案", 5);
  } else $ui.clearToast();
}

function time() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();

  today =
    yyyy +
    "-" +
    at(mm) +
    "-" +
    at(dd) +
    " " +
    at(today.getHours()) +
    ":" +
    at(today.getMinutes()) +
    ":" +
    at(today.getSeconds());

  return today;
}

function at(s) {
  if (s < 10) s = "0" + s;
  return s;
}


module.exports = {
  array_move: array_move,
  array_remove: array_remove,
  writeResp:writeResp,
  time:time
};
