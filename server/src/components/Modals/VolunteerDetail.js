import  React,{ Component } from 'react';
import moment from 'moment';

class VolunteerDetail extends Component {

    componentDidMount() {
        const {item} = this.props;
        if (item.latitude && item.longitude){
            this.initialiseGMap(parseFloat(""+item.latitude),parseFloat(""+item.longitude));
        }
    }

    initialiseGMap (latitude,longitude) {
        if (!this.map){
            this.map = new google.maps.Map(document.getElementById('google-map-detail'), {
                center: {lat: latitude, lng: longitude},
                zoom: 14,
                zoomControl: true,
                scaleControl:true,
                styles: [{
                    featureType: 'poi',
                    stylers: [{ visibility: 'off' }]  // Turn off points of interest.
                }, {
                    featureType: 'transit.station',
                    stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
                }],
            });
        } 
        this.marker = new google.maps.Marker({
            position: {lat: latitude, lng: longitude},
            map: this.map
        });
        this.map.setCenter({lat:latitude,lng:longitude});
        this.marker.setVisible(true);
    }

    render() {
        const {item} = this.props;

        let leftCont = (
            <div className="w3-col l6 s12">
                <div className="w3-padding-small"><strong className="w3-text-gray">Contact Name:</strong> {item.name}</div>
                <div className="w3-padding-small"><strong className="w3-text-gray">Phone Number:</strong> <span>
                    <a className="w3-buttom w3-tag w3-redice w3-round w3-blue" href={`tel:${item.phoneNumber}`}>{item.phoneNumber}</a>
                    </span>
                </div>
                <div className="w3-padding-small">
                	<strong className="w3-text-gray">Type of help:</strong> <span className="w3-tag w3-round w3-amber" style={{textTransform: 'capitalize'}}>
                		{item.type.replace(/_/g, ' ')}
                	</span>
                </div>
                
                <div className="w3-padding-small"><strong className="w3-text-gray">Demand serviceable:</strong> {(item.peopleCount)?item.peopleCount + ' people': ''}</div>
                <div className="w3-padding-small"><strong className="w3-text-gray">More Information:</strong> 
                    {(item.info)?
                        <div className="w3-border w3-padding-small w3-padding-16 w3-light-gray w3-round">{item.info}</div>
                        : null
                    }
                </div>
                <div className="w3-padding-small"><strong className="w3-text-gray">Created:</strong> {moment(item.createdAt).fromNow()}</div>
            </div>
        );

       return (
            <div className="w3-container w3-padding">   
                <h4 className="w3-center w3-margin-bottom" style={{marginTop: '0px'}}>Volunteer Detail</h4>
                <div className="w3-row w3-margin-bottom" style={{paddingBottom: '20px'}}>
                    {leftCont}
                    <div className="w3-col l6">
                        <div id="google-map-detail" style={{minHeight:"250px"}}></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default VolunteerDetail;