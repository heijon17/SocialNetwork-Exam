import React from 'react';
import { withRouter } from 'react-router-dom';
import User from './user';

class Seach extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            results: this.props.results || []
        };
    }

    renderArray() {
        return (
            <div>
                {this.state.results.map((user, i) =>
                    <div key={i}>
                        <User user={user} />
                    </div>
                )}
            </div>
        )
    }



    render() {
        let content;

        content = this.renderArray();

        return (
            <div>
                Search
                {content}
            </div>
        )
    }
}

export default withRouter(Seach)