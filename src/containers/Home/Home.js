import React, { Component, PropTypes as pt } from 'react';
import { userSelector } from 'redux/modules/auth';
import Infinite from 'react-infinite';
import {
  getNextPageSelector,
  getPostsByDateSelector,
  getImageRatiosSelector,
  getPagesSelector,
  getDataSelector,
  load as loadInfo,
} from 'redux/modules/info';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Helmet from 'react-helmet';
import moment from 'moment';
import { createSelector } from 'reselect';
import { Login } from 'containers';

const mapStateToProps = createSelector(
  getPostsByDateSelector,
  getNextPageSelector,
  getImageRatiosSelector,
  getDataSelector,
  getPagesSelector,
  userSelector, (
    posts,
    nextPage,
    imageRatios,
    data,
    pages,
    user,
  ) => ({
    posts,
    nextPage,
    imageRatios,
    data,
    pages,
    user,
  })
);

@asyncConnect([{
  promise: ({ store: { dispatch } }) => dispatch(loadInfo())
}])
@connect(mapStateToProps, { loadInfo })
export default class Home extends Component {
  static propTypes = {
    posts: pt.array.isRequired,
    data: pt.object.isRequired,
    pages: pt.object.isRequired,
    imageRatios: pt.array.isRequired,
    nextPage: pt.number.isRequired,
    loadInfo: pt.func.isRequired,
    user: pt.object,
  }

  handleInfiniteLoad = () => {
    this.props.loadInfo(this.props.nextPage);
  }

  loadingSpinner = () => <div>Loading...</div>

  render() {
    const {
      props: {
        pages,
        posts,
        nextPage,
        imageRatios,
        user,
      },
    } = this;

    const isLoading = pages[nextPage] && pages[nextPage].loading;

    return (
      <div className="container">
        {user ?
          <div style={{ width: '300px' }}>
            <Helmet title="Home" />
            {typeof window !== 'undefined' &&
              <Infinite
                useWindowAsScrollContainer
                elementHeight={imageRatios.map(imgRatio => 300 * imgRatio)}
                onInfiniteLoad={this.handleInfiniteLoad}
                infiniteLoadBeginEdgeOffset={300}
                isInfiniteLoading={isLoading}
                loadingSpinnerDelegate={this.loadingSpinner()}
                >
                {posts.map((item, index) =>
                  <div
                    style={{
                      background: 'red',
                      position: 'relative',
                      paddingBottom: `${imageRatios[index] * 100}%`
                    }}>
                    <img
                      alt={'something'}
                      style={{
                        position: 'absolute',
                        height: '100%'
                      }}
                      src={item.photos[0].original_size.url}
                    />
                    {`${moment(item.date).month()} ${moment(item.date).date()}`}
                  </div>
                )}
              </Infinite>
            }
          </div>
          :
          <Login />
        }
      </div>
    );
  }
}
