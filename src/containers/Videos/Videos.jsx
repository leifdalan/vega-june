import React, { Component } from 'react';
import {
  mapStateToProps,
  actions,
  propTypes
} from './VideosSelectors';
import VideoPost from 'components/VideoPost/VideoPost';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import { CENTER_STYLE } from '../Home/Home.styles';
import {
  DATE_STYLE,
  POST_CONTAINER,
 } from '../../components/Post/Post.styles';
import fecha from 'fecha'

@asyncConnect([{
  promise: ({ store: { dispatch } }) => dispatch(actions.loadRemaining()),
}])
@connect(mapStateToProps, actions)
export default class Videos extends Component {

  static propTypes = propTypes

  render() {
    return (
      <div>
        <h1 style={CENTER_STYLE}>Videos</h1>
        {this.props.videos.map(video =>
          <div style={POST_CONTAINER}>
            <VideoPost
              key={video.id}
              post={video}
              containerWidth={this.props.containerWidth}
            />
            <figcaption>
              <div style={DATE_STYLE}>
                <div>
                  {fecha.format(new Date(video.date), 'MMM DD')}
                </div>
              </div>

            </figcaption>
          </div>
        )}
      </div>
    )
  }
}
