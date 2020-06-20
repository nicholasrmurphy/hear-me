import SingleCause from '../single-cause.component';
import axios from 'axios';

export default class BlackLives extends SingleCause {

    componentDidMount() {
        axios.get('http://localhost:5000/causes/5ee57500f22e3b2b3e49d1d0')
        .then(response => {
            if (response.data) {
                this.setState({
                    name: response.data.name,
                    mailToSubject: response.data.mailToSubject,
                    mailToBody: response.data.mailToSubject,
                    aboutTheCause: response.data.aboutTheCause,
                    timesSupported: response.data.timesSupported        
                });
            } else {
                console.log("Requested item not found...")
            }
        });
    }

}