import React, { Component, CSSProperties } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Tooltip from '../tooltip';
import { ItemProps, MenuMode } from './PropsType';
import MenuContext from './menu-context';
import { noop } from '../utils';

export class MenuItem extends Component<ItemProps, any> {
  static defaultProps = {
    prefixCls: 'zw-menu',
    level: 1,
    style: {},
    mode: MenuMode.inline,
    inlineIndent: 24,
    onClick: noop,
    onDoubleClick: noop,
  };

  static propTypes = {
    prefixCls: PropTypes.string,
    level: PropTypes.number,
    style: PropTypes.objectOf(PropTypes.oneOf([PropTypes.number, PropTypes.string])),
    mode: PropTypes.oneOf(['inline', 'vertical']),
    inlineIndent: PropTypes.number,
    onClick: PropTypes.func,
    onDoubleClick: PropTypes.func,
  };

  handleClick = (e: React.MouseEvent) => {
    const { itemKey, inlineCollapsed, disabled, mode } = this.props;

    if (disabled) return;
    this.props.onClick!(e, itemKey!);
    this.props.toggleSelectedKeys!(itemKey!);
    if (inlineCollapsed || mode === MenuMode.vertical) {
      this.props.toggleSubMenuOpen!('');
    }
  };

  render() {
    const {
      children, prefixCls, level, inlineIndent, title, mode,
      className, style, onDoubleClick, selectedKeys, itemKey, inlineCollapsed,
    } = this.props;

    const cls = classnames(`${prefixCls}-item`, className, {
      [`${prefixCls}-item--level-${level}`]: level,
      [`${prefixCls}-item--active`]: !!itemKey && selectedKeys.indexOf(itemKey) > -1,
      [`${prefixCls}-item--disabled`]: 'disabled' in this.props,
    });
    const itemStyle: CSSProperties = {
      ...style,
    };
    if (mode === MenuMode.inline && !inlineCollapsed) {
      itemStyle.paddingLeft = level! * inlineIndent!;
    }
    if (mode === MenuMode.vertical || (inlineCollapsed && level !== 1)) {
      itemStyle.paddingLeft = inlineIndent;
    }

    if (!inlineCollapsed) {
      return (
        <li
          className={cls}
          role="menuitem"
          style={itemStyle}
          onClick={this.handleClick}
          onDoubleClick={onDoubleClick}
        >
          {children}
        </li>
      );
    }
    return (
      <li
        className={cls}
        role="menuitem"
        style={itemStyle}
        onClick={this.handleClick}
        onDoubleClick={onDoubleClick}
      >
        <Tooltip
          hasArrow
          content={title}
          direction="right"
        >
          <div>
            {children}
          </div>
        </Tooltip>
      </li>
    );
  }
}

export default function MenuItemConsumer(props: ItemProps) {
  return (
    <MenuContext.Consumer>
      {
        ({
          mode, inlineCollapsed, inlineIndent,
          selectedKeys, toggleOpenKeys, toggleSelectedKeys,
        }) => (
          <MenuItem
            {...props}
            mode={mode}
            inlineIndent={inlineIndent}
            inlineCollapsed={inlineCollapsed}
            selectedKeys={selectedKeys}
            toggleSubMenuOpen={toggleOpenKeys}
            toggleSelectedKeys={toggleSelectedKeys}
          />
        )
      }
    </MenuContext.Consumer>
  );
}
