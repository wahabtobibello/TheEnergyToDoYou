/**
 * Created by BelloPC on 17/05/2017.
 */
'use strict';

(function () {
    const maxchars = 10;
    const $addPhotoOnly = $('#addPhotoOnly');
    const $moreOptions = $('#moreOptions');
    const $saveLink = $('#saveLink');
    const $saveLinkBtn = $('#saveLinkBtn');
    const $startOver = $('#startOver');
    const $addPhoto = $('#addPhoto');
    const $shareBtn = $('#shareBtn');
    const convertCanvasToImage = canvas => {
        let image = new Image();
        image.src = canvas.toDataURL("image/png");
        return image;
    };
    const initializeTextbox = (textbox) => {
        canvas.setActiveObject(textbox);
        textbox.enterEditing();
        textbox.hiddenTextarea.maxLength = maxchars;
        textbox.hiddenTextarea.focus();
        textbox.hiddenTextarea.onkeyup = (e) => {
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
        };
    };
    const startUp = (canvas) => {
        let textbox = new fabric.Textbox("", {
            fontFamily: "AvenyT-Black",
            textAlign: "center",
            fill: "#d80b2c",
            originX: "center",
            originY: "center",
            cursorColor: "#d80b2c",
            cursorWidth: 5,
            evented: false,
            hasControls: false,
            hasRotatingPoint: false,
            hasBorders: false,
            skewY: -10,
            top: canvas.height * 2 / 2.63
        });
        let createSvg = new Promise((resolve, reject) => {
            fabric.loadSVGFromURL('img/the-energy-to.svg', function (objects, options) {
                let energyTo = fabric.util.groupSVGElements(objects, options);
                energyTo.selectable = false;
                energyTo.evented = false;
                energyTo.top = canvas.height / 2;
                energyTo.left = canvas.width / 2;
                energyTo.originX = "center";
                energyTo.originY = "center";
                energyTo.hasControls = false;
                energyTo.hasRotatingPoint = false;
                energyTo.hasBorders = false;
                resolve(energyTo);
            });
        });
        createSvg.then((energyTo) => {
            energyTo.scaleToHeight(canvas.height);
            energyTo.scaleToWidth(canvas.width);
            textbox.scaleToHeight(canvas.height / 5);
            canvas.add(energyTo);
            canvas.add(textbox);
            canvas.centerObject(energyTo);
            canvas.centerObjectH(textbox);
            initializeTextbox(textbox);
            canvas.renderAll();
        });
        let createImage = new Promise((resolve, reject) => {
            $('#fileInput').change(function () {
                if (!this.files[0]) {
                    reject(new Error("No image selected"));
                    return;
                }
                let u = URL.createObjectURL(this.files[0]);
                let img = new Image;
                img.src = u;
                img.onload = function () {
                    let backImage = new fabric.Image(img, {
                        hasRotatingPoint: false,
                        hasControls: false,
                        hasBorders: false,
                        originX: "center",
                        originY: "center",
                        left: canvas.width / 2,
                        top: canvas.height / 2
                    });
                    let imageObj = canvas.item(0);
                    if (imageObj && imageObj.type === "image")
                        canvas.remove(imageObj);
                    canvas.add(backImage)
                        .sendToBack(backImage);
                    if (backImage.width <= backImage.height) {
                        backImage.scaleToWidth(backImage.canvas.width);
                    }
                    else if (backImage.width > backImage.height) {
                        backImage.scaleToHeight(backImage.canvas.height);
                    }
                    canvas.renderAll();
                    resolve(canvas);
                };
            });
        });
        createImage.then((canvas) => {
            return new Promise((resolve) => {
                canvas.defaultCursor = "default";
                let energyTo = canvas.item(1);
                let action = canvas.item(2);
                action.exitEditing();
                energyTo.animate("scaleX", energyTo.scaleX / 1.5, {
                    duration: 700,
                    onChange: canvas.renderAll.bind(canvas),
                    ease: "easeOutSine"
                }).animate("scaleY", energyTo.scaleY / 1.5, {
                    duration: 700,
                    onChange: canvas.renderAll.bind(canvas),
                    ease: "easeOutSine"
                });
                action.animate("scaleX", action.scaleX / 1.5, {
                    duration: 700,
                    onChange: canvas.renderAll.bind(canvas),
                    ease: "easeOutSine"
                }).animate("top", canvas.height * 2 / 2.97, {
                    duration: 700,
                    onChange: canvas.renderAll.bind(canvas),
                    ease: "easeOutSine"
                }).animate("scaleY", action.scaleY / 1.5, {
                    duration: 700,
                    onChange: canvas.renderAll.bind(canvas),
                    ease: "easeOutSine"
                });
                canvas.renderAll();
                $addPhotoOnly.hide();
                $moreOptions.show();
                resolve(canvas);
            })
        }).then((canvas) => {
            // console.log(convertCanvasToImage(canvas.getElement()).src);
        });
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
                let tlX = activeObject.aCoords.tl.x;
                let tlY = activeObject.aCoords.tl.y;
                let brX = activeObject.aCoords.br.x;
                let brY = activeObject.aCoords.br.y;
                let canvasWidth = canvas.width;
                let canvasHeight = canvas.height;
                let currentWidth = activeObject.width * activeObject.scaleX;
                let currentHeight = activeObject.height * activeObject.scaleY;
                if (tlX > 0) {
                    activeObject.setLeft(currentWidth / 2);
                }
                if (tlY > 0) {
                    activeObject.setTop(currentHeight / 2);
                }
                if (brX < canvasWidth) {
                    activeObject.setLeft(canvasWidth - (currentWidth / 2));
                }
                if (brY < canvasHeight) {
                    activeObject.setTop(canvasHeight - (currentHeight / 2));
                }
                activeObject.setCoords();
            } else {
                for (let i = 0; i < canvas.size(); i++) {
                    let item = canvas.item(i);
                    if (item.type === "textbox") {
                        initializeTextbox(canvas.item(i));
                        break;
                    }
                }
            }
            canvas.renderAll();
        });
    };
    let canvas = new fabric.Canvas('image-canvas', {
        width: 846,
        height: 846
    });
    startUp(canvas);
    $saveLinkBtn.click((e) => {
        $saveLink.attr('href', convertCanvasToImage(canvas.getElement()).src);
        $saveLink.attr('download', 'image.jpg');
        $saveLink.click();
    });
    $startOver.click((e) => {
        canvas.clear();
        startUp(canvas);
        $moreOptions.hide();
    });
    $addPhoto.click((e) => {
        $('#fileInput').click();
    });
    $shareBtn.click((e) => {
        event.preventDefault();
        $('#share-modal').iziModal('open');
    });
}());
