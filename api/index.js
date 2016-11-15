var db = require('./../data/db.js');
var fs = require('fs');
var gm = require('gm');
var nodemailer = require("nodemailer");
var async = require('async');
var request = require('request');


exports.addPictureAction = function(req,res,next){
    var titleAction = req.body.title;
    var order = req.body.order;
    var picsArr;

    async.series([
        function(callback){
            db.actionModel.find({title:titleAction},function(err,data){
                if(err) return next(err);
                if(!data){
                    picsArr = [];
                    picsArr.push(req.files.file.originalFilename);
                    callback(null,'making proper array');
                }else{
                    if(data.length==0){
                        picsArr = [];
                        picsArr.push(req.files.file.originalFilename);
                        callback(null,'making proper array');
                    }else{
                        if(!data[0].pictures){
                            picsArr = [];
                            picsArr.push(req.files.file.originalFilename);
                            callback(null,'making proper array');
                        }else{
                            if(data[0].pictures.length==0){
                                picsArr = [];
                                picsArr.push(req.files.file.originalFilename);
                                callback(null,'making proper array');
                            }else{
                                if(order){
                                    if(order>data[0].pictures.length){
                                        picsArr = data[0].pictures;
                                        picsArr.push(req.files.file.originalFilename);
                                        callback(null,'making proper array');
                                    }else{
                                        order -= 1;
                                        picsArr = data[0].pictures;
                                        picsArr.splice(order, 0, req.files.file.originalFilename);
                                        callback(null,'making proper array');
                                    }
                                }else{
                                    picsArr = data[0].pictures;
                                    picsArr.push(req.files.file.originalFilename);
                                    callback(null,'making proper array');
                                }
                            }
                        }
                    }
                }
            });
        },
        function(callback){
            db.actionModel.update({title:titleAction},
                {pictures:picsArr},{upsert:true},
                function(err){
                    if(err) return next(err);
                    fs.createReadStream(req.files.file.path)
                        .pipe(fs.createWriteStream('public/uploaded/'+req.files.file.originalFilename));
                    gm('public/uploaded/'+req.files.file.originalFilename)
                        .resize(300)
                        .write('public/uploaded/mini_'+req.files.file.originalFilename, function (err) {
                            if (!err) console.log('Files are loaded!');
                            callback(null,'updated db');
                        });
                }
            )
        }
    ],function(err,results){
        if(err) return next(err);
        res.send(200);
    })
}

exports.getActions = function(req,res){
    db.actionModel.find({},function(err,data){
        if(err) return next(err);
        res.send(200,data);
    })
}

exports.deleteAction = function(req,res,next){
    var title = req.params.title;
    var allPictures;
    var allPicsEquipment;
    var allPicsCategories;
    var allPicsAreas;




    async.series([
        function(callback){
            db.actionModel.aggregate(
                {$match: {'title': title}},
                {$unwind:'$pictures'},
                {$group:{_id:'$pictures',count: { $sum: 1 }}},
                function(err,data){
                    if(err) return next(err);
                    allPictures = data;
                    callback(null,'unwindedActions');
                });
        },
        function(callback){
            db.equipmentModel.aggregate(
                {$unwind:'$equipment_photo'},
                {$group:{_id:'$equipment_photo'}},
                function(err,data){
                    if(err) return next(err);
                    allPicsEquipment = data;
                    callback(null,'unwindedEquipment');
                });
        },
        function(callback){
            db.areaModel.aggregate(
                {$unwind:'$area_photos'},
                {$group:{_id:'$area_photos'}},
                function(err,data){
                    if(err) return next(err);
                    allPicsAreas = data;
                    callback(null,'unwindedAreas');
                });
        },
        function(callback){
            db.categoryModel.aggregate(
                {$unwind:'$cat_photos'},
                {$group:{_id:'$cat_photos'}},
                function(err,data){
                    if(err) return next(err);
                    allPicsCategories = data;
                    callback(null,'unwindedCategories');
                });
        },
        function(callback){
            db.actionModel.find({title:title},function(err,data){
                if(err) return next(err);
                if(data[0].pictures!=0){
                    for(var i= 0, picsTotal = data[0].pictures.length; i<picsTotal; i++){
                        if(i==picsTotal-1){
                            var objCheck = {_id:data[0].pictures[i]};
                            objCheck = JSON.stringify(objCheck);
                            allPicsEquipment = JSON.stringify(allPicsEquipment);
                            var indexOfEquipment = allPicsEquipment.indexOf(objCheck);

                            allPicsAreas = JSON.stringify(allPicsAreas);
                            var indexOfArea = allPicsAreas.indexOf(objCheck);

                            allPicsCategories = JSON.stringify(allPicsCategories);
                            var indexOfCategory = allPicsCategories.indexOf(objCheck);


                            allPictures.forEach(function(unwinded){
                                if(unwinded._id==data[0].pictures[i]){
                                    if(unwinded.count==1 && indexOfEquipment==-1 && indexOfArea==-1 && indexOfCategory==-1){
                                        var bitch = data[0].pictures[i];
                                        fs.unlink(__dirname+'/../public/uploaded/'+bitch,function(err){
                                            if(err) return next(err);
                                            fs.unlink(__dirname+'/../public/uploaded/mini_'+bitch,function(err){
                                                if(err) return next(err);
                                            });
                                        });
                                    }
                                }
                            });
                            callback(null,'deleting pics');
                        }else{
                            var objCheck = {_id:data[0].pictures[i]};
                            objCheck = JSON.stringify(objCheck);
                            allPicsEquipment = JSON.stringify(allPicsEquipment);
                            var indexOfEquipment = allPicsEquipment.indexOf(objCheck);

                            allPicsAreas = JSON.stringify(allPicsAreas);
                            var indexOfArea = allPicsAreas.indexOf(objCheck);

                            allPicsCategories = JSON.stringify(allPicsCategories);
                            var indexOfCategory = allPicsCategories.indexOf(objCheck);


                            allPictures.forEach(function(unwinded){
                                if(unwinded._id==data[0].pictures[i]){
                                    if(unwinded.count==1 && indexOfEquipment==-1 && indexOfArea==-1 && indexOfCategory==-1){
                                        var bitch = data[0].pictures[i];
                                        fs.unlink(__dirname+'/../public/uploaded/'+bitch,function(err){
                                            if(err) return next(err);
                                            fs.unlink(__dirname+'/../public/uploaded/mini_'+bitch,function(err){
                                                if(err) return next(err);
                                            });
                                        });
                                    }
                                }
                            });
                        }
                    }
                }else{
                    callback(null,'deleting pics');
                }
            })
        },
        function(callback){
            db.actionModel.remove({title:title},function(err){
                if(err) return next(err);
                callback(null,'deleted db');
            });
        }
    ],function(err,results){
        if(err) return next(err);
        res.send(200);
    });

}

exports.postActionData = function(req,res){
    db.actionModel.update({title:req.body.title},
        {
            title:req.body.title,
            about:req.body.about,
            startDate:req.body.startDate,
            endDate:req.body.endDate
        },{upsert:true},
        function(err){
            res.send(200);
        }
    )
}

//Ready block for dding files anywhere
exports.addFilesTo = function(req,res,next){
    var element = req.params.element;
    var titleEl = req.body.titleEl;
    var equipmentTitle = req.body.equipment_title;
    if(element=='equipment'){
        if(!req.body.equipment_title){
            res.send(200);
        }else{
            if(titleEl=='docs'){
                db.equipmentModel.update({equipment_title:equipmentTitle},
                    {$push:{'equipment_documents':req.files.file.originalFilename}},{upsert:true},
                    function(err){
                        if(err) return next(err);
                        fs.createReadStream(req.files.file.path)
                            .pipe(fs.createWriteStream('public/uploaded/'+req.files.file.originalFilename));
                        if (!err) console.log('Files are loaded!');
                        res.send(200);
                    }
                )
            }else if(titleEl=='video'){
                db.equipmentModel.update({equipment_title:equipmentTitle},
                    {$push:{'equipment_videos_custom':{title:req.files.file.originalFilename}}},{upsert:true},
                    function(err){
                        if(err) return next(err);
                        fs.createReadStream(req.files.file.path)
                            .pipe(fs.createWriteStream('public/uploaded/'+req.files.file.originalFilename));
                        res.send(200);
                    }
                )
            }else if(titleEl=='photos'){
                db.equipmentModel.update({equipment_title:equipmentTitle},
                    {$push:{'equipment_photo':req.files.file.originalFilename}},{upsert:true},
                    function(err){
                        if(err) return next(err);
                        fs.createReadStream(req.files.file.path)
                            .pipe(fs.createWriteStream('public/uploaded/'+req.files.file.originalFilename));
                        gm('public/uploaded/'+req.files.file.originalFilename)
                            .resize(170, 140)
                            .write('public/uploaded/mini_'+req.files.file.originalFilename, function (err) {
                                if (!err) console.log('Files are loaded!');
                                res.send(200);
                            });
                    }
                )
            }
        }
    }else if(element=='areas'){
        if(!req.body.area_title){
            res.send(200);
        }else{
            if(titleEl=='docs'){
                db.areaModel.update({area_title:req.body.area_title},
                    {$push:{'area_documents':req.files.file.originalFilename}},{upsert:true},
                    function(err){
                        if(err) return next(err);
                        fs.createReadStream(req.files.file.path)
                            .pipe(fs.createWriteStream('public/uploaded/'+req.files.file.originalFilename));
                        res.send(200);
                    }
                )
            }else if(titleEl=='photos'){
                db.areaModel.update({area_title:req.body.area_title},
                    {$push:{'area_photos':req.files.file.originalFilename}},{upsert:true},
                    function(err){
                        if(err) return next(err);
                        fs.createReadStream(req.files.file.path)
                            .pipe(fs.createWriteStream('public/uploaded/'+req.files.file.originalFilename));
                        gm('public/uploaded/'+req.files.file.originalFilename)
                            .resize(170, 140)
                            .write('public/uploaded/mini_'+req.files.file.originalFilename, function (err) {
                                if (!err) console.log('Files are loaded!');
                                res.send(200);
                            });
                    }
                )
            }else if(titleEl=='video'){
                db.areaModel.update({area_title:req.body.area_title},
                    {$push:{'area_videos_custom':{title:req.files.file.originalFilename}}},{upsert:true},
                    function(err){
                        if(err) return next(err);
                        fs.createReadStream(req.files.file.path)
                            .pipe(fs.createWriteStream('public/uploaded/'+req.files.file.originalFilename));
                        res.send(200);
                    }
                )
            }
        }
    }else if(element=='category'){
        if(!req.body.category_title){
            res.send(200);
        }else{
            if(titleEl=='docs'){
                db.categoryModel.update({cat_title:req.body.category_title},
                    {$push:{'cat_documents':req.files.file.originalFilename}},{upsert:true},
                    function(err){
                        if(err) return next(err);
                        fs.createReadStream(req.files.file.path)
                            .pipe(fs.createWriteStream('public/uploaded/'+req.files.file.originalFilename));
                        if (!err) console.log('Files are loaded!');
                        res.send(200);
                    }
                )
            }else if(titleEl=='photos'){
                db.categoryModel.update({cat_title:req.body.category_title},
                    {$push:{'cat_photos':req.files.file.originalFilename}},{upsert:true},
                    function(err){
                        if(err) return next(err);
                        fs.createReadStream(req.files.file.path)
                            .pipe(fs.createWriteStream('public/uploaded/'+req.files.file.originalFilename));
                        gm('public/uploaded/'+req.files.file.originalFilename)
                            .resize(170, 140)
                            .write('public/uploaded/mini_'+req.files.file.originalFilename, function (err) {
                                if (!err) console.log('Files are loaded!');
                                res.send(200);
                            });
                    }
                )
            }else if(titleEl == 'video'){
                db.categoryModel.update({cat_title:req.body.category_title},{$push:{cat_videos_custom:{title:req.files.file.originalFilename}}},{upsert:true},function(err){
                    if(err) return next(err);
                    fs.createReadStream(req.files.file.path)
                        .pipe(fs.createWriteStream('public/uploaded/'+req.files.file.originalFilename));
                    res.send(200);
                });
            }
        }
    }
}

exports.deleteFileEquipment = function(req,res,next){
    var file = req.params.file;
    var type = req.params.type;
    if(type=='docs'){
        db.equipmentModel.update({equipment_documents:file},
            { $pull: {"equipment_documents": file}},function(err){
                if(err) return next(err);
                fs.unlink(__dirname+'/../public/uploaded/'+file,function(err){
                    if(err) return next(err);
                    console.log('deleted - '+file);
                    res.send(200);
                });
            });
    }else if(type=='photos'){
        db.equipmentModel.update({equipment_photo:file},
            { $pull: {"equipment_photo": file}},function(err){
                if(err) return next(err);
                fs.unlink(__dirname+'/../public/uploaded/'+file,function(err){
                    if(err) return next(err);
                    fs.unlink(__dirname+'/../public/uploaded/mini_'+file,function(err){
                        if(err) return next(err);
                        console.log('deleted - '+file);
                        res.send(200);
                    })
                });
            });
    }

}
exports.deleteFileArea = function(req,res,next){
    var file = req.params.file;
        db.areaModel.update({area_photos:file},
            { $pull: {"area_photos": file}},function(err){
                if(err) return next(err);
                fs.unlink(__dirname+'/../public/uploaded/'+file,function(err){
                    if(err) return next(err);
                    fs.unlink(__dirname+'/../public/uploaded/mini_'+file,function(err){
                        if(err) return next(err);
                        console.log('deleted - '+file);
                        res.send(200);
                    })
                });
            });
}

exports.deleteFileCategory = function(req,res,next){
    var file = req.params.file;
    var type = req.params.type;
    if(type=='docs'){
        db.categoryModel.update({cat_documents:file},
            { $pull: {"cat_documents": file}},function(err){
                if(err) return next(err);
                fs.unlink(__dirname+'/../public/uploaded/'+file,function(err){
                    if(err) return next(err);
                    console.log('deleted - '+file);
                    res.send(200);
                });
            });
    }else if(type=='photos'){
        db.categoryModel.update({cat_photos:file},
            { $pull: {"cat_photos": file}},function(err){
                if(err) return next(err);
                fs.unlink(__dirname+'/../public/uploaded/'+file,function(err){
                    if(err) return next(err);
                    fs.unlink(__dirname+'/../public/uploaded/mini_'+file,function(err){
                        if(err) return next(err);
                        console.log('deleted - '+file);
                        res.send(200);
                    })
                });
            });
    }

}







exports.deleteEquipmentTotal = function(req,res,next){
    var equipmentTitle = req.params.equipment;
    db.equipmentModel.find({equipment_title:equipmentTitle},function(err,data){
        if(err) return next(err);
        if(data.equipment_photo && data.equipment_photo.length!=0){
            data.equipment_photo.forEach(function(pic){
                fs.unlink(__dirname+'/../public/uploaded/'+pic,function(err){
                    if(err) return next(err);
                    fs.unlink(__dirname+'/../public/uploaded/mini_'+pic,function(err){
                        if(err) return next(err);
                    })
                })
            });
        }
        if(data.equipment_documents && data.equipment_documents.length!=0){
            data.equipment_documents.forEach(function(doc){
                fs.unlink(__dirname+'/../public/uploaded/'+doc,function(err){
                    if(err) return next(err);
                })
            });
        }
        db.equipmentModel.remove({equipment_title:equipmentTitle},function(err){
            if(err) return next(err);
        });
    });
};

exports.deleteCategoryTotal = function(req,res,next){
    var categoryTitle = req.params.category;
    db.categoryModel.find({cat_title:categoryTitle},function(err,data){
        if(err) return next(err);
        if(data.cat_photos && data.cat_photos.length!=0){
            data.cat_photos.forEach(function(pic){
                fs.unlink(__dirname+'/../public/uploaded/'+pic,function(err){
                    if(err) return next(err);
                    fs.unlink(__dirname+'/../public/uploaded/mini_'+pic,function(err){
                        if(err) return next(err);
                    })
                })
            });
        }
        if(data.cat_documents && data.cat_documents.length!=0){
            data.cat_documents.forEach(function(doc){
                fs.unlink(__dirname+'/../public/uploaded/'+doc,function(err){
                    if(err) return next(err);
                })
            });
        }
        db.categoryModel.remove({cat_title:categoryTitle},function(err){
            if(err) return next(err);
        });
    });
};

exports.deleteAreaTotal = function(req,res,next){
    var areaTitle = req.params.area;
    db.areaModel.find({area_title:areaTitle},function(err,data){
        if(err) return next(err);
        if(data.area_photos && data.area_photos.length!=0){
            data.area_photos.forEach(function(pic){
                fs.unlink(__dirname+'/../public/uploaded/'+pic,function(err){
                    if(err) return next(err);
                    fs.unlink(__dirname+'/../public/uploaded/mini_'+pic,function(err){
                        if(err) return next(err);
                    })
                })
            });
        }
        db.areaModel.remove({area_title:areaTitle},function(err){
            if(err) return next(err);
        });
    });
};

//At the menu administration posting data without photo
exports.postEquipmentOutOfFile = function(req,res,next){
    var title = req.body.title;
    async.parallel([
        function(callback){
            if(req.body.about!==undefined){
                db.equipmentModel.update({equipment_title:title},{equipment_about:req.body.about},{upsert:true},function(err){
                    if(err) return next(err);
                    console.log('about');
                    callback(null, 'about');
                });
            }
        },
        function(callback){
            if(req.body.some!==undefined){
                db.equipmentModel.update({equipment_title:title},{equipment_some:req.body.some},{upsert:true},function(err){
                    if(err) return next(err);
                    console.log('some');
                    callback(null, 'some');
                });
            }
        },
        function(callback){
            if(req.body.price!==undefined){
                db.equipmentModel.update({equipment_title:title},{equipment_price:req.body.price},{upsert:true},function(err){
                    if(err) return next(err);
                    console.log('price');
                    callback(null, 'price');
                });
            }
        },
        function(callback){
            if(req.body.benefit!==undefined){
                db.equipmentModel.update({equipment_title:title},{equipment_benefits:req.body.benefit},{upsert:true},function(err){
                    if(err) return next(err);
                    console.log('benefits');
                    callback(null, 'benefits');
                });
            }
        },
        function(callback){
            if(req.body.category!==undefined){
                db.equipmentModel.update({equipment_title:title},{equipment_category:req.body.category},{upsert:true},function(err){
                    if(err) return next(err);
                    console.log('category');
                    callback(null, 'category');
                });
            }
        },
        function(callback){
            if(req.body.specs.length!=0){
                for(var i=0; i<req.body.specs.length; i++){
                    if(i==req.body.specs.length){
                        console.log('specs');
                        callback(null, 'specs');
                    }else{
                        db.equipmentModel.update({equipment_title:title},{$push:{equipment_spec:req.body.specs[i]}},{upsert:true},function(err){
                            if(err) return next(err);
                        });
                    }
                }
            }
        },
        function(callback){
            if(req.body.areas.length!=0){
                for(var i = 0; i<req.body.areas.length; i++){
                    if(i==req.body.areas.length){
                        console.log('areas');
                        callback(null, 'areas');
                    }else{
                        db.equipmentModel.update({equipment_title:title},{$push:{equipment_areas:req.body.areas[i]}},{upsert:true},function(err){
                            if(err) return next(err);
                        });
                    }
                }
            }
        },
        function(callback){
            if(req.body.videoLinks.length!=0){
                for(var i=0; i<req.body.videoLinks.length; i++){
                    if(i==req.body.videoLinks.length){
                        console.log('videoLinks');
                        callback(null, 'videoLinks');
                    }else{
                        db.equipmentModel.update({equipment_title:title},{$push:{equipment_videos:req.body.videoLinks[i]}},{upsert:true},function(err){
                            if(err) return next(err);
                        });
                    }
                }
            }
        },
        function(callback){
            if(req.body.order!==undefined){
                db.equipmentModel.update({equipment_title:title},{equipment_order:req.body.order},{upsert:true},function(err){
                    if(err) return next(err);
                    console.log('order');
                    callback(null, 'order');
                });
            }
        },
        function(callback){
            if(req.body.popular!==undefined){
                db.equipmentModel.update({equipment_title:title},{equipment_popular:req.body.popular},{upsert:true},function(err){
                    if(err) return next(err);
                    console.log('popular');
                    callback(null, 'popular');
                });
            }
        }
    ],
        function(err, results){
            res.send(200);
            console.log('done pasting!');
        });
}
//At the menu administration posting data without photo
exports.postAreaOutOfFile = function(req,res,next){
    if(!req.body.title){
        res.send(200);
    }else{
        var title = req.body.title;
        var about = req.body.about || '';
        var equipments = req.body.equipments || [];


        if(req.body.videoLinks===undefined){
            var videoLinks = [];
        }else{
            var videoLinks = req.body.videoLinks;
        }
        db.areaModel.update({area_title:title},{ area_about:about,area_equipment:equipments,area_videos:videoLinks},{upsert:true},function(err){
            if(err) return next(err);
            res.send(200);
        });
    }
}
//At the menu administration posting data without photo
exports.postCategoryOutOfFile = function(req,res,next){
    var title = req.body.title;
    if(req.body.about===undefined){
        var about = '';
    }else{
        var about = req.body.about;
    }

    if(req.body.areas===undefined){
        var areas = [];
    }else{
        var areas = req.body.areas;
    }

    if(req.body.videoLinks===undefined){
        var videoLinks = [];
    }else{
        var videoLinks = req.body.videoLinks;
    }

    if(req.body.order===undefined){
        var order = '';
    }else{
        var order = req.body.order;
    }
            db.categoryModel.update({cat_title:title},{cat_about:about,cat_areas:areas,cat_videos:videoLinks,cat_order:order},{upsert:true},function(err){
                if(err) return next(err);
                res.send(200);
            });

}
exports.getEquipmentsTotal = function(req,res,next){
    db.equipmentModel.aggregate({$sort:{equipment_order:1}},function(err,data){
        if(err) return next(err);
        console.log(data);
        res.send(data);
    });
}
exports.getAreasTotal = function(req,res,next){
    db.areaModel.find({},function(err,data){
        if(err) return next(err);
        res.send(data);
    });
}
exports.getAreaTotal = function(req,res,next){
    var area = req.params.area;
    db.areaModel.find({area_title:area},function(err,data){
        if(err) return next(err);
        res.send(data);
    });
}
exports.getCategoriesTotal = function(req,res,next){
    db.categoryModel.aggregate({$sort:{cat_order:1}},function(err,data){
        if(err) return next(err);
        res.send(data);
    });
}
exports.getEquipmentsTotalByCat = function(req,res,next){
    var cat = req.params.bycat;
    db.equipmentModel.aggregate({$match:{equipment_category:cat}},{$sort:{equipment_order:1}},function(err,data){
        if(err) return next(err);
        var info = data;
        res.send(info);
    });
}
exports.getEquipmentsTotalByArea = function(req,res,next){
    var area = req.params.area;
    ///Defining proper exit object
    var printers = [];
    db.equipmentModel.find({},function(err,data){
        if(err) return next(err);
        var lenka = data.length;
        for(var i=0; i<lenka; i++){
            var printer = data[i].equipment_title;
            var photo = data[i].equipment_photo;
            var areas = data[i].equipment_areas;
            for(var xi=0; xi<areas.length; xi++){
                var printerObj = {};
                if(areas[xi].title==area){
                    printerObj.title = printer;
                    printerObj.photo = photo[0];
                    printers.push(printerObj);
                }
            }
        }
        res.send(printers);
    });
}
exports.getAreasTotalByEquipment = function(req,res,next){
    var equipment = req.params.equipment;
    var output = [];
    db.equipmentModel.find({equipment_title:equipment},function(err,info){
        if(err) return next(err);
        var equipAreas = info[0].equipment_areas;
        for(var i=0; i<equipAreas.length; i++){

                db.areaModel.find({area_title:equipAreas[i].title},function(err,data){
                    if(err) return next(err);
                    if(data.length!=0){
                        var outputObj = {};
                        outputObj.title = data[0].area_title;
                        outputObj.photos = data[0].area_photos;
                        output.push(outputObj);
                        if(output.length==equipAreas.length){
                            res.send(200,output);
                        }
                    }else{
                        //res.send('no result');
                    }
                });
        }
    });
}
exports.getEquipmentTotal = function(req,res,next){
    var equipment = req.params.equipment;
    db.equipmentModel.find({equipment_title:equipment},function(err,data){
        if(err) return next(err);
        var info = data;
       // console.log(info);
        res.send(info);
    });
}


exports.sendEmail = function(req,res,next){
    var name = req.body.name;
    var emailAddress = req.body.emailFrom;
    var theme = req.body.theme;
    var body = req.body.body;




    var transporter = nodemailer.createTransport();
    transporter.sendMail({
        from: emailAddress,
        to: 'info.uncojet@uncojet.com',
        subject: theme,
        text: body
    }, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }
    });


   /* // create reusable transport method (opens pool of SMTP connections)
     var smtpTransport = nodemailer.createTransport("SMTP",{
     service: "Gmail",
     auth: {
     user: "meandevelopmentstudio@gmail.com",
     pass: "vladimir050486"
     }
     });

     // setup e-mail data with unicode symbols
     var mailOptions = {
     from: emailAddress, // sender address
     to: "meandevelopmentstudio@gmail.com", // list of receivers
     subject:theme, // Subject line
     text: body, // plaintext body
     html: "<b>"+body+" ---- От:"+name+" - "+emailAddress+"</b>" // html body
     }

     // send mail with defined transport object
     smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
     console.log(error);
     }else{
     console.log("Message sent: " + response.message);
     }
     });*/



    /*var mail = require("nodemailer").mail;

    mail({
        from: name+" ✔ "+emailAddress, // sender address
        to: "meandevelopmentstudio@gmail.com", // list of receivers
        subject: theme+" ✔", // Subject line
        text: body+" ✔", // plaintext body
        html: "<b>"+body+" ✔</b>" // html body
    });*/

}

exports.search = function(req,res,next){
    var item = req.params.item;
    var result = {};
    async.series([
        function(callback){
            db.equipmentModel.find( { equipment_title: { $regex: item, $options: 'i' } },function(err,data){
                if(err) return next(err);
                callback(null,data);
            } );
        },
        function(callback){
            db.areaModel.find({area_title:{$regex:item, $options: 'i'}},function(err,data){
                if(err) return next(err);
                callback(null,data);
            });
        },function(callback){
            db.categoryModel.find({cat_title:{$regex:item, $options: 'i'}},function(err,data){
                if(err) return next(err);
                callback(null,data);
            });
        }
    ],function(err,results){
        if(results[0].length!=0){
            result.equipment = results[0];
        }
        if(results[1].length!=0){
            result.area = results[1];
        }
        if(results[2].length!=0){
            result.category = results[2];
        }
        res.send(200,result);
    });


    /*db.areaModel.find({area_title:item},function(err,areas){
        if(err) return next(err);
        results.areas = areas;
        db.categoryModel.aggregate({$match:{cat_title:item}},{$sort:{cat_order:1}},function(err,categories){
            if(err) return next(err);
            results.categories = categories;
            db.equipmentModel.aggregate({$match:{equipment_title:item}},{$sort:{equipment_order:1}},function(err,printers){
                if(err) return next(err);
                results.equipment = printers;
                res.send(results);
            });
        });
    });*/
}

exports.getCategory = function(req,res,next){
    var category = req.params.category;
    db.categoryModel.find({cat_title:category},function(err,data){
        if(err) return next(err);
        res.send(200,data);
    });
}

exports.deleteCategoryVideoYoutube = function(req,res,next){
    var link = req.body.title;
    var cat = req.body.cat;
    //If array with objects
    db.categoryModel.update({cat_title:cat},{$pull:{cat_videos:{videoLink:link}}},function(err){
    if(err) return next(err);
    res.send(200);
});
}

exports.deleteCategoryVideoFile = function(req,res,next){
    var link = req.body.title;
    var cat = req.body.cat;
    //If array with objects
    db.categoryModel.update({cat_title:cat},{$pull:{cat_videos_custom:{title:link}}},function(err){
        if(err) return next(err);
        fs.unlink(__dirname+'/../public/uploaded/'+link,function(err){
            if(err) return next(err);
            res.send(200);
        })
    })
}

exports.deleteCategoryDoc = function(req,res,next){
    var link = req.body.title;
    var cat = req.body.cat;
    //If array with objects
    db.categoryModel.update({cat_title:cat},{$pull:{cat_documents:link}},function(err){
        if(err) return next(err);
        fs.unlink(__dirname+'/../public/uploaded/'+link,function(err){
            if(err) return next(err);
                res.send(200);
        })
    })
}

exports.deleteCategoryArea = function(req,res,next){
    var link = req.body.title;
    var cat = req.body.cat;
    //If array with objects
    db.categoryModel.update({cat_title:cat},{$pull:{cat_areas:{title:link}}},function(err){
        if(err) return next(err);
        res.send(200);
    })
}

exports.deleteCategoryPhoto = function(req,res,next){
    var link = req.body.title;
    var cat = req.body.cat;
    //If array with objects
    db.categoryModel.update({cat_title:cat},{$pull:{cat_photos:link}},function(err){
        if(err) return next(err);
        fs.unlink(__dirname+'/../public/uploaded/'+link,function(err){
            if(err) return next(err);
            fs.unlink(__dirname+'/../public/uploaded/mini_'+link,function(err){
                if(err) return next(err);
                res.send(200);
            })
        })
    })
}

exports.makeCategoryChanges = function(req,res,next){
    var videoLinks = req.body.videoLinks;
    var about = req.body.about;
    var areas = req.body.areas;
    var cat = req.body.title;


    async.parallel([
        function(callback){
            if(videoLinks.length!=0){
                for(var i=0; i<videoLinks.length; i++){
                    if(i==videoLinks.length){
                        callback(null, 'videoLinks');
                    }else{
                        db.categoryModel.update({cat_title:cat},{$push:{cat_videos:videoLinks[i]}},function(err){
                            if(err) return next(err);
                        });
                    }
                }
            }
        },
        function(callback){
            if(about!='undefined' && about!=''){
                db.categoryModel.update({cat_title:cat},{cat_about:about},function(err){
                    if(err) return next(err);
                    callback(null, 'about');
                });
            }
        },
        function(callback){
            if(areas.length!=0){
                for(var i=0; i<areas.length; i++){
                    if(i==areas.length){
                        callback(null, 'areas');
                    }else{
                        db.categoryModel.update({cat_title:cat},{$push:{cat_areas:areas[i]}},function(err){
                            if(err) return next(err);
                        });
                    }
                }
            }
        }
    ],
// optional callback
        function(err, results){
            res.send(200,'done!');
        });
}

exports.getArea = function(req,res,next){
    var area = req.params.area;
    db.areaModel.find({area_title:area},function(err,data){
        if(err) return next(err);
        res.send(200,data);
    });
}

exports.deleteAreaEquipment = function(req,res,next){
    var link = req.body.title;
    var area = req.body.area;
    //If array with objects
    db.areaModel.update({area_title:area},{$pull:{area_equipment:{title:link}}},function(err){
        if(err) return next(err);
        res.send(200);
    })
}

exports.deleteAreaDoc = function(req,res,next){
    var link = req.body.title;
    var area = req.body.area;
    //If array with objects
    db.areaModel.update({area_title:area},{$pull:{area_documents:link}},function(err){
        if(err) return next(err);
        fs.unlink(__dirname+'/../public/uploaded/'+link,function(err){
            if(err) return next(err);
            res.send(200);
        })
    })
}

exports.deleteAreaVideoFile = function(req,res,next){
    var link = req.body.title;
    var area = req.body.area;
    //If array with objects
    db.areaModel.update({area_title:area},{$pull:{area_videos_custom:{title:link}}},function(err){
        if(err) return next(err);
        fs.unlink(__dirname+'/../public/uploaded/'+link,function(err){
            if(err) return next(err);
            res.send(200);
        })
    })
}

exports.deleteAreaVideoYoutube = function(req,res,next){
    var link = req.body.title;
    var area = req.body.area;
    //If array with objects
    db.areaModel.update({area_title:area},{$pull:{area_videos:{videoLink:link}}},function(err){
        if(err) return next(err);
        res.send(200);
    });
}

exports.deleteAreaPhoto = function(req,res,next){
    var link = req.body.title;
    var area = req.body.area;
    //If array with objects
    db.areaModel.update({area_title:area},{$pull:{area_photos:link}},function(err){
        if(err) return next(err);
        fs.unlink(__dirname+'/../public/uploaded/'+link,function(err){
            if(err) return next(err);
            fs.unlink(__dirname+'/../public/uploaded/mini_'+link,function(err){
                if(err) return next(err);
                res.send(200);
            })
        })
    })
}

exports.makeAreaChanges = function(req,res,next){
    var videoLinks = req.body.videoLinks;
    var about = req.body.about;
    var equipment = req.body.equipment;
    var area = req.body.title;


    async.parallel([
        function(callback){
            if(videoLinks.length!=0){
                for(var i=0; i<videoLinks.length; i++){
                    if(i==videoLinks.length){
                        callback(null, 'videoLinks');
                    }else{
                        db.areaModel.update({area_title:area},{$push:{area_videos:videoLinks[i]}},function(err){
                            if(err) return next(err);
                        });
                    }
                }
            }
        },
        function(callback){
            if(about!='undefined' && about!=''){
                db.areaModel.update({area_title:area},{area_about:about},function(err){
                    if(err) return next(err);
                    callback(null, 'about');
                });
            }
        },
        function(callback){
            if(equipment.length!=0){
                for(var i=0; i<equipment.length; i++){
                    if(i==equipment.length){
                        callback(null, 'equipment');
                    }else{
                        db.areaModel.update({area_title:area},{$push:{area_equipment:equipment[i]}},function(err){
                            if(err) return next(err);
                        });
                    }
                }
            }
        }
    ],
// optional callback
        function(err, results){
            res.send(200,'done!');
        });
}

exports.getEquipment = function(req,res,next){
    var title = req.params.equipment;
    db.equipmentModel.find({equipment_title:title},function(err,data){
        if(err) return next(err);
        res.send(200,data);
    });
}

exports.deleteEquipmentVideoFile = function(req,res,next){
    var link = req.body.title;
    var eq = req.body.equipment;
    //If array with objects
    db.equipmentModel.update({equipment_title:eq},{$pull:{equipment_videos_custom:{title:link}}},function(err){
        if(err) return next(err);
        fs.unlink(__dirname+'/../public/uploaded/'+link,function(err){
            if(err) return next(err);
            res.send(200);
        })
    })
}

exports.deleteEquipmentVideoYoutube = function(req,res,next){
    var link = req.body.title;
    var equipment = req.body.equipment;
    //If array with objects
    db.equipmentModel.update({equipment_title:equipment},{$pull:{equipment_videos:{videoLink:link}}},function(err){
        if(err) return next(err);
        res.send(200);
    });
}

exports.deleteEquipmentDoc = function(req,res,next){
    var link = req.body.title;
    var equipment = req.body.equipment;
    //If array with objects
    db.equipmentModel.update({equipment_title:equipment},{$pull:{equipment_documents:link}},function(err){
        if(err) return next(err);
        fs.unlink(__dirname+'/../public/uploaded/'+link,function(err){
            if(err) return next(err);
            res.send(200);
        })
    })
}

exports.deleteEquipmentArea = function(req,res,next){
    var link = req.body.title;
    var equipment = req.body.equipment;
    //If array with objects
    db.equipmentModel.update({equipment_title:equipment},{$pull:{equipment_areas:{title:link}}},function(err){
        if(err) return next(err);
        res.send(200);
    })
}

exports.deleteEquipmentSpec = function(req,res,next){
    var title = req.body.title;
    var equipment = req.body.equipment;
    //If array with objects
    db.equipmentModel.update({equipment_title:equipment},{$pull:{equipment_spec:{title:title}}},function(err){
        if(err) return next(err);
        res.send(200);
    });
}

exports.deleteEquipmentPhoto = function(req,res,next){
    var title = req.body.title;
    var equipment = req.body.equipment;
    //If array with objects
    db.equipmentModel.update({equipment_title:equipment},{$pull:{equipment_photo:title}},function(err){
        if(err) return next(err);
        fs.unlink(__dirname+'/../public/uploaded/'+title,function(err){
            if(err) return next(err);
            fs.unlink(__dirname+'/../public/uploaded/mini_'+title,function(err){
                if(err) return next(err);
                res.send(200);
            })
        })
    })
}

exports.makeEquipmentChanges = function(req,res,next){
    var title = req.body.title;
    var about = req.body.about;
    var some = req.body.some;
    var price = req.body.price;
    var benefits = req.body.benefits;
    var category = req.body.category;
    var order = req.body.order;
    var popular = req.body.popular;
    var videoLinks = req.body.videoLinksInput;
    var areas = req.body.areasInput;
    var spec = req.body.specInput;


    async.parallel([
        function(callback){
            if(about!==undefined && about!=''){
                db.equipmentModel.update({equipment_title:title},{equipment_about:about},function(err){
                    if(err) return next(err);
                    callback(null, 'about');
                });
            }
        },
        function(callback){
            if(some!==undefined && some!=''){
                db.equipmentModel.update({equipment_title:title},{equipment_some:some},function(err){
                    if(err) return next(err);
                    callback(null, 'some');
                });
            }
        },
        function(callback){
            if(price!==undefined && price!=''){
                db.equipmentModel.update({equipment_title:title},{equipment_price:price},function(err){
                    if(err) return next(err);
                    callback(null, 'price');
                });
            }
        },
        function(callback){
            if(benefits!==undefined && benefits!=''){
                db.equipmentModel.update({equipment_title:title},{equipment_benefits:benefits},function(err){
                    if(err) return next(err);
                    callback(null, 'benefits');
                });
            }
        },
        function(callback){
            if(category!==undefined && category!=''){
                db.equipmentModel.update({equipment_title:title},{equipment_category:category},function(err){
                    if(err) return next(err);
                    callback(null, 'category');
                });
            }
        },
        function(callback){
            if(order!==undefined && order!=''){
                db.equipmentModel.update({equipment_title:title},{equipment_order:order},function(err){
                    if(err) return next(err);
                    callback(null, 'order');
                });
            }
        },
        function(callback){
            if(popular!==undefined && popular!=''){
                db.equipmentModel.update({equipment_title:title},{equipment_popular:popular},function(err){
                    if(err) return next(err);
                    callback(null, 'popular');
                });
            }
        },
        function(callback){
            if(videoLinks.length!=0){
                for(var i=0; i<videoLinks.length; i++){
                    if(i==videoLinks.length){
                        callback(null, 'videoLinks');
                    }else{
                        db.equipmentModel.update({equipment_title:title},{$push:{equipment_videos:videoLinks[i]}},function(err){
                            if(err) return next(err);
                        });
                    }
                }
            }
        },
        function(callback){
            if(areas.length!=0){
                for(var i=0; i<areas.length; i++){
                    if(i==areas.length){
                        callback(null, 'areas');
                    }else{
                        db.equipmentModel.update({equipment_title:title},{$addToSet:{equipment_areas:areas[i]}},function(err){
                            if(err) return next(err);
                        });
                    }
                }
            }
        },
        function(callback){
            if(spec.length!=0){
                for(var i=0; i<spec.length; i++){
                    if(i==spec.length){
                        callback(null, 'spec');
                    }else{
                        db.equipmentModel.update({equipment_title:title},{$addToSet:{equipment_spec:spec[i]}},function(err){
                            if(err) return next(err);
                        });
                    }
                }
            }
        }
    ],
// optional callback
        function(err, results){
            res.send(200,'done!');
        });
}