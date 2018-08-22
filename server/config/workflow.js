const STATUS = {
    PHONE_DUPLICATE:'phone_duplicate',
    NEW:'new',
    CONFIRM:'confirm',
    RETRY:'retry',
    NEED_HELP:'need_help',
    ESCALATED:'escalated',
    ASSIGNED:'assigned',
    RESOLVED:'resolved',
    EXTERNAL:'external'
}

module.exports = [
    {  
        key:STATUS.PHONE_DUPLICATE,
        type:STATUS.PHONE_DUPLICATE,
        title:'0.Duplicate',
        name:'Duplicates',
        db:[STATUS.PHONE_DUPLICATE.toUpperCase()],
        cls:'w3-hide',
        nextStates:[
            {
                text:'Mark As duplicate(6.Resolved)',
                value:'duplicate_resolved',
                target:STATUS.RESOLVED
            },
            {
                text:'Mark Duplicate (6.Resolved)',
                value:'cleanup_duplicate',
                target:STATUS.RESOLVED
            },
            {
                text:'Call and Config (3.Confirm)',
                value:'duplcate_call',
                target:STATUS.CONFIRM
            },
            {
                text:'Incorrect Information (6.Resolved)',
                value:'duplcate_invalid_resolved',
                target:STATUS.RESOLVED
            },
        ]
    },
    {
        key:STATUS.NEW,
        title:'1.Check',
        db:[STATUS.NEW.toUpperCase()],
        cls:'w3-blue',
        name:'Check',
        nextStates:[
                {
                    text:'Call and Confirm (2.Confirm)',
                    value:'cleanup_confirm',
                    target:STATUS.CONFIRM
                },
                {
                    text:'Retry (3.Retry)',
                    value:'cleanup_retry',
                    target:STATUS.RETRY
                },
                {
                    text:'Need Help (4.Need Help)',
                    value:'cleanup_need_help',
                    target:STATUS.NEED_HELP
                },
                {
                    text:'Is Safe Now (6.Resolved)',
                    value:'cleanup_safe_now',
                    target:STATUS.RESOLVED
                },
                {
                    text:'Incrorrect Information / Spam (6.Resolved)',
                    value:'cleanup_no_info',
                    target:STATUS.RESOLVED
                },
                {
                    text:'Duplicate Request (6.Resolved)',
                    value:'cleanup_duplicate',
                    target:STATUS.RESOLVED
                }
            ],
    },
    { 
        key:STATUS.CONFIRM,
        title:'2.Call',
        cls:'w3-yellow',
        db:[STATUS.CONFIRM.toUpperCase()],
        name:'Duplicates',
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
                text:'5.Assigned - (Enter Phone number in comment)',
                value:'confirm_assigned',
                target:STATUS.ASSIGNED
            },
            {
                text:'Incorrect Informatoin (6.Resolved)',
                value:'confirm_rejected',
                target:STATUS.RESOLVED
            },
            {
                text:'Duplicate Request (6.Resolved)',
                value:'cleanup_duplicate',
                target:STATUS.RESOLVED
            }
        ],
    },
    { 
        key:STATUS.RETRY,
        title:'3.Retry',
        cls:'w3-amber',
        db:[STATUS.RETRY.toUpperCase()],
        nextStates:[ 
        //      {
        //     text:'URGENT Needs Help (5.Escalate)',
        //     value:"retry_escalated",
        //     target:STATUS.ESCALATED
        // },
        {
            text:'Need Help(4.Need Help)',
            value:"retry_action",
            target:STATUS.NEED_HELP
        },
        {
            text:'Unable to Connect (3.Retry)',
            value:'retry_retry',
            target:STATUS.RETRY
        },
        {
            text:'5.Assigned - (Enter Phone number in comment)',
            value:'retry_assigned',
            target:STATUS.ASSIGNED
        },
        {
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
        },
        {
            text:'Duplicate Request (6.Resolved)',
            value:'cleanup_duplicate',
            target:STATUS.RESOLVED
        }]
    },
    { 
        key:STATUS.NEED_HELP,
        title:'4.Confirmed',
        cls:'w3-orange',
        db:[STATUS.NEED_HELP.toUpperCase()],
        nextStates:[
            // {
            //     text:'URGENT Need Help(5.Escalate)',
            //     value:"action_escalated",
            //     target:STATUS.ESCALATED
            // },
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
                text:'5.Assigned - (Enter Phone number in comment)',
                value:'need_help_assigned',
                target:STATUS.ASSIGNED
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
            }
        ],
    },
    { 
        key:STATUS.ESCALATED,
        title:'5.Escalated',
        cls:'w3-hide',
        db:[STATUS.ESCALATED.toUpperCase()],
        nextStates:[
            // {
            //     text:'URGENT Needs Help (5.Escalated)',
            //     value:"escalated_escalated",
            //     target:STATUS.ESCALATED
            // },
            {
                text:'No More Facing issue(6.Resolved)',
                value:'escalated_resolved',
                target:STATUS.RESOLVED
            },{
                text:'Need Help (4.Need_Help)',
                value:'escalated_need_help',
                target:STATUS.NEED_HELP
            },
            {
                text:'5.Assigned - (Enter Phone number in comment)',
                value:'escalated_assigned',
                target:STATUS.ASSIGNED
            },        
            {
                text:'Help Given (6.Resolved)',
                value:'escalated_help',
                target:STATUS.RESOLVED
            }
        ],
    },
    { 
        key:STATUS.ASSIGNED,
        title:'5.Assigned',
        cls:'w3-light-green',
        db:[STATUS.ASSIGNED.toUpperCase()],
        nextStates:[
            {
                text:'Re Assign to Someone',
                value:'assigned_reassign',
                target:STATUS.HELP_NEEDED
            },
            {
                text:'Help Given (6.Resolved)',
                value:'assigned_resolved',
                target:STATUS.RESOLVED

            },
            {
                text:'Failed to Provide Help (6.Resolved)',
                value:'assigned_couldnot_help',
                target:STATUS.RESOLVED

            }
        ]
    },
    
    { 
        key:STATUS.RESOLVED,
        title:'6.Resolved',
        cls:'w3-green',
        db:[STATUS.RESOLVED.toUpperCase()],
        nextStates:[]
    },
    // {
    //     key:STATUS.EXTERNAL,
    //     title:'External',
    //     cls:'w3-blue',
    //     db:['PRO'],
    //     nextStates:[]
    // }
]