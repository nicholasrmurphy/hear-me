import React, {Component} from 'react';
import Modal from "react-bootstrap/Modal";
import axios from 'axios';
const API_KEY = "AIzaSyAd9ET0aNrBcM1WbHmWOr7ZhQ0sYOPUtwk"; //TODO: update so that key is fecthed from mongodb
const BASE_CIVIC_URL = "https://www.googleapis.com/civicinfo/v2/representatives?includeOffices=true&levels=administrativeArea1&roles=legislatorLowerBody&roles=legislatorUpperBody";
const submitButtonClass = 'btn btn-success btn-lg btn-block';
const invisibleClass = "invisible";

export default class SingleCause extends Component {

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onChangeStreet = this.onChangeStreet.bind(this);
        this.onChangeCity = this.onChangeCity.bind(this);
        this.onChangeState = this.onChangeState.bind(this);
        this.findRepresentatives = this.findRepresentatives.bind(this);
        this.state = {
            name: '',
            mailToSubject: '',
            mailToBody: '',
            aboutTheCause: '',
            timesSupported: 0,
            isModalOpen: false,
            street: '',
            city: '',
            state: 'AL', //set to match first option in form
            mailToLink: '',
            submitClass: invisibleClass
        }
    }

    //#region OnChanged
    onChangeStreet(e) {
        this.setState({
            street: e.target.value
        });
    }

    onChangeCity(e) {
        this.setState({
            city: e.target.value
        });
    }

    onChangeState(e) {
        this.setState({
            state: e.target.value
        });
    }
    //#endregion

    toggleSubmit(fEnable) {
        if (fEnable) {
            this.setState({
                submitClass: submitButtonClass,
            });
        } else {
            this.setState({
                submitClass: invisibleClass,
            });
        }
    }

    findRepresentatives() {
        //TODO: replace Http with axios
        console.log("finding reps");
        const Http = new XMLHttpRequest();
        var address = this.state.street + " " + this.state.city + " " + this.state.state;
        var requestURL = BASE_CIVIC_URL + "&address=" + encodeURIComponent(address) + "&key=" + API_KEY;
        var repEmails = [];
        Http.open("GET", requestURL);
        Http.send();
        Http.onreadystatechange = (e) => {
            if (Http.readyState === XMLHttpRequest.DONE && Http.status === 200) {
                var officials = JSON.parse(Http.responseText).officials;
                if (officials) {

                    officials.forEach(function(official) {
                        repEmails.push(official.emails[0]); //there COULD be more than 1 email (or none), update for this in the future
                    });

                    if (repEmails) {
                        var mailTo = "mailto:"
                        for(var i = 0; i < repEmails.length; i++) {
                            mailTo = mailTo + repEmails[i];
                            if (i < repEmails.length) {
                                mailTo = mailTo + ";";
                            }
                        }
                        mailTo = mailTo + "?subject=" + encodeURIComponent(this.state.mailToSubject);
                        mailTo = mailTo + "&body=" + encodeURIComponent(this.state.mailToBody);
                        this.setState({
                            mailToLink: mailTo
                        });
                        this.toggleSubmit(true);
                    }

                } else {
                    //TODO: display a BETTER error using bootstrap/toast
                    this.toggleSubmit(false);
                    alert("No representatives found at that address.")
                }
            } else if (Http.status === 400) {
                //TODO: Display a better error
                this.toggleSubmit(false);
                alert("Could not get representatives for the address.")
            }
        }
    }

    componentDidMount() {
        axios.get(('http://localhost:5000/causes/' + this.props.causeId))
        .then(response => {
            if (response.data) {
                this.setState({
                    name: response.data.name,
                    mailToSubject: response.data.mailToSubject,
                    mailToBody: response.data.mailToBody,
                    aboutTheCause: response.data.aboutTheCause,
                    timesSupported: response.data.timesSupported        
                });
            } else {
                this.setState({
                    name: "This cause was not found",
                });
                console.log("Requested item not found...");
            }
        });
    }

    onSubmit(e) {
        e.preventDefault();
        
    }

    //#region Modal Management
    openModal() {
        this.setState({
            isModalOpen: true
        });
    }

    closeModal() {
        this.setState({
            isModalOpen: false
        });
    }
    //#endregion

    //#region Render
    render() {
        return (
            <div>
                <h3>{this.state.name}</h3>
                <p>{this.state.aboutTheCause}</p>
                <div>
                    <button className="btn btn-primary" onClick = {this.openModal}>Support This Cause</button>
                    <Modal show={this.state.isModalOpen}>
                        <Modal.Header>Tell Your Representatives You Support {this.state.name}</Modal.Header>
                        <Modal.Body>
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <label htmlFor="street_id" className="control-label">Street Address</label>
                                    <input 
                                        type="text" 
                                        value={this.state.street} 
                                        className="form-control" 
                                        id="street_id" 
                                        name="street" 
                                        onChange={this.onChangeStreet}
                                        placeholder="123 Main Street"/>
                                </div>					
                            
                                <div className="form-group"> 
                                    <label htmlFor="city_id" className="control-label">City</label>
                                    <input 
                                        type="text" 
                                        value={this.state.city} 
                                        className="form-control" 
                                        id="city_id" 
                                        name="city" 
                                        onChange={this.onChangeCity}
                                        placeholder="Smallville"/>
                                </div>									
                                <div className="form-group">
                                    <label htmlFor="state_id" className="control-label">State</label>
                                    <select 
                                    value={this.state.state} 
                                    className="form-control"
                                    onChange={this.onChangeState}
                                    id="state_id">
                                        <option value="AL">Alabama</option>
                                        <option value="AK">Alaska</option>
                                        <option value="AZ">Arizona</option>
                                        <option value="AR">Arkansas</option>
                                        <option value="CA">California</option>
                                        <option value="CO">Colorado</option>
                                        <option value="CT">Connecticut</option>
                                        <option value="DE">Delaware</option>
                                        <option value="DC">District Of Columbia</option>
                                        <option value="FL">Florida</option>
                                        <option value="GA">Georgia</option>
                                        <option value="HI">Hawaii</option>
                                        <option value="ID">Idaho</option>
                                        <option value="IL">Illinois</option>
                                        <option value="IN">Indiana</option>
                                        <option value="IA">Iowa</option>
                                        <option value="KS">Kansas</option>
                                        <option value="KY">Kentucky</option>
                                        <option value="LA">Louisiana</option>
                                        <option value="ME">Maine</option>
                                        <option value="MD">Maryland</option>
                                        <option value="MA">Massachusetts</option>
                                        <option value="MI">Michigan</option>
                                        <option value="MN">Minnesota</option>
                                        <option value="MS">Mississippi</option>
                                        <option value="MO">Missouri</option>
                                        <option value="MT">Montana</option>
                                        <option value="NE">Nebraska</option>
                                        <option value="NV">Nevada</option>
                                        <option value="NH">New Hampshire</option>
                                        <option value="NJ">New Jersey</option>
                                        <option value="NM">New Mexico</option>
                                        <option value="NY">New York</option>
                                        <option value="NC">North Carolina</option>
                                        <option value="ND">North Dakota</option>
                                        <option value="OH">Ohio</option>
                                        <option value="OK">Oklahoma</option>
                                        <option value="OR">Oregon</option>
                                        <option value="PA">Pennsylvania</option>
                                        <option value="RI">Rhode Island</option>
                                        <option value="SC">South Carolina</option>
                                        <option value="SD">South Dakota</option>
                                        <option value="TN">Tennessee</option>
                                        <option value="TX">Texas</option>
                                        <option value="UT">Utah</option>
                                        <option value="VT">Vermont</option>
                                        <option value="VA">Virginia</option>
                                        <option value="WA">Washington</option>
                                        <option value="WV">West Virginia</option>
                                        <option value="WI">Wisconsin</option>
                                        <option value="WY">Wyoming</option>
                                    </select>					
                                </div>    
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <a href={this.state.mailToLink} className={this.state.submitClass} role="button">Be Heard</a>
                            <button type="button" className="btn btn-primary btn-lg btn-block" onClick={this.findRepresentatives}>
                                Find My Representatives
                            </button>
                            <button className="btn btn-secondary btn-sm btn-block" onClick={this.closeModal}>Cancel</button>
                        </Modal.Footer>
                    </Modal>
                </div>
          </div>
        );
    }
}

//#endregion