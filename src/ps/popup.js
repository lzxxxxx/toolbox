function getALB(alb){
  var resultStr = '';
  var replaceArr = alb.split(/\s*[a-zA-Z]+([\s*]?|[.*]?|[!*]?)*[a-zA-Z]+\s*/ig);
  console.log('没有处理的数组',replaceArr);
  var enArr = alb.match(/\s*[a-zA-Z]+([\s*]?|[.*]?|[!*]?)*[a-zA-Z]+\s*/ig);
  console.log('英文数组',enArr);
  for (var i = 0; i < replaceArr.length; i++) {
    var str = replaceArr[i];
    if(str == undefined || str.trim() == "") {
      replaceArr.splice(i,1);
      i--;
    }
  }
  console.log('处理后的数组',replaceArr);
  if(enArr == null || enArr.length == 0) {
    return alb;
  } else if(enArr.length == 1) {
    var regStr = enArr[0];
    var index = alb.indexOf(regStr);
    regStr = spaceTransform(regStr);
    var sigleStr = '';
    if(index == 0) {
      //Miبحث
      sigleStr =  replaceArr[0] + regStr;
    } else if(index == alb.length-regStr.length) {
      //بحثMi
      sigleStr = regStr + replaceArr[0];
    } else {
      //بحثMiبحث
      sigleStr = replaceArr[0] + regStr + replaceArr[1];
    }
    return sigleStr;
  } else {
    for (var i = replaceArr.length - 1; i >= 0; i--) {
      var str = replaceArr[i];
      resultStr = resultStr + str;

      var insertEn = spaceTransform(enArr[i-1]);
      if(insertEn != undefined)
         resultStr += insertEn
    }
    return resultStr;
  }
  
}
//空格翻转
function spaceTransform(str){
  if(str == undefined) {
    return undefined;
  }
  var charArr = Array.from(str);
  var beginSpace = '';
  var endSpace = '';
  for (var i = 0; i < charArr.length; i++) {
    var s = charArr[i];
    if(s == ' '){
      beginSpace+=' ';
    }else{
      break;
    }
  }
  for (var i = charArr.length - 1; i >= 0; i--) {
    var s = charArr[i];
    if(s == ' '){
      endSpace+=' ';
    }else{
      break;
    }
  }
  return endSpace + str.trim() + beginSpace;
}


chrome.tabs.executeScript( {
  code: "window.getSelection().toString();"
}, function(selection) {
  console.log(selection);
  document.getElementById('result').value = getALB(selection[0]);
});

