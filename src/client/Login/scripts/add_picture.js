document.getElementById('addPicture').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

document.getElementById('addPicture1').addEventListener('click', function() {
    document.getElementById('fileInput1').click();
});

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        console.log('Выбрано изображение:', file.name);
        
}});

document.getElementById('fileInput1').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        console.log('Выбрано изображение:', file.name);
}});

function getImagesPath(input, callback, base_value='assets/good_without_pic.jpg') {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            callback(e.target.result); 
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        callback(base_value);
    }
}
