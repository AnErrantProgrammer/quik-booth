var seriously = new Seriously();
var source = seriously.source('camera');
var target = seriously.target('#c');

var chroma = seriously.effect('chroma');
var inProgress = false;
var pictures = [];
var backdropIndex = 0;
var backdrops = [];
var count = 5;
chroma.source = source;
chroma.color = [188 / 255, 187 / 255, 5 / 255, 1];
chroma.balance = 1;
chroma.clipBlack = 0.25;
target.source = chroma;
seriously.go();

$.getJSON('/backdrops').done(function(data) {
	backdropIndex = 0;
    backdrops = data;
});

keyboardJS.bind('space', function(e) {
    if (inProgress) return false;
    $("#start").fadeOut();
    $('.preview').fadeOut();
    inProgress = true;
    count = 5;
    countDown();
});

keyboardJS.bind('left', function(e) {
    backdropIndex--;
    if (backdropIndex == -1) {
        backdropIndex = backdrops.length - 1;
    }

    loadImage(backdrops[backdropIndex]);
});

keyboardJS.bind('right', function(e) {
    backdropIndex++;
    if (backdropIndex == backdrops.length) {
        backdropIndex = 0;
    }

    loadImage(backdrops[backdropIndex]);
});

function loadImage(image) {
    var canvas = document.getElementById('b');
    var context = canvas.getContext('2d');
    var imageObj = new Image();

    imageObj.onload = function() {
        context.drawImage(imageObj, 0, 0);
    };

    imageObj.src = 'images/' + image;
}


$('.preview_image').click(function() {
    if ($(this).hasClass('selected')) {
        $(this).removeClass("selected");
    } else {
        $(this).addClass("selected");

    }
});

$('#cancel').click(function() {
    inProgress = false;
    $("#start").fadeIn();
    $('.preview').fadeOut();
})

$('#send').click(function() {
    var selected = [];

    $('.selected').each(function() {
        selected.push($(this).attr('src').split('/')[2]);
    });

    var number = $("#number").val();
    selected = JSON.stringify(selected);
    if (number.length != 10) return false;
    if (selected.length == 0) return false;

    $.ajax({
        method: "POST",
        url: "/sendImage",
        data: {
            number: number,
            selected: selected
        }
    });

    inProgress = false;
    $("#start").fadeIn();
    $('.preview').fadeOut();

})

function countDown() {
    if (count > 0) {
        $('#countdown').fadeIn().text(count);
        count--;
        setTimeout(countDown, 1000);

    } else {
        $('#countdown').fadeOut(100);
        count = 4;
        takePictures();
    }

}

function takePictures() {
    pictures = [];
    if (count > 0) {
        takePicture();
        count--;
        setTimeout(takePictures, 1500);
    } else {

        $('.preview').fadeIn();
    }
}

function takePicture() {
    $('#flash').fadeIn(50).fadeOut(200);
    var mainCanvas = document.getElementById('c');
    var backgroundCanvas = document.getElementById('b');
    var mergeCanvas = document.getElementById('m');

    var mainContext = mainCanvas.getContext('2d');
    var backgroundContext = backgroundCanvas.getContext('2d');
    var mergeContext = mergeCanvas.getContext('2d');

    mergeContext.drawImage(backgroundCanvas, 0, 0);
    mergeContext.drawImage(mainCanvas, 0, 0);


    var canvasData = mergeCanvas.toDataURL("image/png");
    var blobBin = atob(canvasData.split(',')[1]);
    var array = [];
    
    for (var i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
    }

    var file = new Blob([new Uint8Array(array)], {
        type: 'image/png'
    });

    var formdata = new FormData();
    formdata.append("test.png", file);
    $.ajax({
        url: '/saveImage',
        type: 'POST',
        data: formdata,
        processData: false,
        contentType: false
    }).done(function(data) {
        $('#preview_' + count.toString()).attr('src', '/photos/' + data);
    });
}