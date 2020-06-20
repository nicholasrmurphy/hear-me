import React, {Component} from 'react';
import axios from 'axios';
import SingleCause from './single-cause.component'

export default class CausesList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            causeIds: []
        }
    }

    componentDidMount() {
        axios.get("http://localhost:5000/causes")
        .then(response=> {
            console.log(response);
            if (response.data.length > 0) {
                this.setState({
                    causeIds: response.data.map(cause => cause._id)
                });
            }
        });
    }

    causesList() {
        return this.state.causeIds.map(id =>{
            return (
                <li className="list-group-item">
                    <SingleCause causeId={id} />
                </li>);
        });
    }

    render() {
        return (
            <div>
                <h1>Fight for Change</h1>
                <ul className="list-group">
                    {this.causesList()}
                </ul>
            </div>
        );
    }
}