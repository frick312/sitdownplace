//���L����ꂽ��API�G���[���o���B
//document.addEventListener('DOMContentLoaded', function () {
//  if (document.querySelectorAll('#map_canvas').length > 0)
//  {
//    if (document.querySelector('html').lang)
//      lang = document.querySelector('html').lang;
//    else
//      lang = 'en';
//
//    var js_file = document.createElement('script');
//    js_file.type = 'text/javascript';
//    js_file.src = 'https://maps.googleapis.com/maps/api/js?callback=initMap&signed_in=true&language=' + lang;
//    document.getElementsByTagName('head')[0].appendChild(js_file);
//  }
//});

//OnsenUI�̔w�i�F�Œn�}���\������Ȃ��̂�JQuery�œ���������
    $(function(){
        $('.page__background').css('background-color', 'rgba(0,0,0,0)');
    });

//�ʒu���擾�ɐ��������ꍇ�̃R�[���o�b�N
    var onSuccess = function(position){
        search(position.coords.latitude, position.coords.longitude);
    };

    //�ʒu���擾�Ɏ��s�����ꍇ�̃R�[���o�b�N
    var onError = function(error){
        console.log("���݈ʒu���擾�ł��܂���ł���");
    };

    //�ʒu���擾���ɐݒ肷��I�v�V����
    var option = {
        timeout: 6000   //�^�C���A�E�g�l(�~���b)
    };

    //���ݒn�̈ʒu���擾
    navigator.geolocation.getCurrentPosition(onSuccess, onError, option);
    
    //�����̈ʒu��������AED�̈ʒu�f�[�^����������
function search(latitude, longitude) {
    console.log(latitude + " , " + longitude);
    $.ajax({url: "https://aed.azure-mobile.net/api/AEDSearch?lat=" + latitude + "&lng=" + longitude + "&r=1000",
        success: function(data) {
            console.log("success.");
            var mapOptions = {
              //���S�n�ݒ�
              center: new google.maps.LatLng(latitude, longitude),
              //�Y�[���ݒ�
              zoom: 15,
              //�n�}�̃^�C�v���w��
              mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            //id��map_canvas�̂Ƃ����Google map��\��
            var map = new google.maps.Map($("#map_canvas").get(0),
                mapOptions);

            for (var i = 0; i < data.length; i++){
                var point = data[i];
                console.log("LocationName:" + point["LocationName"]);

                //�ʒu���I�u�W�F�N�g���쐬            
                var myLatlng = new google.maps.LatLng(point["Latitude"], point["Longitude"]);

                //�X�ܖ��A�ʒu���AGoogle map�I�u�W�F�N�g���w�肵�ă}�[�J�[�쐬���\�b�h���Ăяo��
                markToMap(point["LocationName"], myLatlng, map);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
             console.log("AED Search Error:" + textStatus);
        }    
    });
}

//�}�[�J�[�̍쐬�ƕ\��
function markToMap(name, position, map){
    var marker = new google.maps.Marker({
        position: position,
        title:name
    });
    marker.setMap(map);
    google.maps.event.addListener(marker, 'click', function() {
        var infowindow = new google.maps.InfoWindow({
            content:marker.title
        });
        infowindow.open(map,marker);
    });
}