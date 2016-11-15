var mongoose = require('mongoose');
var options = {
    user: 'uncojet',
    pass: 'videojet'
}
mongoose.connect('mongodb://localhost/uncojet');

var mongoose = require('mongoose');

var equipment = mongoose.Schema({
    equipment_title:{
        type:String,
        unique:true
    },
    equipment_photo:{
        type:[]
    },
    equipment_about:{
        type:String
    },
    equipment_some:{
        type:String
    },
    equipment_spec:{
        type:[]
    },
    equipment_price:{
        type:String
    },
    equipment_benefits:{
        type:String
    },
    equipment_areas:{
        type:[]
    },
    equipment_documents:{
        type:[]
    },
    equipment_videos:{
        type:[]
    },
    equipment_videos_custom:{
        type:[]
    },
    equipment_category:{
        type:String
    },
    equipment_order:{
        type:String
    },
    equipment_popular:{
        type:String
    }
});
exports.equipmentModel = mongoose.model('equipment',equipment);


var categories = mongoose.Schema({
    cat_title:{
        type:String,
        unique:true
    },
    cat_photos:{
        type:[],
        unique:false
    },
    cat_about:{
        type:String
    },
    cat_areas:{
        type:[],
        unique:false
    },
    cat_documents:{
        type:[],
        unique:false
    },
    cat_videos:{
        type:[],
        unique:false
    },
    cat_videos_custom:{
        type:[],
        unique:false
    },
    cat_order:{
        type:Number
    }
});
exports.categoryModel = mongoose.model('categories',categories);

var action = mongoose.Schema({
    title:String,
    about:String,
    startDate:{ type: Date, default: Date.now },
    endDate:Date,
    pictures:[]
});

exports.actionModel = mongoose.model('actions',action);


var areas = mongoose.Schema({
    area_title:{
        type:String,
        unique:true
    },
    area_about:{
        type:String,
        unique:false
    },
    area_photos:{
        type:[],
        unique:false
    },
    area_videos:{
        type:[],
        unique:false
    },
    area_videos_custom:{
        type:[],
        unique:false
    },
    area_documents:{
        type:[],
        unique:false
    },
    area_equipment:{
        type:[],
        unique:false
    }
});
exports.areaModel = mongoose.model('area',areas);
