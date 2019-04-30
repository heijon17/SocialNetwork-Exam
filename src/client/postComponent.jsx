const React = require('react');


export default class PostComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const post = this.props.post;
        return (
            <div className="postContainer">
                <div className="postTextContainer">
                    <div className="postAuthor">
                        {post.authorId}
                    </div>
                    <div className="postMessageContainer">
                        <div className="postTitle">
                            {post.title}
                        </div>
                        <div className="postText">
                            {post.text}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}
