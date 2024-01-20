import { FC } from 'react';
// import { RouteProps } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { RouteProps } from 'react-router-dom';

export type WrapperRouteProps = {
  /** document title locale id */
  titleId?: string;
  /** authorization？ */
  auth?: boolean;
} & RouteProps;

const WrapperRouteElement: FC<WrapperRouteProps> = ({ titleId, auth, ...props }) => {
  const WithRoute = auth ? <PrivateRoute {...props} /> : props.element;
  if (titleId) {
    requestIdleCallback(() => {
      document.title = titleId;
    });
  }
  return WithRoute || null;
};
export default WrapperRouteElement;
