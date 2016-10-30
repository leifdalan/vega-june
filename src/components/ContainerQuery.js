import React, { Component, PropTypes } from 'react';
import throttle from 'lodash/throttle';
const {
  func
} = PropTypes;

export default class ContainerQuery extends Component {

  state = {
    containerWidth: 0,
  }

  static propTypes = {
    children: func
  }

  componentDidMount() {
    window.addEventListener('resize', this.throttledCalculateContainerWidth);
    this.calculateContainerWidth();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.throttledCalculateContainerWidth);
  }

  calculateContainerWidth = () => this.setState({
    containerWidth: this.container.getBoundingClientRect().width,
  })

  throttledCalculateContainerWidth = () => throttle(this.calculateContainerWidth, 500)()

  containerRef = el => this.container = el // eslint-disable-line no-return-assign

  render() {
    return (
      <div ref={this.containerRef}>
        {this.props.children({ containerWidth: this.state.containerWidth })}
      </div>
    );
  }
}
