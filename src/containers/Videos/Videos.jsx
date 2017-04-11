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
import ContainerQuery from 'components/ContainerQuery';

@asyncConnect([{
  promise: ({ store: { dispatch } }) => dispatch(actions.loadRemaining()),
}])
@connect(mapStateToProps, actions)
export default class Videos extends Component {

  static propTypes = propTypes

  render() {
    return (
      <div
        className="center"
        style={{
          padding: 15,
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >

        <ContainerQuery>
          {({ containerWidth }) => (
            <div>
              <h1 style={CENTER_STYLE}>Videos</h1>
              {this.props.videos.map(video =>
                <VideoPost
                  key={video.id}
                  post={video}
                  containerWidth={containerWidth}
                />
              )}

            </div>
          )}
        </ContainerQuery>
      </div>
    );
  }
}
