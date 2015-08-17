import React from 'react';

const IGNORE = {
  getInitialState: true,
  getDefaultProps: true,
  propTypes: true
};

/**
 * Returns a higher-order component based on some mixin's methods.
 *
 * @param {String} displayName for the higher-order component
 * @param {Object} mixin
 * @param {Object} defaultProps Optional
 * @param {Array} autoBind Optional the mixin may need some methods auto-bound
 * @return {Function}
 * @api public
 */
export default function MixinDecorator (
  displayName,
  mixin,
  defaultProps,
  autoBind
) {
  const getDefaultProps = mixin.getDefaultProps;
  const getInitialState = mixin.getInitialState;
  const propTypes       = mixin.propTypes;

  const keys = Object.keys(mixin)
    .filter((key) => {
      return !IGNORE[key];
    });

  if (Array.isArray(defaultProps)) {
    autoBind = defaultProps;
    defaultProps = {};
  }

  const HOC = (Component) => class extends React.Component {
    static displayName  = displayName
    static defaultProps = defaultProps
    static propTypes    = propTypes

    constructor(props) {
      super(props);

      keys.forEach((key) => {
        this[key] = mixin[key];
      });

      if (Array.isArray(autoBind)) {
        autoBind.forEach((method) => {
          this[method] = this[method].bind(this);
        });
      }

      if (getDefaultProps) {
        addDefaultProps(props, getDefaultProps.call(this));
      }

      if (getInitialState) {
        this.state = getInitialState.call(this);
      } else {
        this.state = {};  // just in case
      }
    }

    render() {
      const props = getProps.call(this, mixin);

      return <Component {...props} />;
    }
  }

  HOC.mixin = mixin;
  return HOC;
}

/**
 * Adds `mixin.getDefaultProps()` values to the actual `props` if undefined.
 *
 * @param {Object} props
 * @param {Object} mixinDefaultProps
 * @api private
 */
function addDefaultProps (props, mixinDefaultProps) {
  if (mixinDefaultProps) {
    for (let key in mixinDefaultProps) {
      if (props[key] === undefined) {
        props[key] = mixinDefaultProps[key];
      }
    } 
  }
}

/**
 * Gets the `props` and `state` to be passed to the component (as `props`).
 * Mixin methods are bound to the higher-order component.
 *
 * @param {Object} mixin
 * @return {Object}
 * @api private
 */
function getProps (mixin) {
  const props = {};

  [this.props, this.state].forEach((obj) => {
    if (obj) {
      for (let key in obj) {
        let value = obj[key];

        props[key] = typeof value === 'function' && value === mixin[key]
          ? value.bind(this)
          : value;
      }
    }
  });

  return props;
}
