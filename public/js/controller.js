'use strict';









app.controller('home',function($scope,$resource,$window){
    var actionsTodo = $resource('/getActions/');
    var actions = actionsTodo.query(function(){
        $scope.actions = actions;

        $scope.myInterval = 5000;
        var slides = $scope.slides = $scope.actions[0].pictures;
    });




    var todo = $resource('/getEquipmentsTotal');
    var equipments = todo.query(function(){
        var equipmentArrFirst = [];
        var equipmentArrSecond = [];
        for(var i=0; i<equipments.length; i++){
            if(equipments[i].equipment_popular=='true'){
                if(equipmentArrFirst.length<4){
                    var equipmentObj = {};
                    equipmentObj.title = equipments[i].equipment_title;
                    equipmentObj.about = equipments[i].equipment_about;
                    equipmentObj.photo = equipments[i].equipment_photo[0];
                    equipmentArrFirst.push(equipmentObj);
                }
            }else if(equipmentArrFirst.length>3 && equipmentArrFirst.length<7){
                var equipmentObj = {};
                equipmentObj.title = equipments[i].equipment_title;
                equipmentObj.about = equipments[i].equipment_about;
                equipmentObj.photo = equipments[i].equipment_photo[0];
                equipmentArrSecond.push(equipmentObj);
            }
        }
        $scope.equipmentsFirst = equipmentArrFirst;
        $scope.equipmentsSecond = equipmentArrSecond;
    });
});
app.controller('total',function($scope,$resource,$location){

    $scope.refer = function(area){
        $location.url('/itemArea'+area);
        $('.menu-item').removeClass('open');
    }

    var todo_1 = $resource('/getCategoriesTotal');
    var cats = todo_1.query(function(){
        $scope.cats = cats;
    });

    var areasTodo = $resource('/getAreasTotal');
    var areas = areasTodo.query(function(){
        $scope.areas = areas;
    });

    $scope.collectData = function(cat){
     var todo_2 = $resource('/getEquipmentsTotal/'+cat);
     var equipments = todo_2.query(function(){

     $scope.equipmentsInCat = equipments;
     });
     };

    $scope.searchFor = function(item){
        //$scope.test = 'check';
        var todo7 = $resource('/searchFor/'+item);
        var searchs = todo7.get(function(){
            $scope.searchRes = searchs;
            $('#myMenuModal').modal('show');
        });
    };

    $scope.$on('$routeChangeStart', function(next, current) {
        $('#myMenuModal').modal('hide');
    });



   /* $('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
        // Avoid following the href location when clicking
        event.preventDefault();
        // Avoid having the menu to close when clicking
        event.stopPropagation();
        // If a menu is already open we close it
        //$('ul.dropdown-menu [data-toggle=dropdown]').parent().removeClass('open');
        // opening the one you clicked on
       $('ul.dropdown-menu [data-toggle=dropdown]').parent().removeClass('open');
       $(this).parent().toggleClass('open');

        var menu = $(this).parent().find("ul");
        var menupos = menu.offset();

        if ((menupos.left + menu.width()) + 30 > $(window).width()) {
            var newpos = - menu.width();
        } else {
            var newpos = $(this).parent().width();
        }
        menu.css({ left:newpos });

    });*/
    $('.dropdown').on('show.bs.dropdown', function () {
        $('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
            // Avoid following the href location when clicking
            event.preventDefault();
            // Avoid having the menu to close when clicking
            event.stopPropagation();
            // If a menu is already open we close it
            //$('ul.dropdown-menu [data-toggle=dropdown]').parent().removeClass('open');
            // opening the one you clicked on
            $('ul.dropdown-menu [data-toggle=dropdown]').parent().removeClass('open');
            $(this).parent().toggleClass('open');

            var menu = $(this).parent().find("ul");
            var menupos = menu.offset();

            if ((menupos.left + menu.width()) + 30 > $(window).width()) {
                var newpos = - menu.width();
            } else {
                var newpos = $(this).parent().width();
            }
            menu.css({ left:newpos });

        });
    })
});

//INs
app.controller('contacts',function($scope,$resource){
    $scope.submitIt = function(){
        var name = $scope.name;
        var email = $scope.emailFrom;
        var theme = $scope.theme;
        var body = $scope.body;
        var emailAdd = $resource('/sendEmail');

        var emailNew = new emailAdd();
        emailNew.name = name;
        emailNew.emailFrom = email;
        emailNew.theme = theme;
        emailNew.body = body;

        emailNew.$save();
        $scope.result = 'Ваше письмо успешно отправленно!';
    };
    $scope.map = {
        center: {
            latitude: 43.249761,
            longitude: 76.851154
        },
        zoom: 15
    };
});
app.controller('assist',function($scope){
    var info = [];
    if(!sessionStorage.person){
        var person = prompt("Введите ваше имя", "");
        sessionStorage.person = person;
    }else{

    }



    if(sessionStorage.person=='' || sessionStorage.person=='undefined' || sessionStorage.person == 'null' || sessionStorage.person == 'UncoTech'){
        window.location.href = '/';
    }else{
        var socket = io();
        socket.on('connect', function () {
            socket.emit('chat message', sessionStorage.person+' : онлайн!!!');
        });
        window.onbeforeunload = function (event) {
            socket.emit('chat message', sessionStorage.person+' : offline!!!');
        };
        /*$scope.$on('$routeChangeStart', function(next, current) {
            socket.emit('chat message', sessionStorage.person+' : offline!!!');
        });*/

        $scope.submitMsg = function(){
            socket.emit('chat message', sessionStorage.person +' : '+ $scope.msg);
            return false;
        }


        socket.on('chat message', function(msg){
            if(msg=='Make_beep'){
            }else{
            var endMsg = msg.split(":");
            if(endMsg.length==3){
                var msgUser = endMsg[0];
                var toUser = endMsg[1];
                if(toUser==' undefined '){
                    toUser = 'Всем';
                }
                var msgBody = endMsg.pop();
                var data = {};
                data.user = msgUser;
                data.toUser = toUser;
                data.msg = msgBody;
                info.push(data);
                $scope.$apply(function () {
                    $scope.info = info;
                });
            }else{
                var msgUser = endMsg[0];
                var msgBody = endMsg.pop();
                var data = {};
                data.user = msgUser;
                data.msg = msgBody;
                info.push(data);
                $scope.$apply(function () {
                    $scope.info = info;
                });
            }
        }
        });







        var pageHeight = window.innerHeight;
        var approxHeight = pageHeight - 280;
        $('.assist_msg').height(approxHeight);
    }
});




app.controller('assistTech',function($scope){

    var users = [];
    var info = [];

    function PlaySound(soundObj) {
        var sound = document.getElementById(soundObj);
        sound.play();
    }

    var pass = prompt("Введите пароль", "");
    sessionStorage.pass = pass;
    if(sessionStorage.pass!='TechSupport'){
        window.location.href = '/';
    }else{
        var socket = io();

        $scope.submitMsg = function(){
            socket.emit('chat message', 'UncoTech' +' : '+$scope.result+' : '+ $scope.msg);
            $scope.result = 'Всем!';
            return false;
        }
        socket.on('chat message', function(msg){
            var endMsg = msg.split(":");
            if(endMsg[1]==' онлайн!!!'){
                PlaySound("audiotag1");
            }

                if(endMsg.length==3){
                    var msgUser = endMsg[0];
                    var toUser = endMsg[1];
                    if(toUser==' undefined '){
                        toUser = 'Всем';
                    }
                    var msgBody = endMsg.pop();
                    var data = {};
                    data.user = msgUser;
                    data.toUser = toUser;
                    data.msg = msgBody;
                    info.push(data);
                    $scope.$apply(function () {
                        $scope.info = info;
                    });
                }else{
                    var msgUser = endMsg[0];
                    var msgBody = endMsg.pop();
                    var data = {};
                    data.user = msgUser;
                    data.msg = msgBody;
                    info.push(data);
                    $scope.$apply(function () {
                        $scope.info = info;
                    });
                }








                $scope.reactClick = function(user){
                        $scope.result = user;
                };



        });

        var pageHeight = window.innerHeight;
        var approxHeight = pageHeight - 280;
        $('.assist_msg').height(approxHeight);
    }
});



app.controller('addEquipment', function ($scope,$resource,$route,$upload,$location,$window) {
    var files=[];

    $scope.session = JSON.parse($window.localStorage.getItem('session'));
    $scope.popular = 'false';
    if($scope.session){
        if($scope.session.pwd=='dushes05'){
            $scope.specs = [];
            $scope.addSpec = function(){
                $scope.specs.push({title:'',value:''});
            }

            var getAllAreas = $resource("/getAreasTotal");
            var allAreas = getAllAreas.query(
                function(){
                    $scope.allAreas = allAreas;
                }
            );


            $scope.areas = [];
            $scope.addArea = function(){
                $scope.areas.push({title:''});
            }

            $scope.filesInput = [];
            $scope.addingFiles = false;
            $scope.newInput = function(){
                $scope.addingFiles = true;
            }



            $scope.videoLinks = [];
            $scope.addVideoLink = function(){
                $scope.videoLinks.push({videoLink:''});
            }




            //$scope.path = 'http://104.131.239.73/equipmentAdmin';// Путь который контролит данный обработчик--------------------------------------


            $scope.deleteTotalEquipment = function(equipment){
                var Todo = $resource('/deleteEquipmentTotal/'+equipment);
                var info = Todo.query();
                $window.location.reload();
            }



            $scope.cats = [];
            var Todo2 = $resource('getCategoriesTotal');
            var info2 = Todo2.query(function(){
                info2.forEach(function(cat){
                    $scope.cats.push(cat.cat_title);
                });
            });
            $scope.incomings = [];
            var getEquipments = $resource('getEquipmentsTotal');
            var infoEquipments = getEquipments.query(function(){
                infoEquipments.forEach(function(data){

                    var incomeInfo = {};
                    incomeInfo.title = data.equipment_title;
                    incomeInfo.photo = data.equipment_photo;
                    incomeInfo.about = data.equipment_about;
                    incomeInfo.some = data.equipment_some;
                    incomeInfo.price = data.equipment_price;
                    incomeInfo.benefit = data.equipment_benefits;

                    incomeInfo.specs = data.equipment_spec;
                    incomeInfo.areas = data.equipment_areas;
                    incomeInfo.videoLinks = data.equipment_videos;
                    incomeInfo.order = data.equipment_order;
                    $scope.incomings.push(incomeInfo);
                });
            });





            $scope.sendData = function() {


                var title = $scope.title;
                var about = $scope.about;
                var some = $scope.some;
                var price = $scope.price;
                var benefit = $scope.benefit;
                var category = $scope.category;
                var specs = $scope.specs;
                var areas = $scope.areas;
                var videoLinks = $scope.videoLinks;
                var order = $scope.order;
                var popular = $scope.popular;
                if(title && title!='Данное поле является обязательным!!!'){
                    var inputTo = $resource('/postEquipmentOutOfFile');

                    var input = new inputTo();
                    input.title = title;
                    input.about = about;
                    input.some = some;
                    input.price = price;
                    input.benefit = benefit;
                    input.category = category;
                    input.specs = specs;
                    //input.specs = JSON.stringify(input.specs);
                    input.areas = areas;
                    //input.areas = JSON.stringify(input.areas);
                    input.videoLinks = videoLinks;
                    //input.videoLinks = JSON.stringify(input.videoLinks);
                    input.order = order;
                    input.popular = popular;

                    input.$save();

                    $window.location.reload();
                }else{
                    $scope.title = 'Данное поле является обязательным!!!';
                }
            }


        }else{
            $window.location.href='/admin';
        }
    }else{
        $window.location.href='/admin';
    }
});

app.controller('addAction',function($scope,$routeParams,$resource,$route,$window){
    $scope.session = JSON.parse($window.localStorage.getItem('session'));
    $scope.progress = {value:0};
    if($scope.session){
        if($scope.session.pwd=='dushes05'){

            var Todo = $resource('/getActions/');
            var info = Todo.query(function(){
                $scope.actions = info;
            });


            $scope.deleteAction = function(title){
                var Todo = $resource('/deleteAction/'+title);
                var info = Todo.query();
                $window.location.reload();
            }


            $scope.startingDate = 'Введите данные в формате: 00/00/0000 (день/месяц/год)';
            $scope.endingDate = 'Введите данные в формате: 00/00/0000 (день/месяц/год)';
            $scope.filesInput = [];

            $scope.newInput = function(){
                $scope.filesInput = [''];
            }

            $scope.submit = function(){
                var inputTo = $resource('/postActionData');
                var input = new inputTo();
                input.title = $scope.title;
                input.about = $scope.about;
                input.startDate = $scope.startingDate;
                input.endDate = $scope.endingDate;
                input.$save(function(){
                    $window.location.reload();
                });
            }

            $scope.dateOptions = {
                changeYear: true,
                changeMonth: true,
                minDate: 0,
                maxDate: "+1Y"
            };
        }else{
            $window.location.href='/admin';
        }
    }else{
        $window.location.href='/admin';
    }
})

app.controller('addArea',function($scope,$routeParams,$resource,$route,$window){
    var files=[];
    $scope.session = JSON.parse($window.localStorage.getItem('session'));
    if($scope.session){
        if($scope.session.pwd=='dushes05'){
            $scope.equipments = [];
            $scope.addEquipment = function(){
                $scope.equipments.push({title:''});
            }
            $scope.addingFiles = false;
            $scope.filesInput = [];
            $scope.newInput = function(){
                $scope.addingFiles = true;
            }

            $scope.videoLinks = [];
            $scope.addVideoLink = function(){
                $scope.videoLinks.push({videoLink:''});
            }




            $scope.path = 'http://104.131.239.73/areaAdmin';// Путь который контролит данный обработчик--------------------------------------


            $scope.deleteTotalArea = function(area){
                var Todo = $resource('/deleteAreaTotal/'+area);
                var info = Todo.query();
                $window.location.reload();
            }


            var Todo = $resource('getAreasTotal');
            $scope.incomings = [];
            var info = Todo.query(function(){
                info.forEach(function(data){
                    var incomeInfo = {};
                    incomeInfo.title = data.area_title;
                    incomeInfo.photo = data.area_photos;
                    incomeInfo.about = data.area_about;
                    if(data.area_equipment && data.area_equipment!=null && data.area_equipment.length!=0){
                        incomeInfo.equipments = data.area_equipment;
                        // incomeInfo.equipments = JSON.parse(incomeInfo.equipments);
                    }
                    $scope.incomings.push(incomeInfo);
                });
            });





            $scope.sendData = function() {


                var title = $scope.title;
                var about = $scope.about;
                var equipments = $scope.equipments;
                var videoLinks = $scope.videoLinks;
                if(title && title!='Данное поле является обязательным!!!'){
                    var inputTo = $resource('/postAreaOutOfFile');

                    var input = new inputTo();
                    input.title = title;
                    input.about = about;
                    input.equipments = equipments;
                    //input.equipments = JSON.stringify(input.equipments);
                    input.videoLinks = videoLinks;
                    //input.videoLinks = JSON.stringify(input.videoLinks);
                    input.$save();

                    $window.location.reload();
                }else{
                    $scope.title = 'Данное поле является обязательным!!!';
                }
            }


        }else{
            $window.location.href='/admin';
        }
    }else{
        $window.location.href='/admin';
    }

});


app.controller('itemEquipment',function($scope,$routeParams,$resource){
    var equipment = $routeParams.equipment_name;
    $scope.width = window.innerWidth;
    var todo = $resource('/getEquipmentTotal/'+equipment);
    var equipments = todo.query(function(){
        $scope.result = equipments;
        $scope.singlePhoto = [];
        for(var i=1; i<$scope.result[0].equipment_photo.length; i++){
            $scope.singlePhoto.push(equipments[0].equipment_photo[i]);
        }
    });
    var todo2 = $resource('/getAreasTotalByEquipment/'+equipment);
    var areas = todo2.query(function(){
        $scope.areas = areas;

        $scope.$watch('width', function(newValue, oldValue) {
            if(newValue < 992){
                var areasData = [];
                /*var todo2 = $resource('/getAreasTotalByEquipment/'+equipment);
                 var areas = todo2.query(function(){*/
                if($scope.areas!='no result'){
                    $scope.areas.forEach(function(area){
                        if($scope.areas.indexOf(area)==$scope.areas.length-1){
                            var areaObj = {};
                            areaObj.title = area.title;
                            areaObj.photo = area.photos[0];
                            areasData.push(areaObj);
                            $scope.areasData = areasData;
                            //Check window size
                            $scope.activePhotoAreas = $scope.areasData.splice(0,2);
                            $scope.singlePhotoAreas = $scope.areasData;
                        }else{
                            var areaObj = {};
                            areaObj.title = area.title;
                            areaObj.photo = area.photos[0];
                            areasData.push(areaObj);
                        }
                    });
                }
                // });
            }else if(newValue > 992){
                var areasData = [];
                /*var todo2 = $resource('/getAreasTotalByEquipment/'+equipment);
                 var areas = todo2.query(function(){*/
                if($scope.areas!='no result'){
                    $scope.areas.forEach(function(area){
                        if($scope.areas.indexOf(area)==$scope.areas.length-1){
                            var areaObj = {};
                            areaObj.title = area.title;
                            areaObj.photo = area.photos[0];
                            areasData.push(areaObj);
                            $scope.areasData = areasData;
                            //Check window size
                            $scope.activePhotoAreas = $scope.areasData.splice(0,4);
                            $scope.singlePhotoAreas = $scope.areasData;
                        }else{
                            var areaObj = {};
                            areaObj.title = area.title;
                            areaObj.photo = area.photos[0];
                            areasData.push(areaObj);
                        }
                    });
                }

                // });
            };
        });
    });







    function tellAngular() {
        $scope.$apply(function() {
            $scope.width = window.innerWidth;
            //location.reload();
        });
    }



    //calling tellAngular on resize event
    $(window).resize(tellAngular);
});

app.controller('itemArea',function($scope,$routeParams,$resource){
    var area = $routeParams.area_title;
    $scope.area = area;
    $scope.width = window.innerWidth;

    var todo = $resource('/getEquipmentsTotalByArea/'+area);
    var equipments = todo.query(function(){
        $scope.$watch('width', function(newValue, oldValue) {
            if(newValue < 992){
                var equipmentsData = [];
                /*var todo = $resource('/getEquipmentsTotalByArea/'+area);
                 var equipments = todo.query(function(){*/

                if(equipments!='no result'){
                    equipments.forEach(function(equipment){
                        if(equipments.indexOf(equipment)==equipments.length-1){
                            var equipmentObj = {};
                            equipmentObj.title = equipment.title;
                            equipmentObj.photo = equipment.photo;
                            equipmentsData.push(equipmentObj);
                            $scope.equipments = equipmentsData;
                            //Check window size
                            $scope.activePhotoEquipments = $scope.equipments.splice(0,2);
                            $scope.singlePhotoEquipments = $scope.equipments;
                        }else{
                            var equipmentObj = {};
                            equipmentObj.title = equipment.title;
                            equipmentObj.photo = equipment.photo;
                            equipmentsData.push(equipmentObj);
                        }
                    });
                }
                // });
            }else if(newValue > 992){
                var equipmentsData = [];
                /*var todo = $resource('/getEquipmentsTotalByArea/'+area);
                 var equipments = todo.query(function(){*/

                if(equipments!='no result'){
                    equipments.forEach(function(equipment){
                        if(equipments.indexOf(equipment)==equipments.length-1){
                            var equipmentObj = {};
                            equipmentObj.title = equipment.title;
                            equipmentObj.photo = equipment.photo;
                            equipmentsData.push(equipmentObj);
                            $scope.equipments = equipmentsData;
                            //Check window size
                            $scope.activePhotoEquipments = $scope.equipments.splice(0,4);
                            $scope.singlePhotoEquipments = $scope.equipments;
                        }else{
                            var equipmentObj = {};
                            equipmentObj.title = equipment.title;
                            equipmentObj.photo = equipment.photo;
                            equipmentsData.push(equipmentObj);
                        }
                    });
                }
                //});
            };
        });
    });













    var todo2 = $resource('/getAreaTotal/'+area);
    var areaInfo = todo2.query(function(){
        $scope.areaInfo = areaInfo[0];
        $scope.activeAreaPhoto = areaInfo[0].area_photos[0];
        $scope.singleAreaPhotos = [];
        for(var i=1; i<areaInfo[0].area_photos.length; i++){
            $scope.singleAreaPhotos.push(areaInfo[0].area_photos[i]);
        }
        var videos = areaInfo[0].area_videos;
        $scope.videos = videos;
       // $scope.singleAreaPhotos = areaInfo[0].area_photos;





    });


    function tellAngular() {
        $scope.$apply(function() {
            $scope.width = window.innerWidth;
            //location.reload();
        });
    }



    //calling tellAngular on resize event
    $(window).resize(tellAngular);
});


app.controller('addCategory', function ($scope,$resource,$route,$upload,$location,$window) {
    var files=[];
    $scope.session = JSON.parse($window.localStorage.getItem('session'));
    if($scope.session){
        if($scope.session.pwd=='dushes05'){
            $scope.areas = [];
            $scope.addArea = function(){
                $scope.areas.push({title:''});
            }

            $scope.addingFiles = false;
            $scope.filesInput = [];
            $scope.newInput = function(){
                $scope.addingFiles = true;
            }



            $scope.videoLinks = [];
            $scope.addVideoLink = function(){
                $scope.videoLinks.push({videoLink:''});
            }


            //  $scope.path = 'http://localhost/categoryAdmin';// Путь который контролит данный обработчик--------------------------------------


            $scope.deleteTotalCategory = function(category){
                var Todo = $resource('/deleteCategoryTotal/'+category);
                var info = Todo.query();
                $window.location.reload();
            }


            var Todo = $resource('getCategoriesTotal');
            $scope.incomings = [];
            var info = Todo.query(function(){
                info.forEach(function(data){
                    var incomeInfo = {};
                    incomeInfo.title = data.cat_title;
                    incomeInfo.photo = data.cat_photos;
                    $scope.incomings.push(incomeInfo);
                });
            });





            $scope.sendData = function() {


                var title = $scope.title;
                var about = $scope.about;
                var areas = $scope.areas;
                var videoLinks = $scope.videoLinks;
                var order = $scope.order;
                if(title && title!='Данное поле является обязательным!!!'){
                    var inputTo = $resource('/postCategoryOutOfFile');

                    var input = new inputTo();
                    input.title = title;
                    input.about = about;
                    input.areas = areas;
                    //input.areas = JSON.stringify(input.areas);
                    input.videoLinks = videoLinks;
                    //input.videoLinks = JSON.stringify(input.videoLinks);
                    input.order = order;

                    input.$save();

                    $window.location.reload();
                }else{
                    $scope.title = 'Данное поле является обязательным!!!';
                }
            }


        }else{
            $window.location.href='/admin';
        }
    }else{
        $window.location.href='/admin';
    }

});



app.controller('test',function($scope){

    $scope.input = [];
    $scope.addEl = function(){
        $scope.input.push({title:'',value:''});
    }
    $scope.confirm = function(){
        $scope.output = $scope.input;
    }
});

app.controller('admin',function($scope,$location,$window){
    $scope.session = JSON.parse($window.localStorage.getItem('session'));
    var pageHeight = window.innerHeight;
    var approxHeight = pageHeight - 280;
    if($scope.session){
        if($scope.session.pwd=='dushes05'){
            $('#myModal').modal('hide');
        }else{
            $('#myModal').modal('show');
        }
    }else{
        $('#myModal').modal('show');
    }

    $scope.exitAdmin = function(){
        $window.localStorage.clear();
        $window.location.href = '/';
    }
    $scope.checkPass = function(){
        if($scope.pass=='dushes05'){
            var objPass = {pwd:$scope.pass};
            $window.localStorage.setItem('session', JSON.stringify(objPass));
            $('#myModal').modal('hide');
        }else{
            $('#myModal').modal('show');
            $scope.errorPass = 'Вы ввели не верный пароль!'
        }
    }
});

app.controller('maintainCategory',function($scope,$resource,$routeParams,$route,$window,$q){
    var category = $routeParams.category;
    $scope.title = category;
    var cat = $resource('/getCategory/'+category);
    var todo = cat.query(function(){
        //var result = todo;
        $scope.result = todo;
        $scope.docs = todo[0].cat_documents;
    });


    $scope.filesInput = [];
    $scope.newInput = function(){
        $scope.filesInput.push({title:''});
    }

    $scope.videoLinksInput = [];
    $scope.addVideoLink = function(){
        $scope.videoLinksInput.push({videoLink:''});
    }
    $scope.areasInput = [];
    $scope.addArea = function(){
        $scope.areasInput.push({title:''});
    }

    $scope.deleteVideoYoutube = function(video){
        var del = $resource('/deleteCategoryVideoYoutube');
        var deleteVid = new del();
        deleteVid.title = video.videoLink;
        deleteVid.cat = $scope.result[0].cat_title;

        deleteVid.$save(function(vid){
            $scope.gotchaVideoLink = 'Видео удалено!';
        });
    }

    $scope.deleteVideoFile = function(video){
        var del = $resource('/deleteCategoryVideoFile');
        var deleteVid = new del();
        deleteVid.title = video;
        deleteVid.cat = $scope.result[0].cat_title;

        deleteVid.$save(function(vid){
            $scope.gotchaVideoFile = 'Видео удалено!';
        });
    }

    $scope.deleteDoc = function(doc){
        var del = $resource('/deleteCategoryDoc');
        var deleteVid = new del();
        deleteVid.title = doc;
        deleteVid.cat = $scope.result[0].cat_title;

        deleteVid.$save(function(vid){
            $scope.gotchaDoc = 'Документ удален!';
        });
    }

    $scope.deleteArea = function(area){
        var del = $resource('/deleteCategoryArea');
        var deleteVid = new del();
        deleteVid.title = area;
        deleteVid.cat = $scope.result[0].cat_title;

        deleteVid.$save(function(vid){
            $scope.gotchaArea = 'Область удалена!';
        });
    }

    $scope.deletePhoto = function(pic){
        var del = $resource('/deleteCategoryPhoto');
        var deleteVid = new del();
        deleteVid.title = pic;
        deleteVid.cat = $scope.result[0].cat_title;

        deleteVid.$save(function(vid){
            $scope.gotchaPhoto = 'Фото удалено!';
        });
    }

    $scope.makeChanges = function(){
       // $scope.saved = $scope.videoLinksInput;
        var todo = $resource('/makeCategoryChanges');
        var save = new todo();
        save.title = $scope.result[0].cat_title;
        save.videoLinks = $scope.videoLinksInput;
        save.about = $scope.about;
        save.areas = $scope.areasInput;
        save.$save();
        $window.location.reload();
    }
});

app.controller('maintainArea',function($scope,$resource,$routeParams,$route,$window,$q){
    var area = $routeParams.area;
    $scope.title = area;
    var arr = $resource('/getArea/'+area);
    var todo = arr.query(function(){
        $scope.result = todo;
    });

    $scope.equipmentsInput = [];
    $scope.addEquipment = function(){
        $scope.equipmentsInput.push({title:''});
    }

    $scope.filesInput = [];
    $scope.newInput = function(){
        $scope.filesInput.push({title:''});
    }

    $scope.videoLinksInput = [];
    $scope.addVideoLink = function(){
        $scope.videoLinksInput.push({videoLink:''});
    }
    $scope.deleteEquipment = function(item){
        var del = $resource('/deleteAreaEquipment');
        var deleteVid = new del();
        deleteVid.title = item;
        deleteVid.area = $scope.title;

        deleteVid.$save();
        $window.location.reload();
    }

    $scope.deleteDoc = function(doc){
        var del = $resource('/deleteAreaDoc');
        var deleteVid = new del();
        deleteVid.title = doc;
        deleteVid.area = $scope.title;

        deleteVid.$save();
        $window.location.reload();
    }

    $scope.deleteVideoFile = function(video){
        var del = $resource('/deleteAreaVideoFile');
        var deleteVid = new del();
        deleteVid.title = video;
        deleteVid.area = $scope.title;

        deleteVid.$save();
        $window.location.reload();
    }

    $scope.deleteVideoYoutube = function(video){
        var del = $resource('/deleteAreaVideoYoutube');
        var deleteVid = new del();
        deleteVid.title = video.videoLink;
        deleteVid.area = $scope.title;

        deleteVid.$save();
        $window.location.reload();
    }

    $scope.deletePhoto = function(pic){
        var del = $resource('/deleteAreaPhoto');
        var deleteVid = new del();
        deleteVid.title = pic;
        deleteVid.area = $scope.title;

        deleteVid.$save();
        $window.location.reload();
    }

    $scope.makeChanges = function(){
        // $scope.saved = $scope.videoLinksInput;
        var todo = $resource('/makeAreaChanges');
        var save = new todo();
        save.title = $scope.title;
        save.videoLinks = $scope.videoLinksInput;
        save.about = $scope.about;
        save.equipment = $scope.equipmentsInput;
        save.$save();
        $window.location.reload();
    }
});

app.controller('maintainEquipment',function($scope,$resource,$routeParams,$route){
    var equipment = $routeParams.equipment;
    var eq = $resource('/getEquipment/'+equipment);
    var todo = eq.query(function(){
        $scope.result = todo;
        $scope.popular = todo[0].equipment_popular;
        $scope.title = todo[0].equipment_title;
    });

    $scope.deleteVideoFile = function(video){
        var del = $resource('/deleteEquipmentVideoFile');
        var deleteVid = new del();
        deleteVid.title = video;
        deleteVid.equipment = $scope.result[0].equipment_title;

        deleteVid.$save();
        $window.location.reload();
    }
    $scope.deleteVideoYoutube = function(video){
        var del = $resource('/deleteEquipmentVideoYoutube');
        var deleteVid = new del();
        deleteVid.title = video.videoLink;
        deleteVid.equipment = $scope.result[0].equipment_title;

        deleteVid.$save();
        $window.location.reload();
    }

    $scope.videoLinksInput = [];
    $scope.addVideoLink = function(){
        $scope.videoLinksInput.push({videoLink:''});
    }

    $scope.deleteDoc = function(doc){
        var del = $resource('/deleteEquipmentDoc');
        var deleteVid = new del();
        deleteVid.title = doc;
        deleteVid.equipment = $scope.result[0].equipment_title;

        deleteVid.$save();
        $window.location.reload();
    }

    $scope.areasInput = [];
    $scope.addArea = function(){
        $scope.areasInput.push({title:''});
    }

    $scope.specInput = [];
    $scope.addSpec = function(){
        $scope.specInput.push({title:'',value:''});
    }

    $scope.deleteArea = function(area){
        var del = $resource('/deleteEquipmentArea');
        var deleteVid = new del();
        deleteVid.title = area;
        deleteVid.equipment = $scope.result[0].equipment_title;

        deleteVid.$save();
        $window.location.reload();
    }

    $scope.deleteSpec = function(title,value){
        var del = $resource('/deleteEquipmentSpec');
        var deleteVid = new del();
        deleteVid.title = title;
        deleteVid.equipment = $scope.result[0].equipment_title;

        deleteVid.$save();
        $window.location.reload();
    }

    $scope.deletePhoto = function(pic){
        var del = $resource('/deleteEquipmentPhoto');
        var deleteVid = new del();
        deleteVid.title = pic;
        deleteVid.equipment = $scope.result[0].equipment_title;

        deleteVid.$save();
        $window.location.reload();
    }

    $scope.filesInput = [];
    $scope.newInput = function(){
        $scope.filesInput.push({title:''});
    }

    $scope.makeChanges = function(){
        // $scope.saved = $scope.videoLinksInput;
        var todo = $resource('/makeEquipmentChanges');
        var save = new todo();
        save.title = $scope.title;
        save.about = $scope.about;
        save.some = $scope.some;
        save.price = $scope.price;
        save.benefits = $scope.benefits;
        save.category = $scope.category;
        save.order = $scope.order;
        save.popular = $scope.popular;
        save.videoLinksInput = $scope.videoLinksInput;
        save.areasInput = $scope.areasInput;
        save.specInput = $scope.specInput;
        save.$save();
        $window.location.reload();
    }
    /*var category = $routeParams.category;
    $scope.title = category;
    var cat = $resource('/getCategory/'+category);
    var todo = cat.query(function(){
        //var result = todo;
        $scope.result = todo;
        $scope.docs = todo[0].cat_documents;
    });


    $scope.filesInput = [];
    $scope.newInput = function(){
        $scope.filesInput.push({title:''});
    }

    $scope.videoLinksInput = [];
    $scope.addVideoLink = function(){
        $scope.videoLinksInput.push({videoLink:''});
    }
    $scope.areasInput = [];
    $scope.addArea = function(){
        $scope.areasInput.push({title:''});
    }

    $scope.makeChanges = function(){
        var about = $scope.about;
        var videoLinks = $scope.videoLinksInput;
        var areas = $scope.areasInput;
    }

    $scope.deleteVideoYoutube = function(video){
        var del = $resource('/deleteCategoryVideoYoutube');
        var deleteVid = new del();
        deleteVid.title = video.videoLink;
        deleteVid.cat = $scope.result[0].cat_title;

        deleteVid.$save(function(vid){
            $scope.gotchaVideoLink = 'Видео удалено!';
        });
    }

    $scope.deleteVideoFile = function(video){
        var del = $resource('/deleteCategoryVideoFile');
        var deleteVid = new del();
        deleteVid.title = video;
        deleteVid.cat = $scope.result[0].cat_title;

        deleteVid.$save(function(vid){
            $scope.gotchaVideoFile = 'Видео удалено!';
        });
    }

    $scope.deleteDoc = function(doc){
        var del = $resource('/deleteCategoryDoc');
        var deleteVid = new del();
        deleteVid.title = doc;
        deleteVid.cat = $scope.result[0].cat_title;

        deleteVid.$save(function(vid){
            $scope.gotchaDoc = 'Документ удален!';
        });
    }

    $scope.deleteArea = function(area){
        var del = $resource('/deleteCategoryArea');
        var deleteVid = new del();
        deleteVid.title = area;
        deleteVid.cat = $scope.result[0].cat_title;

        deleteVid.$save(function(vid){
            $scope.gotchaArea = 'Область удалена!';
        });
    }

    $scope.deletePhoto = function(pic){
        var del = $resource('/deleteCategoryPhoto');
        var deleteVid = new del();
        deleteVid.title = pic;
        deleteVid.cat = $scope.result[0].cat_title;

        deleteVid.$save(function(vid){
            $scope.gotchaPhoto = 'Фото удалено!';
        });
    }

    $scope.makeChanges = function(){
        // $scope.saved = $scope.videoLinksInput;
        var todo = $resource('/makeCategoryChanges');
        var save = new todo();
        save.title = $scope.result[0].cat_title;
        save.videoLinks = $scope.videoLinksInput;
        save.about = $scope.about;
        save.areas = $scope.areasInput;
        save.$save();
        $window.location.reload();
    }*/
});




app.controller('supplies',function($scope){

});
app.controller('monitor',function($scope){

});
app.controller('assurance',function($scope){

});