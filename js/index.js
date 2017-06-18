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
    let canvas = new fabric.Canvas('image-canvas', {
        width: 846,
        height: 846
    });
    let renderClipArtAndTextbox = new Promise((resolve, reject) => {
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
        });
    });
    const startUp = (canvas) => {
        renderClipArtAndTextbox.then((clipArtObj) => {
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
                top: 735,
                left: 432,
            });
            clipArtObj.setTop(423);
            clipArtObj.setLeft(423);
            addClipArt(canvas, clipArtObj, textbox);
            initializeTextbox(textbox);
        });
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
            initializeTextbox(getObjectWithType(canvas, "textbox"));
        }
        canvas.renderAll();
    });
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
        $addPhotoOnly.hide();
        $moreOptions.show();
    };
    $("#file-input").click(function () {
        this.value = "";
    });
    $("#file-input").change(function () {
        if (!this.files[0]) {
            console.error("No image selected");
            return;
        }
        let u = URL.createObjectURL(this.files[0]);
        let img = new Image;
        img.src = u;
        img.onload = function () {
            renderImage(canvas, img);
        };
    });

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
        $('#file-input').click();
    });

    $shareBtn.click((e) => {
        event.preventDefault();
        $('#share-modal').iziModal('open');
    });

}());
