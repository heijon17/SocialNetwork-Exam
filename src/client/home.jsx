const React = require('react');
const Timeline = require('./util/timeline');

import PostComponent from './postComponent';
import Chat from './chat';


export class Home extends React.Component {
    constructor(props) {
        super(props);

    }
    componentWillMount() {
        this.setState({ timeline: Timeline.getTimeline() });
    }

    componentDidMount() {
        this.setState({
            errorMsg: null,
            posts: null,
            renderChat: false,
            user: this.props.user
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.user !== this.props.user && this.props.user !== undefined && this.props.user) {
            const user = this.props.user;
            this.setState({ user: user }, () => {
                this.getUserPosts();
            })
        }
    }

    componentWillUnmount() {
        Timeline.setTimeline(this.state.timeline);
    }

    getUserPosts() {
        const urls = [];
        this.state.user.friends.map(friend => {
            urls.push("/api/post?authorId=" + friend)
        })
        Promise.all(urls.map(url =>
            fetch(url)
                .then(responses =>
                    responses.json())
        )).then(data => {
            let timeline = [];
            data.map(posts =>
                posts.map(post =>
                    timeline.push(post)
                )
            )
            this.setState({ timeline: timeline });
        });
    }

    toggleChat = () => {
        this.setState(prev => ({
            renderChat: !prev.renderChat
        }));
    }


    renderArray() {
        let reverseTimeline = this.state.timeline.reverse();
        return (
            <div>
                {reverseTimeline.map((post, i) =>
                    <div key={i}>
                        <PostComponent post={post} />
                    </div>
                )}
            </div>
        )
    }

    render() {
        let content;
        if (!this.props.user) {
            return (<h2>Please log in to see your home page</h2>)
        }
        if (this.state.timeline.length === 0) {
            return (<h2>Loading timeline...</h2>)
        }
        content = this.renderArray();
        const userId = this.props.user.userId;
        return (
            <div>
                <div>
                    <div>
                        {content}
                    </div>
                </div>
                
                {this.state.errorMsg}
            </div>
        )
    }
}

