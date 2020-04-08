import React from "react";
import { WindMillLoading } from "react-loadingg";

class LoadingComponent extends React.Component {
  static propTypes = {};
  static defaultProps = {};

  render() {
    return <WindMillLoading size="large" speed={1} />;
  }
}

export default LoadingComponent;
