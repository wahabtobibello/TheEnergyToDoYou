/**
 * Created by BelloPC on 17/05/2017.
 */
const image = document.querySelector('.header');
const btnSave = document.querySelector('#save');

$('.header form').submit(e => {
    console.log('ygygg');
    domtoimage.toJpeg(image, {quality: 0.95})
        .then((dataUrl) => {
            btnSave.download = 'my-image-name.jpeg';
            btnSave.href = dataUrl;
            btnSave.href = "l";
        });
});