import React, { Component } from 'react';
import {
  mapStateToProps,
  actions,
  propTypes
} from './VideosSelectors';
import VideoPost from 'components/VideoPost/VideoPost';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';

@asyncConnect([{
  promise: ({ store: { dispatch } }) => dispatch(actions.loadRemaining()),
}])
@connect(mapStateToProps, actions)
export default class Videos extends Component {

  static propTypes = propTypes

  render() {
    console.error('this.props', this.props);
    return (
      <div>
        {this.props.videos.map(video =>
          <VideoPost
            post={video}
            containerWidth={this.props.containerWidth}
          />
        )}
      </div>
    )
  }
}
