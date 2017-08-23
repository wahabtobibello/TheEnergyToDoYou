(function (fabric, $) {
  'use strict';
  const maxchars = 10,
    placeholderText = "*TYPE HERE*",
    defaultBlack = "#292b2c",
    lucozadeRed = "#E5003B",
    acceptedFileTypes = ["image/jpeg", "image/png"],
    $addPhotoOnly = $('#addPhotoOnly'),
    $moreOptions = $('#moreOptions'),
    $saveLink = $('#saveLink'),
    $saveLinkBtn = $('#saveLinkBtn'),
    $startOver = $('#startOver'),
    $choosePhoto = $('#choose-photo'),
    $addPhoto = $('#add-photo'),
    $addMyPhoto = $('#add-my-photo'),
    $shareBtn = $('#shareBtn'),
    $fileInput = $("#file-input"),
    $shareModal = $("#share-modal"),
    $choosePhotoModal = $("#choose-photo-modal"),
    $slider = $("#slider"),
    $tool = $("#tools span"),
    $zoomTool = $("#zoom-tool"),
    $brightnessTool = $("#brightness-tool"),
    $contrastTool = $("#contrast-tool"),
    $loading = $('#loading span'),
    canvas = new fabric.Canvas('image-canvas', {
      width: 846,
      height: 846,
      selection: false,
      allowTouchScrolling: true,
      evented: false,
    }),
    renderClipArtAndTextbox = new Promise((resolve, reject) => {
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
    }),
    getAdjustedScale = (noOfChars) => {
      return (noOfChars - 1) * 0.6667 + 1;
    },
    convertCanvasToImage = canvas => {
      let image = new Image();
      image.src = canvas.toDataURL("image/png");
      return image;
    },
    saveAsCanvas = (canvas) => {
      if (saveAs !== undefined) {
        canvas.toBlobHD(function (blob) {
          saveAs(
            blob
            , "image.png"
          );
        }, "image/png");
      }
    },
    editFontSize = (parent, iText, size) => {
      if (size > 0)
        iText.scaleRatio = size;
      iText.scaleToHeight(parent.height / size);
    },
    addClipArt = (parent, clipArtObj, iText, textScaleRatio, placeholderObj) => {
      if (placeholderObj) {
        parent.add(placeholderObj);
      }
      clipArtObj.scaleToHeight(parent.height);
      clipArtObj.scaleToWidth(parent.width);
      editFontSize(parent, iText, textScaleRatio);
      parent.add(clipArtObj);
      parent.add(iText);
    },
    renderImage = (canvas, img) => {
      let clipArtObj = canvas.getObjects('path-group')[0];
      let textboxObj = canvas.getObjects('textbox')[0];
      let inputText = textboxObj.getText();
      let scaleRatio = textboxObj.scaleRatio;
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
      imageObj.on('mouseup', function (e) {
        rePositionImage(canvas, this);
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
      addClipArt(groupObj, clipArtObj, textObj, scaleRatio);
      clipArtObj.setLeft(0);
      clipArtObj.setTop(0);
      canvas.sendToBack(imageObj);
      return new Promise((resolve) => {
        resolve(true);
      });
    },
    animateScaleDown = (obj, scale) => {
      obj.animate("scaleX", obj.scaleX * scale, {
        duration: 1000,
        onChange: canvas.renderAll.bind(canvas),
        ease: "easeOutSine"
      }).animate("scaleY", obj.scaleY * scale, {
        duration: 1000,
        onChange: canvas.renderAll.bind(canvas),
        ease: "easeOutSine"
      });
      return true;
    },
    startUp = (canvas) => {
      canvas.clear();
      renderClipArtAndTextbox.then((clipArtObj) => {
        let textbox = new fabric.Textbox("", {
          fontFamily: "AvenyT-Black",
          textAlign: "center",
          fill: "#d80b2c",
          originX: "center",
          originY: "center",
          cursorColor: "#d80b2c",
          cursorWidth: 15,
          hasControls: false,
          hasRotatingPoint: false,
          hasBorders: false,
          lockMovementX: true,
          lockMovementY: true,
          width: 600,
          skewY: -10,
          top: 735,
          left: 432,
          scaleRatio: 4,
        });
        let placeholderObj = new fabric.Text(placeholderText, {
          left: 432,
          top: 735,
          fontFamily: "AvenyT-Black",
          fontSize: 110,
          opacity: 0.5,
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
        textbox.placeholderObj = placeholderObj;
        textbox.on('mouseup', function (e) {
          this.enterEditing();
        });
        textbox.on('changed', function (e) {
          let textStr = this.getText().toUpperCase();
          let length = textStr.length;
          if ($moreOptions.css('display') === "none") {
            $addPhotoOnly.show();
            activateButtonOnText($addPhotoOnly, textStr);
          } else {
            activateButtonOnText($moreOptions, textStr);

          }
          if (length > 6) {
            editFontSize(canvas, this, getAdjustedScale(length));
          } else {
            editFontSize(canvas, this, 4);
          }
          if (textStr !== "") {
            this.placeholderObj._set("opacity", 0);
          } else {
            this.placeholderObj._set("opacity", 0.5);
          }
          this.setText(textStr);
          canvas.renderAll();
        });
        clipArtObj.setTop(423);
        clipArtObj.setLeft(423);
        addClipArt(canvas, clipArtObj, textbox, 4, placeholderObj);
        // textbox.enterEditing();
        // canvas.setActiveObject(textbox);
        canvas.renderAll();
      });
    },
    filter = (imageObj, index, prop, value) => {
      if (value === undefined) {
        return imageObj.filters[index][prop];
      }
      if (imageObj.filters[index]) {
        imageObj.filters[index][prop] = value;
        imageObj.applyFilters(canvas.renderAll.bind(canvas));
      }
    },
    zoomToolHandler = () => {
      let imageObj = canvas.item(0);
      let value = $slider.slider('value');
      imageObj.setScaleX(imageObj.newScaleX * value);
      imageObj.setScaleY(imageObj.newScaleY * value);
      imageObj.setCoords();
      rePositionImage(canvas, imageObj);
      canvas.renderAll();
    },
    contrastToolHandler = () => { filter(canvas.item(0), 0, 'contrast', $slider.slider('value')) },
    brightnessToolHandler = () => { filter(canvas.item(0), 1, 'brightness', $slider.slider('value')) },
    rePositionImage = (canvas, imageObj) => {
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
    },
    activateButtonOnText = ($el, text) => {
      if (text === "")
        $el.find('button').attr('disabled', 'true');
      else {
        $el.find('button').removeAttr('disabled');
      }
    };
  fabric.Textbox.prototype.insertNewline = function (_super) {
    return function () { };
  }(fabric.Textbox.prototype.insertNewline);
  fabric.Textbox.prototype.initHiddenTextarea = function (_super) {
    return function () {
      _super.call(this);
      $(this.hiddenTextarea).attr('maxLength', maxchars);
      $(this.hiddenTextarea).attr('name', 'password');
    };
  }(fabric.Textbox.prototype.initHiddenTextarea);
  fabric.Textbox.prototype.onInput = function (_super) {
    return function (e) {
      while (this.text.length > this.hiddenTextarea.value.length) {
        this.removeChars(e);
      }
      _super.call(this, e);
    };
  }(fabric.Textbox.prototype.onInput);
  startUp(canvas);
  canvas.on('mouse:down', (e) => {
    canvas.forEachObject((obj) => {
      if (obj.type !== "image") {
        canvas.setActiveObject(obj);
      }
    });
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
    if (/iPhone/.test(navigator.userAgent) && !window.MSStream) {
      $(document).on("focus", "input, textarea, select", function () {
        $('meta[name=viewport]').remove();
        $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">');
      });

      $(document).on("blur", "input, textarea, select", function () {
        $('meta[name=viewport]').remove();
        $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1">');
      });
    }
  });
  $fileInput.click(function () {
    this.value = "";
  });
  $fileInput.change(function () {
    $choosePhotoModal.iziModal('close');
    $loading.css('z-index', '2');
    $loading.show();
    if (!this.files[0]) {
      console.error("No image selected");
      $loading.css('z-index', '0');
      $loading.hide();
      return;
    }
    if (acceptedFileTypes.indexOf(this.files[0].type) < 0) {
      $loading.css('z-index', '0');
      $loading.hide();
      return;
    }
    let u = URL.createObjectURL(this.files[0]);
    let img = new Image;
    img.src = u;
    img.onload = function () {
      renderImage(canvas, img).then((done) => {
        $loading.css('z-index', '0');
        $loading.hide();
        $addPhotoOnly.hide();
        $moreOptions.show();
        $contrastTool.css('color', lucozadeRed).click();
        animateScaleDown(canvas.item(1), 0.6);
      });
    };
  });
  $saveLinkBtn.click((e) => {
    saveAsCanvas(canvas.getElement());
  });
  $startOver.click((e) => {
    startUp(canvas);
    $moreOptions.hide();
  });
  $choosePhoto.click((e) => {
    e.preventDefault();
    $('#choose-photo-modal').iziModal('open');
  });
  $(document).on("click", "#add-my-photo", function (e) {
    $('#file-input').click();
  });
  $(document).on("click", "#add-photo", function (e) {
    $choosePhotoModal.iziModal('close');
    let img = new Image;
    img.src = $('.selected img')[0].src;
    renderImage(canvas, img).then((done) => {
      $loading.css('z-index', '0');
      $loading.hide();
      $addPhotoOnly.hide();
      $moreOptions.show();
      $contrastTool.css('color', lucozadeRed).click();
      animateScaleDown(canvas.item(1), 0.6);
    });
  });
  $shareBtn.click((e) => {
    e.preventDefault();
    $('#share-modal').iziModal('open');
  });
  $shareModal.iziModal({
    autoOpen: false,
    closeButton: true
  });
  $choosePhotoModal.iziModal({
    title: "Pick your photo",
    autoOpen: false,
    headerColor: lucozadeRed,
    width: 800,
    top: 50,
    bottom: 50,
    padding: 20,
    bodyOverflow: true,
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
    $slider.slider('option', 'min', -250);
    $slider.slider('option', 'max', 250);
    $slider.slider('option', 'step', 10);
    $slider.slider('option', 'change', contrastToolHandler);
    $slider.slider('option', 'value', filter(canvas.item(0), 0, 'contrast'));
  });
  $brightnessTool.click((e) => {
    $slider.slider('option', 'min', -250);
    $slider.slider('option', 'max', 250);
    $slider.slider('option', 'step', 10);
    $slider.slider('option', 'change', brightnessToolHandler);
    $slider.slider('option', 'value', filter(canvas.item(0), 1, 'brightness'));
  });
  $(document).on("click", "#choose-photo-modal li", function (e) {
    $("#choose-photo-modal li").removeClass('selected');
    $(this).addClass('selected');
  });
  share2social($, canvas.getElement());
}(fabric, jQuery));

