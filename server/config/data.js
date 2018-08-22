const workflowStates = require('./workflow');

module.exports = {
    lastUpdateTime:0,
    severityList:[
        {
            value: 0,
            name: 'Moderate',
        },
        {
            value: 3,
            name: 'Needs Help',
        },
        {
            value: 4,
            name: 'Urgent',
        },
        {
            value: 6,
            name: 'Very Urgent',
        },
        {
            value: 8,
            name: 'Life Threatening',
        }
    ],
    requestTypeList:[  
        {
            value:'food_and_water',
            name:'ഭക്ഷണം വെള്ളം / Food & Water ready to serve',
        },
        {
            value:'food_rawmaterial',
            name:'അരി - കറി സാമഗ്രികൾ  / Food Raw materials',
        },
        {
            value:'medicine_blankets',
            name:'മരുന്നുകൾ സാമഗ്രികൾ / Medicine & Blankets'
        },
        {
            value:'home_items',
            name:'വീട്ടുപകരണങ്ങൾ / Home Items'
        },
        {
            value:'clothing',
            name:'വസ്ത്രങ്ങൾ / Clothing'
        },
        {
            value:'home_lost',
            name:'വീട് നഷ്ടപ്പെട്ടവർ / Lost Home'
        },
        {
            value:'kitchen_utencils',
            name:'പാത്രങ്ങൾ - ഗ്യാസ് / Kitchen Utencils - Gas'
        },
        {
            value:'find_missing',
            name:'പ്രിയപ്പെട്ടവരുടെ വിവരം അറിയുക /Find Missing people',
        },
        {
            value:'rescue',
            name:'രക്ഷപെടുത്തൂ / Rescue Me'
        },
        {
            value:'rescue_someone',
            name:'മറ്റൊരാളെ രക്ഷപെടുത്തൂ /Rescue Someone'
        },
        {
            value:'other',
            name:'Other / മറ്റുള്ളവ '
        }
    ],
    statusList :workflowStates,
    districtMap : {
        "alp":"Alappuzha",
        "ekm":"Ernakulam",
        "idk":"Idukki",
        "knr":"Kannur",
        "ksr":"Kasaragod",
        "kol":"Kollam",
        "ktm":"Kottayam",
        "koz":"Kozhikode",
        "mpm":"Malappuram",
        "pkd":"Palakkad",
        "ptm":"Pathanamthitta",
        "tvm":"Thiruvananthapuram",
        "tcr":"Thrissur",
        "wnd":"Wayanad",
    }
}