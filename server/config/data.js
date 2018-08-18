
const STATUS = {
    NEW:'new',
    CONFIRM:'confirm',
    RETRY:'retry',
    NEED_HELP:'need_help',
    ESCALATED:'escalated',
    RESOLVED:'resolved',
    EXTERNAL:'external'
}
module.exports = {
    statusList : [
        {
            key:STATUS.NEW,
            title:'1.Check',
            db:[STATUS.NEW.toUpperCase()],
            cls:'w3-blue',
            nextStates:[
                    {
                        text:'Call and Confirm (2.Confirm)',
                        value:'cleanup_confirm',
                        target:STATUS.CONFIRM
                    },
                    {
                        text:'Sufficient Information Not availabe (6.Resolved)',
                        value:'cleanup_no_info',
                        target:STATUS.RESOLVED
                    },
                    {
                        text:'Duplicate Request (6.Resolved)',
                        value:'cleanup_duplicate',
                        target:STATUS.RESOLVED
                    },
                    
                    {
                        text:'Spam / Incorrect Informatoin (6.Resolved)',
                        value:'cleanup_spam',
                        target:STATUS.RESOLVED
                    },
                ],
        },
        { 
            key:STATUS.CONFIRM,
            title:'2.Confirmation Call',
            cls:'w3-yellow',
            db:[STATUS.CONFIRM.toUpperCase()],
            nextStates:[ 
                {
                    text:'Needs Help (4.Needs Help)',
                    value:"confirm_needs_help",
                    target:STATUS.NEED_HELP
                },
                {
                    text:'Is Safe Now (6.Resolved)',
                    value:'confirm_is_safe',
                    target:STATUS.RESOLVED
                },
                {
                    text:'Unable to Connect(3.Retry)',
                    value:'confirm_retry',
                    target:STATUS.RETRY
                }, 
                {
                    text:'Incorrect Informatoin (6.Resolved)',
                    value:'confirm_rejected',
                    target:STATUS.RESOLVED
                },
            ],
        },
        { 
            key:STATUS.RETRY,
            title:'3.Retry',
            cls:'w3-amber',
            db:[STATUS.RETRY.toUpperCase()],
            nextStates:[  {
                text:'URGENT Needs Help (5.Escalate)',
                value:"retry_escalated",
                target:STATUS.ESCALATED
            },
            {
                text:'Need Help(4.Need Help)',
                value:"retry_action",
                target:STATUS.NEED_HELP
            },
            {
                text:'Unable to Connect (3.Retry)',
                value:'retry_retry',
                target:STATUS.RETRY
            },{
                text:' No More Facing issue (6.Resolved)',
                value:'retry_resolved',
                target:STATUS.RESOLVED
            },
            {
                text:'Help Received (6.Resolved)',
                value:'retry_resolved',
                target:STATUS.RESOLVED
            },
            {
                text:'Was Spurios (6.Resolved)',
                value:"retry_rejected",
                target:STATUS.RESOLVED
            }]
        },
        { 
            key:STATUS.NEED_HELP,
            title:'4.Help Needed',
            cls:'w3-orange',
            db:[STATUS.NEED_HELP.toUpperCase()],
            nextStates:[
                {
                    text:'URGENT Need Help(5.Escalate)',
                    value:"action_escalated",
                    target:STATUS.ESCALATED
                },
                {
                    text:'Needs More Help (4.Need Help)',
                    value:"action_more_help",
                    target:STATUS.NEED_HELP
                },{
                    text:'Unable to Connect (3.Retry)',
                    value:'action_retry',
                    target:STATUS.RETRY
                },
                {
                    text:'No Change (3.Need Help)',
                    value:'action_action',
                    target:STATUS.NEED_HELP
                },{
                    text:'No More Facing issue (6.Resolved)',
                    value:'action_help_solved',
                    target:STATUS.RESOLVED
                },
                {
                    text:'Help Received (6.Resolved)',
                    value:'action_help_recieved',
                    target:STATUS.RESOLVED
                },
                

            ],
        },
        { 
            key:STATUS.ESCALATED,
            title:'5.Escalated',
            cls:'w3-red',
            db:[STATUS.ESCALATED.toUpperCase()],
            nextStates:[
                {
                    text:'URGENT Needs Help (5.Escalated)',
                    value:"escalated_escalated",
                    target:STATUS.ESCALATED
                },{
                    text:'No More Facing issue(6.Resolved)',
                    value:'escalated_resolved',
                    target:STATUS.RESOLVED
                },
                {
                    text:'Help Given (6.Resolved)',
                    value:'escalated_help',
                    target:STATUS.RESOLVED
                }
            ],
        },
        { 
            key:STATUS.RESOLVED,
            title:'6.Resolved',
            cls:'w3-green',
            db:[STATUS.RESOLVED.toUpperCase()],
            nextStates:[]
        },
        {
            key:STATUS.EXTERNAL,
            title:'External',
            cls:'w3-blue',
            db:['PRO'],
            nextStates:[]
        }
    ],
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