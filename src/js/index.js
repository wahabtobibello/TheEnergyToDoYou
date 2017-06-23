'use strict';
(function (fabric, $) {

  /***************************Constants****************************/
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

  /***************************Constants****************************/
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
  share2social($, canvas.getElement());
}(fabric, jQuery));

