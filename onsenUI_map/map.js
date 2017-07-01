//下記を入れたらAPIエラーが出た。
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

//OnsenUIの背景色で地図が表示されないのでJQueryで透明化する
    $(function(){
        $('.page__background').css('background-color', 'rgba(0,0,0,0)');
    });

//位置情報取得に成功した場合のコールバック
    var onSuccess = function(position){
        search(position.coords.latitude, position.coords.longitude);
    };

    //位置情報取得に失敗した場合のコールバック
    var onError = function(error){
        console.log("現在位置を取得できませんでした");
    };

    //位置情報取得時に設定するオプション
    var option = {
        timeout: 6000   //タイムアウト値(ミリ秒)
    };

    //現在地の位置情報取得
    navigator.geolocation.getCurrentPosition(onSuccess, onError, option);
    
    //引数の位置情報を元にAEDの位置データを検索する
function search(latitude, longitude) {
    console.log(latitude + " , " + longitude);
    $.ajax({url: "https://aed.azure-mobile.net/api/AEDSearch?lat=" + latitude + "&lng=" + longitude + "&r=1000",
        success: function(data) {
            console.log("success.");
            var mapOptions = {
              //中心地設定
              center: new google.maps.LatLng(latitude, longitude),
              //ズーム設定
              zoom: 15,
              //地図のタイプを指定
              mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            //idがmap_canvasのところにGoogle mapを表示
            var map = new google.maps.Map($("#map_canvas").get(0),
                mapOptions);

            for (var i = 0; i < data.length; i++){
                var point = data[i];
                console.log("LocationName:" + point["LocationName"]);

                //位置情報オブジェクトを作成            
                var myLatlng = new google.maps.LatLng(point["Latitude"], point["Longitude"]);

                //店舗名、位置情報、Google mapオブジェクトを指定してマーカー作成メソッドを呼び出し
                markToMap(point["LocationName"], myLatlng, map);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
             console.log("AED Search Error:" + textStatus);
        }    
    });
}

//マーカーの作成と表示
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