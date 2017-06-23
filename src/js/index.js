'use strict';
var Base64Binary = {
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

  /* will return a  Uint8Array type */
  decodeArrayBuffer: function (input) {
    var bytes = (input.length / 4) * 3;
    var ab = new ArrayBuffer(bytes);
    this.decode(input, ab);

    return ab;
  },

  decode: function (input, arrayBuffer) {
    //get last chars to see if are valid
    var lkey1 = this._keyStr.indexOf(input.charAt(input.length - 1));
    var lkey2 = this._keyStr.indexOf(input.charAt(input.length - 2));

    var bytes = (input.length / 4) * 3;
    if (lkey1 == 64) bytes--; //padding chars, so skip
    if (lkey2 == 64) bytes--; //padding chars, so skip

    var uarray;
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    var j = 0;

    if (arrayBuffer)
      uarray = new Uint8Array(arrayBuffer);
    else
      uarray = new Uint8Array(bytes);

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    for (i = 0; i < bytes; i += 3) {
      //get the 3 octects in 4 ascii chars
      enc1 = this._keyStr.indexOf(input.charAt(j++));
      enc2 = this._keyStr.indexOf(input.charAt(j++));
      enc3 = this._keyStr.indexOf(input.charAt(j++));
      enc4 = this._keyStr.indexOf(input.charAt(j++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      uarray[i] = chr1;
      if (enc3 != 64) uarray[i + 1] = chr2;
      if (enc4 != 64) uarray[i + 2] = chr3;
    }

    return uarray;
  }
};
(function (fabric, $, Base64Binary) {
  const maxchars = 10;
  const defaultBlack = "#292b2c";
  const lucozadeRed = "#E5003B";
  const $addPhotoOnly = $('#addPhotoOnly');
  const $moreOptions = $('#moreOptions');
  const $saveLink = $('#saveLink');
  const $saveLinkBtn = $('#saveLinkBtn');
  const $startOver = $('#startOver');
  const $addPhoto = $('#addPhoto');
  const $shareBtn = $('#shareBtn');
  const $fileInput = $("#file-input");
  const $shareModal = $("#share-modal");
  const $facebookShare = $("#facebook-share");
  const $twitterShare = $("#twitter-share");
  const $instagramShare = $("#instagram-share");
  const $slider = $("#slider");
  const $tool = $("#tools span");
  const $zoomTool = $("#zoom-tool");
  const $brightnessTool = $("#brightness-tool");
  const $contrastTool = $("#contrast-tool");
  const canvas = new fabric.Canvas('image-canvas', {
    width: 846,
    height: 846
  });
  const renderClipArtAndTextbox = new Promise((resolve, reject) => {
    fabric.loadSVGFromURL('./img/the-energy-to.svg', function (objects, options) {
      let clipArtObj = fabric.util.groupSVGElements(objects, options);
      clipArtObj.selectable = false;
      clipArtObj.evented = false;
      clipArtObj.hasControls = false;
      clipArtObj.hasRotatingPoint = false;
      clipArtObj.hasBorders = false;
      clipArtObj.setOriginX("center");
      clipArtObj.setOriginY("center");
      resolve(clipArtObj);
    }, () => { });
  });
  const convertCanvasToImage = canvas => {
    let image = new Image();
    image.src = canvas.toDataURL("image/png");
    return image;
  };
  const saveAsCanvas = (canvas) => {
    if (saveAs !== undefined) {
      canvas.toBlobHD(function (blob) {
        saveAs(
          blob
          , "image.png"
        );
      }, "image/png");
    }
  }
  const initializeTextbox = (textbox) => {
    canvas.setActiveObject(textbox);
    textbox.enterEditing();
    textbox.hiddenTextarea.canvas = canvas;
    textbox.hiddenTextarea.maxLength = maxchars;
    textbox.hiddenTextarea.focus();
    textbox.hiddenTextarea.onkeyup = (e) => {
      let canvas = e.target.canvas;
      let textbox = getObjectWithType(canvas, 'textbox');
      let inputText = textbox.text;
      let upperCase = e.key;
      let charCode = upperCase.charCodeAt(0);
      if ($moreOptions.css('display') === "none") {
        $addPhotoOnly.show();
        if (e.target.value === "")
          $addPhotoOnly.find('button').attr('disabled', 'true');
        else {
          $addPhotoOnly.find('button').removeAttr('disabled');
        }
      } else {
        if (e.target.value === "")
          $moreOptions.find('button').attr('disabled', 'true');
        else {
          $moreOptions.find('button').removeAttr('disabled');
        }
      }
      if (e.key === "Enter") {
        textbox.text = inputText.slice(0, inputText.length - 1);
        $fileInput.click();
      } else if (charCode >= 97 && charCode <= 122) {
        textbox.text = textbox.text.toUpperCase();
      }
      canvas.renderAll();
    };
  };
  const addClipArt = (parent, clipArtObj, iText) => {
    clipArtObj.scaleToHeight(parent.height);
    clipArtObj.scaleToWidth(parent.width);
    iText.scaleToHeight(parent.height / 4);
    parent.add(clipArtObj);
    parent.add(iText);
  };
  const getObjectWithType = (canvas, type) => {
    for (let i = 0; i < canvas.size(); i++) {
      let item = canvas.item(i);
      if (item.type === type) {
        return item;
      }
    }
    return null;
  }
  const renderImage = (canvas, img) => {
    let clipArtObj = getObjectWithType(canvas, "path-group");
    let inputText = getObjectWithType(canvas, "textbox").getText();
    let textObj = new fabric.Text(inputText, {
      left: 9,
      top: 312,
      fontFamily: "AvenyT-Black",
      textAlign: "center",
      fill: "#d80b2c",
      originX: "center",
      originY: "center",
      evented: false,
      hasControls: false,
      hasRotatingPoint: false,
      hasBorders: false,
      skewY: -10,
    });
    let imageObj = new fabric.Image(img, {
      hasRotatingPoint: false,
      hasControls: false,
      hasBorders: false,
      originX: "center",
      originY: "center",
      left: canvas.width / 2,
      top: canvas.height / 2,
    });
    let groupObj = new fabric.Group([], {
      hasControls: false,
      hasRotatingPoint: false,
      hasBorders: false,
      selectable: false,
      evented: false,
      width: 846,
      height: 846,
      originX: "center",
      originY: "center",
      left: canvas.width / 2,
      top: canvas.height / 2,
    });

    canvas.clear();
    canvas.defaultCursor = "default";
    canvas.add(imageObj);
    if (imageObj.width <= imageObj.height) {
      imageObj.scaleToWidth(imageObj.canvas.width);
    }
    else if (imageObj.width > imageObj.height) {
      imageObj.scaleToHeight(imageObj.canvas.height);
    }
    imageObj.newScaleX = imageObj.scaleX;
    imageObj.newScaleY = imageObj.scaleY;
    imageObj.filters.push(new fabric.Image.filters.Contrast({
      contrast: 0
    }));
    imageObj.filters.push(new fabric.Image.filters.Brightness({
      brightness: 0
    }));
    imageObj.applyFilters(canvas.renderAll.bind(canvas));

    canvas.add(groupObj);
    addClipArt(groupObj, clipArtObj, textObj);
    clipArtObj.setLeft(0);
    clipArtObj.setTop(0);

    canvas.sendToBack(imageObj);
    groupObj.animate("scaleX", groupObj.scaleX / 1.5, {
      duration: 700,
      onChange: canvas.renderAll.bind(canvas),
      ease: "easeOutSine"
    }).animate("scaleY", groupObj.scaleY / 1.5, {
      duration: 700,
      onChange: canvas.renderAll.bind(canvas),
      ease: "easeOutSine"
    });
  };
  const startUp = (canvas) => {
    canvas.clear();
    renderClipArtAndTextbox.then((clipArtObj) => {
      let textbox = new fabric.Textbox("", {
        fontFamily: "AvenyT-Black",
        textAlign: "center",
        fill: "#d80b2c",
        originX: "center",
        originY: "center",
        cursorColor: "#d80b2c",
        cursorWidth: 5,
        evented: true,
        hasControls: false,
        hasRotatingPoint: false,
        hasBorders: false,
        skewY: -10,
        top: 735,
        left: 432,
      });
      clipArtObj.setTop(423);
      clipArtObj.setLeft(423);
      addClipArt(canvas, clipArtObj, textbox);
      initializeTextbox(textbox);
    });
  };
  const filter = (imageObj, index, prop, value) => {
    if (value === undefined) {
      return imageObj.filters[index][prop];
    }
    if (imageObj.filters[index]) {
      imageObj.filters[index][prop] = value;
      imageObj.applyFilters(canvas.renderAll.bind(canvas));
    }
  }
  const zoomToolHandler = () => {
    let imageObj = canvas.item(0);
    let value = $slider.slider('value');
    imageObj.setScaleX(imageObj.newScaleX * value);
    imageObj.setScaleY(imageObj.newScaleY * value);
    imageObj.setCoords();
    rePositionImage(canvas, imageObj);
    canvas.renderAll();
  };
  const contrastToolHandler = () => { filter(canvas.item(0), 0, 'contrast', $slider.slider('value')) };
  const brightnessToolHandler = () => { filter(canvas.item(0), 1, 'brightness', $slider.slider('value')) };
  const rePositionImage = (canvas, imageObj) => {
    let tlX = imageObj.aCoords.tl.x;
    let tlY = imageObj.aCoords.tl.y;
    let brX = imageObj.aCoords.br.x;
    let brY = imageObj.aCoords.br.y;
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;
    let currentWidth = imageObj.width * imageObj.scaleX;
    let currentHeight = imageObj.height * imageObj.scaleY;
    if (tlX >= 0) {
      imageObj.setLeft(currentWidth / 2);
    }
    if (tlY >= 0) {
      imageObj.setTop(currentHeight / 2);
    }
    if (brX <= canvasWidth) {
      imageObj.setLeft(canvasWidth - (currentWidth / 2));
    }
    if (brY <= canvasHeight) {
      imageObj.setTop(canvasHeight - (currentHeight / 2));
    }
    imageObj.setCoords();
  };
  const postImageToFacebook = (authToken, filename, mimeType, imageData) => {
    // this is the multipart/form-data boundary we'll use
    var boundary = '----ThisIsTheBoundary1234567890';
    // let's encode our image file, which is contained in the var
    var formData = '--' + boundary + '\r\n'
    formData += 'Content-Disposition: form-data; name="source"; filename="' + filename + '"\r\n';
    formData += 'Content-Type: ' + mimeType + '\r\n\r\n';
    for (var i = 0; i < imageData.length; ++i) {
      formData += String.fromCharCode(imageData[i] & 0xff);
    }
    formData += '\r\n';
    formData += '--' + boundary + '--\r\n';

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://graph.facebook.com/me/photos?access_token=' + authToken, true);
    xhr.onload = xhr.onerror = function () {
      console.log(xhr.responseText);
      alert("Sent to Facebook!");
    };
    xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
    xhr.sendAsBinary(formData);
  };
  startUp(canvas);
  canvas.on('mouse:down', (e) => {
    for (let i = 0; i < canvas.size(); i++) {
      let item = canvas.item(i);
      if (item.type !== "image") {
        canvas.setActiveObject(item);
        break;
      }
    }
    canvas.renderAll();
  });
  canvas.on('mouse:up', (e) => {
    let activeObject = e.target;
    if (activeObject && activeObject.type === "image") {
      rePositionImage(canvas, activeObject);
    } else {
      initializeTextbox(getObjectWithType(canvas, "textbox"));
    }
    canvas.renderAll();
  });
  $(document).ready(function () {
    $("a").on('click', function (event) {
      if (this.hash !== "") {
        event.preventDefault();
        var hash = this.hash;
        $('html, body').animate({
          scrollTop: $(hash).offset().top
        }, 700, function () {
          window.location.hash = hash;
        });
      }
    });
  });
  $fileInput.click(function () {
    this.value = "";
  });
  $fileInput.change(function () {
    if (!this.files[0]) {
      console.error("No image selected");
      return;
    }
    let u = URL.createObjectURL(this.files[0]);
    let img = new Image;
    img.src = u;
    img.onload = function () {
      renderImage(canvas, img);
      $addPhotoOnly.hide();
      $moreOptions.show();
      $contrastTool.css('color', lucozadeRed);
      $contrastTool.click();
    };
  });
  $saveLinkBtn.click((e) => {
    saveAsCanvas(canvas.getElement());
  });
  $startOver.click((e) => {
    startUp(canvas);
    $moreOptions.hide();
  });
  $addPhoto.click((e) => {
    $('#file-input').click();
  });
  $shareBtn.click((e) => {
    e.preventDefault();
    $('#share-modal').iziModal('open');
  });
  $shareModal.iziModal({
    autoOpen: false,
    closeButton: true
  });
  $(document).on("click", "#facebook-share", function (e) {
    // TODO: Implement facebook share
    var data = canvas.toDataURL("image/png");
    var encodedPng = data.substring(data.indexOf(',') + 1, data.length);
    var decodedPng = Base64Binary.decode(encodedPng);
    FB.getLoginStatus(function (response) {
      if (response.status === "connected") {
        postImageToFacebook(response.authResponse.accessToken, "The Energy To Do You", "image/png", decodedPng, "#TheEnergyToDoYou");
      } else if (response.status === "not_authorized") {
        FB.login(function (response) {
          postImageToFacebook(response.authResponse.accessToken, "The Energy To Do You", "image/png", decodedPng, "#TheEnergyToDoYou");
        }, { scope: "publish_actions" });

      } else {
        FB.login(function (response) {
          postImageToFacebook(response.authResponse.accessToken, "The Energy To Do You", "image/png", decodedPng, "#TheEnergyToDoYou");
        }, { scope: "publish_actions" });
      }
    });
  });
  $(document).on("click", "#twitter-share", function (event) {
    // TODO: Implement twitter share
  });
  $(document).on("click", "#instagram-share", function (event) {
    // TODO: Implement instagram share
  });
  $slider.slider({
    orientation: "horizontal",
  });
  $tool.click((e) => {
    $tool.css('color', defaultBlack);
    $(e.target).css('color', lucozadeRed);
  });
  $zoomTool.click((e) => {
    $slider.slider('option', 'min', 1);
    $slider.slider('option', 'max', 5);
    $slider.slider('option', 'step', 0.1);
    $slider.slider('option', 'change', zoomToolHandler);
    $slider.slider('option', 'value', Math.round((canvas.item(0).scaleX / canvas.item(0).newScaleX) * 10) / 10);
  });
  $contrastTool.click((e) => {
    $slider.slider('option', 'min', -100);
    $slider.slider('option', 'max', 100);
    $slider.slider('option', 'step', 1);
    $slider.slider('option', 'change', contrastToolHandler);
    $slider.slider('option', 'value', filter(canvas.item(0), 0, 'contrast'));
  });
  $brightnessTool.click((e) => {
    $slider.slider('option', 'min', -100);
    $slider.slider('option', 'max', 100);
    $slider.slider('option', 'step', 1);
    $slider.slider('option', 'change', brightnessToolHandler);
    $slider.slider('option', 'value', filter(canvas.item(0), 1, 'brightness'));
  });
  if (XMLHttpRequest.prototype.sendAsBinary === undefined) {
    XMLHttpRequest.prototype.sendAsBinary = function (string) {
      var bytes = Array.prototype.map.call(string, function (c) {
        return c.charCodeAt(0) & 0xff;
      });
      this.send(new Uint8Array(bytes).buffer);
    };
  };
}(fabric, jQuery, Base64Binary));

