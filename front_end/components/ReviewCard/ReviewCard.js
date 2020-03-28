import React from 'react';
import { Card } from 'semantic-ui-react';


class ReviewCard extends React.Component {
    // eslint-disable-next-line class-methods-use-this
    render() {
        if (this.props.tags && this.props.tags !== null) {
            let index = 0;
            return this.props.tags.map((element) => {
                index += 1;
                return <div style={{ width: '40%', margin: 10 }} key={index}>
                    <Card
                        link
                        header={element.trim()}
                        style={ { textAlign: 'center' } }
                    />
                </div>;
            });
        }
        return <></>;
    }
}

export default ReviewCard;
