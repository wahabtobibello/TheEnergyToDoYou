/**
 * Created by BelloPC on 17/05/2017.
 */
'use strict';

// class Imager {
//     changeImage({src, width, height}) {
//         this.$image.find('.background img').attr('src', src);
//         this.$image.css('width', width);
//         this.$image.css('height', height);
//         this.$image.children('.print').css('width', 0.6 * Math.min(width,height));
//         this.$image.children('.print').css('margin-top', -1 * 0.6 / 2 * Math.min(width,height));
//         this.$image.children('.print').css('margin-left', -1 * 0.6 / 2 * Math.min(width,height));
//     }
//     changeAction($newAction) {
//         this.$image.find('div#action').text($newAction);
//     }
//     constructor(action, $backgroundImage) {
//         this.action = action || "";
//         this.$backgroundImage = $backgroundImage;
//         const printScale = 0.6;
//         const createImageDiv = (width, height) => {
//             let $image = $('<div></div>');
//             $image.addClass('image');
//             $image.css('width', width);
//             $image.css('height', height);
//             $image.css('position', 'relative');
//             return $image;
//         }
//         const createBackgroundDiv = ($backgroundImage) => {
//             let $background = $('<div></div>');
//             $background.addClass('background');
//             $background.css('width', '100%');
//             $background.css('height', '100%');
//             $background.append($backgroundImage);
//             return $background;
//         }
//         const createPrintDiv = (action, minSideSize) => {
//             let $print = $('<div></div>');
//             $print.addClass('print');
//             $print.css('position', 'absolute');
//             $print.css('top', '50%');
//             $print.css('left', '50%');
//             $print.css('width', printScale * minSideSize);
//             $print.css('margin-top', -1 * printScale / 2 * minSideSize);
//             $print.css('margin-left', -1 * printScale / 2 * minSideSize);
//             let $svg = $(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="639 114 199 196">
//                 <defs>
//                     <style>
//                         @font-face {
//                             font-family: AvenyT-Black;
//                             src: url("fonts/Aveny-T_Black.otf") format("opentype");
//                         }
//                         @font-face {
//                             font-family: Aveny T;
//                             src: url("fonts/Aveny-T_Regular.otf") format("opentype");
//                         }
//                         .cls-1 {
//                             fill: #f8d60c;
//                             stroke: #f8d60c;
//                         }
//
//                         .cls-2, .cls-4 {
//                             fill: rgba(216,11,44,0);
//                             stroke-width: 5px;
//                         }
//
//                         .cls-2 {
//                             stroke: #f8d60c;
//                         }
//
//                         .cls-3 {
//                             fill: #f8d60c;
//                             font-size: 56px;
//                             font-family: AvenyT-Black, Aveny T, sans-serif;
//                             font-weight: 800;
//                             letter-spacing: 0.06em;
//                         }
//
//                         .cls-4 {
//                             stroke: #f8d60c;
//                         }
//
//                         .cls-5 {
//                             stroke: none;
//                         }
//
//                         .cls-6 {
//                             fill: none;
//                         }
//                         .cls-7{
//                             display: block;
//                             text-align: center;
//                             text-transform: uppercase;
//                             color: #f8d60c;
//                             line-height: 1.3;
//                         }
//                     </style>
//                 </defs>
//                 <g id="Group_2" data-name="Group 2" transform="translate(186 -14)">
//                     <path id="Subtraction_1" data-name="Subtraction 1" class="cls-1" d="M12.5,79.5h-198v-65h198ZM-27.016,26.8a.979.979,0,0,0-1.064.952,7.716,7.716,0,0,0,.392,2.072l7.168,24.752V64.712A1.305,1.305,0,0,0-19.232,66h7.112a1.305,1.305,0,0,0,1.288-1.288V54.52l6.944-24.7a8.665,8.665,0,0,0,.448-2.072A.929.929,0,0,0-4.448,26.8H-11.56A1.242,1.242,0,0,0-12.9,27.92l-2.072,9.8a.424.424,0,0,1-.448.336.425.425,0,0,1-.448-.336l-2.352-9.8a1.263,1.263,0,0,0-1.288-1.12Zm-15.96,36.736v1.175A1.274,1.274,0,0,0-41.688,66h8.176a1.306,1.306,0,0,0,1.289-1.288V48.976a1.275,1.275,0,0,0-1.289-1.288h-7.112a1.305,1.305,0,0,0-1.288,1.288v5.88c0,1.335-.653,1.9-2.184,1.9s-2.183-.57-2.183-1.9V37.944c0-1.335.653-1.9,2.183-1.9s2.184.57,2.184,1.9v3.7a1.305,1.305,0,0,0,1.288,1.288h7.112a1.275,1.275,0,0,0,1.289-1.288V34.248A7.456,7.456,0,0,0-39.672,26.8H-48.52a7.456,7.456,0,0,0-7.448,7.447v24.3A7.2,7.2,0,0,0-48.52,66h.28a6.409,6.409,0,0,0,5.262-2.461ZM-75.679,52.5h1.9a2.243,2.243,0,0,1,2.463,2.464v7.783c0,2.186.788,3.248,2.408,3.248h6.384c.715,0,1.176-.373,1.176-.951a6.094,6.094,0,0,0-.1-.8,10.654,10.654,0,0,1-.179-1.66V53.568a6.236,6.236,0,0,0-4.424-6.216,5.962,5.962,0,0,0,4.424-6.215V34.248A7.456,7.456,0,0,0-69.072,26.8H-84.08a1.25,1.25,0,0,0-1.288,1.232V64.712A1.305,1.305,0,0,0-84.08,66h7.112a1.274,1.274,0,0,0,1.288-1.288V52.505Zm-36.065-25.7a1.294,1.294,0,0,0-1.288,1.232V64.712A1.305,1.305,0,0,0-111.744,66h19.432a1.274,1.274,0,0,0,1.288-1.288V57.992a1.262,1.262,0,0,0-1.288-1.232h-11.032V50.992h7.673a1.262,1.262,0,0,0,1.288-1.232V43.04a1.274,1.274,0,0,0-1.288-1.288h-7.673V36.04h11.032a1.274,1.274,0,0,0,1.288-1.288V28.032A1.262,1.262,0,0,0-92.312,26.8ZM-133.47,47.639l4.534,17.017A1.562,1.562,0,0,0-127.2,66h6.719a1.274,1.274,0,0,0,1.288-1.288V28.088A1.305,1.305,0,0,0-120.48,26.8h-6.888a1.305,1.305,0,0,0-1.288,1.288V44.832l-4.032-16.744a1.645,1.645,0,0,0-1.68-1.288h-7.28a1.339,1.339,0,0,0-1.288,1.288V64.712A1.274,1.274,0,0,0-141.648,66h6.889a1.274,1.274,0,0,0,1.288-1.288V47.639ZM-169.312,26.8a1.294,1.294,0,0,0-1.289,1.232V64.712A1.306,1.306,0,0,0-169.312,66h19.432a1.274,1.274,0,0,0,1.288-1.288V57.992a1.262,1.262,0,0,0-1.288-1.232h-11.032V50.992h7.672a1.262,1.262,0,0,0,1.288-1.232V43.04a1.274,1.274,0,0,0-1.288-1.288h-7.672V36.04h11.032a1.274,1.274,0,0,0,1.288-1.288V28.032A1.262,1.262,0,0,0-149.88,26.8ZM-73.5,43.264H-75.68V36.04H-73.5c1.49,0,2.183.783,2.183,2.464v2.3C-71.312,42.481-72.006,43.264-73.5,43.264Z" transform="translate(639 114)"/>
//                     <g id="Rectangle_9" data-name="Rectangle 9" class="cls-2" transform="translate(453 193)">
//                         <rect class="cls-5" width="199" height="68"/>
//                         <rect class="cls-6" x="2.5" y="2.5" width="194" height="63"/>
//                     </g>
//                     <text id="TO" class="cls-3" transform="translate(525 247)"><tspan x="0" y="0">TO</tspan></text>
//                     <g id="Rectangle_10" data-name="Rectangle 10" class="cls-4" transform="translate(453 256.015)">
//                         <rect class="cls-5" width="199" height="66.985"/>
//                         <rect class="cls-6" x="2.5" y="2.5" width="194" height="61.985"/>
//                         <foreignObject class="cls-3 cls-7"  width="199" height="66.985">
//                             <div xmlns="http://www.w3.org/1999/xhtml" id="action" style="border: 0;outline: 0;" contenteditable="true"></div>
//                         </foreignObject>
//                     </g>
//                 </g>
//             </svg>`);
//             $svg.find('div#action').text(action);
//             $print.append($svg);
//             return $print;
//         }
//         this.$image = createImageDiv(this.$backgroundImage[0].width, this.$backgroundImage[0].height);
//         const $print = createPrintDiv(this.action, Math.min(this.$backgroundImage[0].width, this.$backgroundImage[0].height));
//         const $background = createBackgroundDiv(this.$backgroundImage);
//         this.$image.append($background, $print);
//     }
// }

(function () {
    const maxchars = 10;
    const $addPhotoOnly = $('#addPhotoOnly');
    const $moreOptions = $('#moreOptions');
    const $saveLink = $('#saveLink');
    const $saveLinkBtn = $('#saveLinkBtn');
    const convertCanvasToImage = canvas => {
        let image = new Image();
        image.src = canvas.toDataURL("image/png");
        return image;
    };
    let canvas = new fabric.Canvas('image-canvas', {
        width: 846,
        height: 846
    });
    canvas.renderAll();
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
        let action = new fabric.Textbox("", {
            fontFamily: "AvenyT-Black",
            textAlign: "center",
            top: canvas.height * 2 / 2.95,
            left: canvas.width / 1.85,
            fill: "#d80b2c",
            originX: "center",
            originY: "center",
            cursorColor: "#d80b2c",
            cursorWidth: 5,
            evented: false,
            hasControls: false,
            skewY: -10
        });
        energyTo.scaleToHeight(canvas.height);
        energyTo.scaleToWidth(canvas.width);
        action.scaleToHeight(canvas.height / 6);
        canvas.add(energyTo);
        canvas.add(action);
        action.enterEditing();
        action.hasBorders = false;
        action.hasControls = false;
        action.hasRotatingPoint = false;
        canvas.setActiveObject(action);
        action.hiddenTextarea.maxLength = maxchars;
        action.hiddenTextarea.focus();
        action.hiddenTextarea.cols = 1;
        action.hiddenTextarea.onkeyup = (e) => {
            if ($moreOptions.css('display') === "none") {
                $addPhotoOnly.show();
                if (e.target.value === "")
                    $addPhotoOnly.find('button').attr('disabled', 'true');
                else
                    $addPhotoOnly.find('button').removeAttr('disabled');
            } else {
                if (e.target.value === "")
                    $moreOptions.find('button').attr('disabled', 'true');
                else
                    $moreOptions.find('button').removeAttr('disabled');
            }
        };
        canvas.renderAll();
    });
    canvas.on('mouse:down', (e) => {
        let image = canvas.item(0);
        let notImage = canvas.item(1);
        canvas.setActiveObject(notImage);
        canvas.renderAll();
    });
    canvas.on('mouse:up', (e) => {
        var activeObject = e.target;
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
        if(tlY > 0){
            activeObject.setTop(currentHeight / 2);
        }
        if (brX < canvasWidth) {
            activeObject.setLeft(canvasWidth - (currentWidth / 2));
        }
        if(brY < canvasHeight){
            activeObject.setTop(canvasHeight - (currentHeight / 2));
        }
        let notImage = canvas.item(1);
        canvas.setActiveObject(notImage);
        canvas.renderAll();
    });
    let createImage = new Promise((resolve, reject) => {
        $('#fileInput').change(function () {
            if (!URL.createObjectURL) {
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
                if (backImage.width < backImage.height) {
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
        canvas.defaultCursor = "default";
        let energyTo = canvas.item(1);
        let action = canvas.item(2);
        action.exitEditing();
        energyTo.animate("scaleX", energyTo.scaleX / 1.5, {
            duration: 700,
            onChange: canvas.renderAll.bind(canvas),
            ease: "easeOutSine"
        });
        energyTo.animate("scaleY", energyTo.scaleY / 1.5, {
            duration: 700,
            onChange: canvas.renderAll.bind(canvas),
            ease: "easeOutSine"
        });
        action.animate("scaleX", action.scaleX / 1.2, {
            duration: 700,
            onChange: canvas.renderAll.bind(canvas),
            ease: "easeOutSine"
        }).animate("top", canvas.height * 2 / 3.2, {
            duration: 700,
            onChange: canvas.renderAll.bind(canvas),
            ease: "easeOutSine"
        }).animate("left", canvas.width / 1.9, {
            duration: 700,
            onChange: canvas.renderAll.bind(canvas),
            ease: "easeOutSine"
        }).animate("scaleY", action.scaleY / 1.2, {
            duration: 700,
            onChange: canvas.renderAll.bind(canvas),
            ease: "easeOutSine"
        });
        canvas.renderAll();
        $addPhotoOnly.hide();
        $moreOptions.show();
    });
    $saveLinkBtn.click((e) => {
        $saveLink.attr('href', convertCanvasToImage(canvas.getElement()).src);
        $saveLink.attr('download', 'image.jpeg');
        $saveLink.click();
    });
}());
