const STATUS = {
    PHONE_DUPLICATE:'phone_duplicate',
    NEW:'new',
    CONTACT:'confirm',
    NEED_HELP:'need_help', // NEED_CONFIRMED
    ASSIGNED:'assigned',
    RESOLVED:'resolved',

    RETRY:'retry',
    ESCALATED:'escalated',
    EXTERNAL:'external'
}


module.exports = [
    {  
        key:STATUS.PHONE_DUPLICATE,
        type:STATUS.PHONE_DUPLICATE,
        title:'0.Duplicate',
        name:'Duplicates',
        color:'grey',
        db:[STATUS.PHONE_DUPLICATE.toUpperCase()],
        cls:'w3-hide',
        nextStates:[
            {
                text:'Mark As duplicate(6.Resolved)',
                value:'duplicate_resolved',
                target:STATUS.RESOLVED
            }, 
            {
                text:'Contact and Confirm (3.Confirm)',
                value:'duplcate_call',
                target:STATUS.CONTACT
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
        color:'blue',
        name:'Check',
        nextStates:[
                {
                    text:'Contact and Confirm (2.Confirm)',
                    value:'cleanup_contact',
                    target:STATUS.CONTACT
                },
                {
                    text:'Retry to Contact (2.Contact)',
                    value:'cleanup_retry',
                    target:STATUS.CONTACT
                },
                {
                    text:'Need Confirmed (4.Confirmed)',
                    value:'cleanup_need_help',
                    target:STATUS.NEED_HELP
                },
                {
                    text:'Help Already Received (6.Resolved)',
                    value:'cleanup_help_received',
                    target:STATUS.RESOLVED
                },
                {
                    text:'Help Not Needed (6.Resolved)',
                    value:'cleanup_help_not_needed',
                    target:STATUS.RESOLVED
                },
                {
                    text:'Incrorrect Information / Spam /Duplicate (6.Resolved)',
                    value:'cleanup_no_info',
                    target:STATUS.RESOLVED
                }
            ],
    },
    { 
        key:STATUS.CONTACT,
        title:'2.Contact',
        cls:'w3-yellow',
        color:'yellow',
        db:[STATUS.CONTACT.toUpperCase()],
        nextStates:[ 
            {
                text:'Need Confirmed (3.Confirmed)',
                value:"contact_need_confirmed",
                target:STATUS.NEED_HELP
            },
            {
                text:'Help Not Needed Now (6.Resolved)',
                value:'contact_help_not_needed',
                target:STATUS.RESOLVED
            },
            {
                text:'Unable to Connect / Retry (3.Contact)',
                value:'contact_retry', //confirm_retry
                target:STATUS.CONTACT
            }, 
            {
                text:'Assigned - (Enter Phone number in comment)',
                value:'contact_assigned',
                target:STATUS.ASSIGNED
            },
            {
                text:'Incorrect Informatoin (6.Resolved)',
                value:'contact_rejected',
                target:STATUS.RESOLVED
            },
            {
                text:'Duplicate Request (6.Resolved)',
                value:'contact_duplicate',
                target:STATUS.RESOLVED
            }
        ],
    },
    { 
        key:STATUS.RETRY,
        title:'3.Retry',
        cls:'w3-hide',
        color:'orange',
        db:[STATUS.RETRY.toUpperCase()],
        nextStates:[  
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
            text:'Duplicate Request / Spam / Incorrect (6.Resolved)',
            value:'cleanup_duplicate_spam',
            target:STATUS.RESOLVED
        }]
    },
    { 
        key:STATUS.NEED_HELP,
        title:'3.Confirmed',
        cls:'w3-orange',
        color:'orange',
        db:[STATUS.NEED_HELP.toUpperCase()],
        nextStates:[ 
            {
                text:'Needs More Help (4.Need Help)',
                value:"need_help_more",
                target:STATUS.NEED_HELP
            },
            {
                text:'5.Assigned - (Enter Phone number in comment)',
                value:'need_help_assigned',
                target:STATUS.ASSIGNED
            },
            {
                text:'No Change (3.Need Help)',
                value:'need_help_no_change',
                target:STATUS.NEED_HELP
            },{
                text:'No More Needs Help / (6.Resolved)',
                value:'need_help_not_anymore',
                target:STATUS.RESOLVED
            },
            {
                text:'Help Received (6.Resolved)',
                value:'need_help_recieved',
                target:STATUS.RESOLVED
            }
        ],
    },
    { 
        key:STATUS.ESCALATED,
        title:'x.Escalated',
        cls:'w3-hide',
        color:'dee-orange',
        db:[STATUS.ESCALATED.toUpperCase()],
        nextStates:[ 
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
                value:'escalated_helped',
                target:STATUS.RESOLVED
            }
        ],
    },
    { 
        key:STATUS.ASSIGNED,
        title:'4.Assigned',
        cls:'w3-light-green',
        color:'light-green',
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
        title:'5.Resolved',
        cls:'w3-green',
        color:'green',
        db:[STATUS.RESOLVED.toUpperCase()],
        nextStates:[]
    },
    {
        key:STATUS.EXTERNAL,
        title:'External',
        cls:'w3-hide',
        color:'w3-grey',
        db:['PRO'],
        nextStates:[]
    }
]