(function (fabric, $) {
  'use strict';
  const maxchars = 10,
    defaultBlack = "#292b2c",
    lucozadeRed = "#E5003B",
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
      height: 846
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
    initializeTextbox = (textbox) => {
      canvas.setActiveObject(textbox);
      textbox.enterEditing();
      textbox.hiddenTextarea.canvas = canvas;
      textbox.hiddenTextarea.maxLength = maxchars;
      $(textbox.hiddenTextarea).maxlength({ max: maxchars, showFeedback: false });
      textbox.hiddenTextarea.focus();
      textbox.hiddenTextarea.onkeyup = (e) => {
        let canvas = e.target.canvas;
        let textbox = getObjectWithType(canvas, 'textbox');
        let inputText = e.target.value;
        let textLength = inputText.length;
        let key = e.key || e.keyIdentifier;
        let lastCharCode = inputText.charCodeAt(textLength - 1);
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
        if (key === "Enter") {
          e.target.value = inputText.slice(0, inputText.length - 1);
          textbox.text = e.target.value;
          $choosePhoto.click();
        }
        if (lastCharCode >= 97 && lastCharCode <= 122) {
          e.target.value = inputText.toUpperCase();
          textbox.text = e.target.value;
        }
        if (textLength > 6) {
          editFontSize(canvas, textbox, getAdjustedScale(textLength));
        } else {
          editFontSize(canvas, textbox, 4);
        }
        canvas.renderAll();
      };
    },
    addClipArt = (parent, clipArtObj, iText, textScaleRatio) => {
      clipArtObj.scaleToHeight(parent.height);
      clipArtObj.scaleToWidth(parent.width);
      editFontSize(parent, iText, textScaleRatio);
      parent.add(clipArtObj);
      parent.add(iText);
    },
    getObjectWithType = (canvas, type) => {
      for (let i = 0; i < canvas.size(); i++) {
        let item = canvas.item(i);
        if (item.type === type) {
          return item;
        }
      }
      return null;
    },
    renderImage = (canvas, img) => {
      let clipArtObj = getObjectWithType(canvas, "path-group");
      let textboxObj = getObjectWithType(canvas, "textbox");
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
          cursorWidth: 5,
          evented: true,
          hasControls: false,
          hasRotatingPoint: false,
          hasBorders: false,
          skewY: -10,
          top: 735,
          left: 432,
          scaleRatio: 4,
        });
        clipArtObj.setTop(423);
        clipArtObj.setLeft(423);
        addClipArt(canvas, clipArtObj, textbox, 4);
        initializeTextbox(textbox);
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
      renderImage(canvas, img).then((done) => {
        $loading.css('z-index', '0');
        $loading.hide();
        $addPhotoOnly.hide();
        $moreOptions.show();
        $contrastTool.css('color', lucozadeRed).click();
        animateScaleDown(canvas.item(1), 0.6);
        $choosePhotoModal.iziModal('close');
      });
    };
    $loading.css('z-index', '2');
    $loading.show();
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
    renderImage(canvas, $('.selected img')[0]).then((done) => {
      $loading.css('z-index', '0');
      $loading.hide();
      $addPhotoOnly.hide();
      $moreOptions.show();
      $contrastTool.css('color', lucozadeRed).click();
      animateScaleDown(canvas.item(1), 0.6);
      $choosePhotoModal.iziModal('close');
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
    $slider.slider('option', 'min', -100);
    $slider.slider('option', 'max', 100);
    $slider.slider('option', 'step', 10);
    $slider.slider('option', 'change', contrastToolHandler);
    $slider.slider('option', 'value', filter(canvas.item(0), 0, 'contrast'));
  });
  $brightnessTool.click((e) => {
    $slider.slider('option', 'min', -100);
    $slider.slider('option', 'max', 100);
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

