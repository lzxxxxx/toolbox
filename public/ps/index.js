'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(function () {
  /**
   * 刚开始进页面的时候， 
   * 
   * 
   */
  /**
   * 在还没预览的时候是下载原图
   * 还没打开图片的时候不允许下载或者预览图片，表现为打开按钮红色闪烁
   * 
   * 数据格式：
    * Coordlist = {
    *  1: {
    *    x:50,y:50
    * }
    * 2: {
    *   x:50,y:50
    * }
    * ...
    * }
   * @class Toolbar
   */
  var Toolbar = function () {
    function Toolbar() {
      _classCallCheck(this, Toolbar);

      this.dom_obj = window.Dom_obj;
      this.handleSelect();
      this.handlePreview();
      this.handleMakeinput();
      this.handleDownload();
      this.handleSave();
      this.handleEmpty();
    }

    _createClass(Toolbar, [{
      key: 'handleSelect',
      value: function handleSelect() {
        //上传图片
        var _this = this;
        this.dom_obj.select_btn.on('change', function (evt) {
          var file = this.files[0];
          var postfix = file.type;
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function () {
            var urlbase64 = reader.result;
            Common_func._setuploadURL(urlbase64, postfix);
            Common_func._setDownURL(urlbase64);
            //清空全部输入框
            var arr = $('.target textarea');
            Common_func._deleteinput(arr);
          };
        });
      }
    }, {
      key: 'handlePreview',
      value: function handlePreview() {
        var _this = this;
        this.dom_obj.preview_btn.on('click', function (evt) {
          _this._screenShot.call(_this, _this.dom_obj);
        });
      }
    }, {
      key: 'handleMakeinput',
      value: function handleMakeinput() {
        var _this = this;
        this.dom_obj.makeinput_btn.on('click', function (evt) {
          var url = _this.dom_obj.download_btn.attr('href');
          if (!url) {
            Common_func._warningSelectbtn(_this.dom_obj);
            return false;
          }
          Common_func._handleInputevent();
        });
      }
    }, {
      key: 'handleDownload',
      value: function handleDownload() {
        var _this = this;
        this.dom_obj.download_btn.on('click', function (evt) {
          var url = $(evt.currentTarget).attr('href');
          if (!url) {
            Common_func._warningSelectbtn(_this.dom_obj);
            return false;
          }
        });
      }
    }, {
      key: 'handleSave',
      value: function handleSave() {
        //生成coordlist数据
        var _this = this;
        this.dom_obj.save_btn.on('click', function (evt) {
          var url = _this.dom_obj.download_btn.attr('href');
          if (!url) {
            Common_func._warningSelectbtn(_this.dom_obj);
            return false;
          }
          for (var item in Coordlist['inputs']) {
            //清空全部输入框重新加
            delete Coordlist['inputs'][item];
          }
          var src = _this.dom_obj.upload_img.attr('src');
          var postfix = _this.dom_obj.upload_img.attr('data-postfix');
          Coordlist.imgsrc = src;
          Coordlist.postfix = postfix;
          var textareas = [].slice.call($('.target textarea'));
          textareas.forEach(function (textarea_item) {
            var csslist = window.getComputedStyle(textarea_item);
            var id = textarea_item.getAttribute('data-id');
            Coordlist['inputs'][id] = new Inputbox({
              top: csslist['top'],
              left: csslist['left'],
              color: csslist['color'],
              fontsize: csslist['font-size'],
              fontweight: csslist['font-weight'],
              val: textarea_item.value
            });
          });
          console.log(Coordlist);
          //这里交接金凯的indexdb接口
          _savetoIndexdb(Coordlist);
        });
      }
    }, {
      key: 'handleEmpty',
      value: function handleEmpty() {
        var _this = this;
        this.dom_obj.empty_btn.on('click', function (evt) {
          var arr = $('.target textarea');
          Common_func._deleteinput(arr);
        });
      }
    }, {
      key: 'createCanvas',
      value: function createCanvas(w, h) {
        var c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        c.ctx = c.getContext("2d");
        // document.body.appendChild(c);
        return c;
      }
    }, {
      key: 'subPixelBitmap',
      value: function subPixelBitmap(imgData) {
        var spR, spG, spB; // sub pixels
        var id, id1; // pixel indexes
        var w = imgData.width;
        var h = imgData.height;
        var d = imgData.data;
        var x, y;
        var ww = w * 4;
        var ww4 = ww + 4;
        for (y = 0; y < h; y += 1) {
          for (x = 0; x < w; x += 3) {
            var id = y * ww + x * 4;
            var id1 = Math.floor(y) * ww + Math.floor(x / 3) * 4;
            spR = Math.sqrt(d[id + 0] * d[id + 0] * 0.2126 + d[id + 1] * d[id + 1] * 0.7152 + d[id + 2] * d[id + 2] * 0.0722);
            id += 4;
            spG = Math.sqrt(d[id + 0] * d[id + 0] * 0.2126 + d[id + 1] * d[id + 1] * 0.7152 + d[id + 2] * d[id + 2] * 0.0722);
            id += 4;
            spB = Math.sqrt(d[id + 0] * d[id + 0] * 0.2126 + d[id + 1] * d[id + 1] * 0.7152 + d[id + 2] * d[id + 2] * 0.0722);

            d[id1++] = spR;
            d[id1++] = spG;
            d[id1++] = spB;
            d[id1++] = 255; // alpha always 255
          }
        }
        return imgData;
      }
    }, {
      key: 'subPixelText',
      value: function subPixelText(ctx, text, x, y, fontHeight) {
        var _this = this;
        var width = ctx.measureText(text).width + 12; // add some extra pixels
        var hOffset = Math.floor(fontHeight * 0.7);
        var c = _this.createCanvas(width * 3, fontHeight);
        c.ctx.font = ctx.font;
        c.ctx.fillStyle = ctx.fillStyle;
        c.ctx.fontAlign = "left";
        c.ctx.setTransform(3, 0, 0, 1, 0, 0); // scale by 3
        // turn of smoothing
        c.ctx.imageSmoothingEnabled = false;
        c.ctx.mozImageSmoothingEnabled = false;
        // copy existing pixels to new canvas
        c.ctx.drawImage(ctx.canvas, x - 2, y - hOffset, width, fontHeight, 0, 0, width, fontHeight);
        c.ctx.fillText(text, 0, hOffset); // draw thw text 3 time the width
        // convert to sub pixel 
        c.ctx.putImageData(_this.subPixelBitmap(c.ctx.getImageData(0, 0, width * 3, fontHeight)), 0, 0);
        ctx.drawImage(c, 0, 0, width - 1, fontHeight, x, y - hOffset, width - 1, fontHeight);
        // done
      }
    }, {
      key: '_screenShot',
      value: function _screenShot() {
        var _this = this;
        var target_ele = $('.target');
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var devicePixelRatio = window.devicePixelRatio || 1;
        var backingStoreRatio = context.webkitBackingStorePixelRatio || 1;
        var ratio = devicePixelRatio / backingStoreRatio;
        ratio = 1;
        canvas.width = target_ele.width() * ratio;
        canvas.height = target_ele.height() * ratio;
        canvas.style.width = target_ele.width() + 'px';
        canvas.style.height = target_ele.height() + 'px';
        context.scale(ratio, ratio);
        context.drawImage(window.Dom_obj.upload_img[0], 0, 0, target_ele.width(), target_ele.height());
        var textareas = [].slice.call($('.target textarea'));
        textareas.forEach(function (textarea_item) {
          var csslist = window.getComputedStyle(textarea_item);
          context.font = csslist['font-weight'] + ' ' + csslist['font-size'] + ' ' + csslist['font-family'];
          canvas.textAlign = "start";
          context.color = csslist['color'];
          var x = parseInt(csslist['left']);
          var y = parseInt(csslist['top']) + parseInt(csslist.height) / 2;
          // context.fillText(textarea_item.value,x,y);
          _this.subPixelText(context, textarea_item.value, x, y, canvas.height);
        });
        var postfix = _this.dom_obj.upload_img.attr('data-postfix');
        //在这里重新处理 canvas
        _this.dom_obj.download_img.attr('src', canvas.toDataURL(postfix, 0.9)).attr('type', postfix);
        Common_func._setDownURL(_this.dom_obj.download_img.attr('src'));
        //解决模糊问题
        // var devicePixelRatio = window.devicePixelRatio || 1;
        // var backingStoreRatio = context.webkitBackingStorePixelRatio || 1;
        // var ratio = devicePixelRatio / backingStoreRatio;
        // ratio = 1;

        // canvas.width = target_ele.width() * ratio;
        // canvas.height = target_ele.height() * ratio;
        // canvas.style.width = target_ele.width()+'px';
        // canvas.style.height = target_ele.height()+'px';
        // context = canvas.getContext('2d');
        // context.scale(ratio,ratio);
        // context.translate( (target_ele.width()-window.innerWidth)/2, -217 );//


        // //在这之前把每一个框都用 Canvas 放大，然后放回去。再导出成一倍图片
        // var arr = $('.target textarea');
        // for(var i=0;i<arr.length;i++){
        //   var _this = this;
        //   var canvasitem = document.createElement('canvas');
        //   var contextitem = canvasitem.getContext('2d');
        //   var devicePixelRatio = window.devicePixelRatio || 1;
        //   var backingStoreRatio = contextitem.webkitBackingStorePixelRatio || 1;
        //   var ratio = devicePixelRatio / backingStoreRatio;
        //   canvasitem.width = $(arr[i]).width() * ratio;
        //   canvasitem.height = $(arr[i]).height() * ratio;
        //   canvasitem.style.width = $(arr[i]).width()+'px';
        //   canvasitem.style.height = $(arr[i]).height()+'px';
        //   context = canvasitem.getContext('2d');

        //   $(canvasitem).css('position','absolute').css('left',parseInt($(arr[i]).css('left'))).css('top',parseInt($(arr[i]).css('top')));
        //   console.log(arr[i]);
        //   html2canvas(arr[i],{
        //     canvas: canvasitem,
        //     onrendered: function(canvas){
        //       //设置 canvas的位置与 arr[item] 相同
        //         $('.target').append(canvasitem);
        //     }
        //   })
        // }

        // setTimeout(function(){
        //   html2canvas($('.target')[0],{
        //     canvas: canvas,
        //     onrendered: function(canvas){
        //       var postfix = _this.dom_obj.upload_img.attr('data-postfix');
        //       _this.dom_obj.download_img.attr('src',canvas.toDataURL(postfix, 0.9));
        //       Common_func._setDownURL(_this.dom_obj.download_img.attr('src'));
        //     }
        //   })
        // },1000); 
      }
    }]);

    return Toolbar;
  }();

  ;

  var Inputbox = function Inputbox(opt) {
    _classCallCheck(this, Inputbox);

    // [this] = [opt];
    for (var prop in opt) {
      this[prop] = opt[prop];
    }
  };

  function _savetoIndexdb(Coordlist) {
    /**
     * 如果是旧的，直接删除旧的，把新的放上，用原有的名字
     * 如果是新的，新加一条。id加一
     */
    // if(isOld){
    //   deleteData(id);
    //   putData(data);
    // }
    // else {
    //   putData(data);
    // }
    // INDEXDB.getDataByKey(1002,function(res){
    //   console.log(res);
    // });
    //传进去的一定是数组
    INDEXDB.addData([Coordlist]);
  }

  /**
   * 公共工具方法部分
   */
  var Common_func = {
    _setDownURL: function _setDownURL(val) {
      //设置下载按钮的url
      window.Dom_obj.download_btn.attr('href', val);
    },
    _handleDrag: function _handleDrag(ele) {
      //超出框的时候会被删除
      ele.on('dragend', function (evt) {
        var target = $(evt.currentTarget);
        var targetdom = $('.target');
        if (evt.clientX <= targetdom[0].offsetLeft - target.width() || evt.clientX >= targetdom[0].offsetLeft - 0 + targetdom.width() || evt.clientY <= targetdom[0].offsetTop || evt.clientY >= targetdom[0].offsetTop - 0 + targetdom.height() + target.height()) {
          Common_func._deleteinput(target);
          return;
        }
        var x = evt.clientX - targetdom[0].offsetLeft;
        var y = evt.clientY - targetdom[0].offsetTop - target.height();
        target.css('left', x).css('top', y);
        //判断只有输入了文字才取消背景色，不然找不到
        target.val().trim().length > 0 ? target.removeClass('new') : target.addClass('new');
      });
    },
    _handleInputevent: function _handleInputevent(inputs) {
      //创建输入框，定位并追加到dom结构中,设置框的颜色字体大小是否加粗和位置
      var hackdata = { 1: {
          color: 'rgb(0,0,0)',
          fontweight: '300',
          fontsize: '16px',
          left: '0px',
          top: '0px',
          val: '' } };
      inputs = inputs || hackdata;
      for (var inputkey in inputs) {
        var input = document.createElement('textarea');
        var inputval = inputs[inputkey];
        $(input).addClass('drag new').css('top', inputval.top).css('left', inputval.left).css('color', inputval.color).css('fontSize', inputval.fontsize).css('fontWeight', inputval.fontweight).val(inputval.val).attr('draggable', true).attr('data-id', ++Coordlist.curid).attr('placeholder', '在这里输入你的内容');
        Common_func._handleDrag($(input));
        _handleChoose($(input));
        $('.target').append($(input));
      }
    },
    _setuploadURL: function _setuploadURL(url, postfix) {
      $('.border.hidden').removeClass('hidden');
      window.Dom_obj.upload_img.attr('src', url).attr('data-postfix', postfix);
    },

    _deleteinput: function _deleteinput(input_dom) {
      //兼容字符串格式
      var arr = [].concat(input_dom);
      arr.forEach(function (item) {
        item.remove();
      });
    },
    _warningSelectbtn: function _warningSelectbtn() {
      //用来给打开按钮置红提醒
      window.Dom_obj.select_btn_replace.addClass('warning');
      setTimeout(function () {
        window.Dom_obj.select_btn_replace.removeClass('warning');
      }, 2000);
    },
    rgbToHex: function rgbToHex(rgb) {
      //给rgb值转16进制
      var color = rgb.toString().match(/\d+/g); // 把 x,y,z 推送到 color 数组里
      var hex = "#";
      for (var i = 0; i < 3; i++) {
        hex += ("0" + Number(color[i]).toString(16)).slice(-2);
      }
      return hex;
    }
  };

  /**
   * handlechange 和 handlechoose方法是专门给单个设置textarea设置样式的
   * 前提是输入框得有自己的data-id
   * @param {any} ele 
   */
  function _handleChoose(ele) {
    ele.on('click', function (evt) {
      var style = window.getComputedStyle(ele[0]);
      var color = Common_func.rgbToHex(style.color);
      var fontsize = style.fontSize;
      var strong = style.fontWeight > '300' ? true : false;
      $('.font_control .color').val(color);
      $('.font_control .fontsize').val(parseInt(fontsize));
      strong ? $('.font_control .strong').addClass('selected') : $('.font_control .strong').removeClass('selected');
      $('.font_control').attr('data-id', $(evt.currentTarget).attr('data-id'));
    });
  }

  function _handleChange() {
    $('.font_control .color').on('change', function (evt) {
      var id = $('.font_control').attr('data-id');
      var active_textarea = $('.target textarea[data-id=' + id + ']');
      var val = $(evt.currentTarget).val();
      active_textarea.css('color', val);
    });
    $('.font_control .fontsize').on('input', function (evt) {
      var id = $('.font_control').attr('data-id');
      var active_textarea = $('.target textarea[data-id=' + id + ']');
      var val = $(evt.currentTarget).val();
      active_textarea.css('fontSize', val + 'px');
    });
    $('.font_control .strong').on('click', function (evt) {
      var id = $('.font_control').attr('data-id');
      var active_textarea = $('.target textarea[data-id=' + id + ']');
      var isSelected = evt.currentTarget.className.indexOf('selected') > 0;
      if (isSelected) {
        $(evt.currentTarget).removeClass('selected');
      } else {
        $(evt.currentTarget).addClass('selected');
      }
      var val = isSelected ? '300' : '500';
      active_textarea.css('fontWeight', val);
    });
  }

  /**
   * 存入indexdb的方法和从indexdb中读取
   */
  function getIndexdbData() {
    //拿出一个固定的对象，先实验是否能重绘到屏幕上
    // INDEXDB
    var obj = null;
    INDEXDB.getLastitem(function (item) {
      if (!item) {
        console.log('获取最后一项失败');
        return;
      }
      var getdb = confirm('是否加载上次内容？');
      if (!getdb) {
        return;
      }
      obj = item;
      Common_func._setuploadURL(obj.imgsrc, obj.postfix);
      Common_func._setDownURL(obj.imgsrc);
      Common_func._handleInputevent(obj.inputs);
    });
  }

  (function init() {
    var element_obj = {
      upload_btn: $('.J_upload'),
      select_btn_replace: $('.J_select_replace'),
      select_btn: $('.J_select'),
      imgurl_input: $('.J_imgurl'),
      preview_btn: $('.J_preview'),
      download_btn: $('.J_download'),
      upload_img: $('.J_img'),
      drag_input: $('.drag'),
      download_img: $('.J_imgres'),
      makeinput_btn: $('.J_makeinput'),
      save_btn: $('.J_saveto_indexdb'),
      empty_btn: $('.J_empty')
    };
    window.Dom_obj = element_obj;
    var toolbar = new Toolbar();
    window.Coordlist = {};
    Object.defineProperty(Coordlist, 'curid', {
      configurable: true,
      enumerable: true,
      value: 0,
      writable: true
    });
    Object.defineProperty(Coordlist, 'imgsrc', {
      configurable: true,
      enumerable: true,
      value: '',
      writable: true
    });
    Object.defineProperty(Coordlist, 'inputs', {
      configurable: true,
      enumerable: true,
      value: {},
      writable: true
    });
    _handleChange();
    INDEXDB.openDB().then(function () {
      getIndexdbData();
    });
  })();
});