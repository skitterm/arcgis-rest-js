/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  getPortalUrl
} from "@esri/arcgis-rest-request";

import { IUser } from "@esri/arcgis-rest-common-types";
import { UserSession, IUserRequestOptions } from "@esri/arcgis-rest-auth";

export interface IGetUserRequestOptions extends IRequestOptions {
  /**
   * A session representing a logged in user.
   */
  authentication?: UserSession;
  /**
   * Supply a username if you'd like to fetch information about a different user than is being used to authenticate the request.
   */
  username?: string;
}

/**
 * Get information about a user. This method has proven so generically useful that you can also call [`UserSession.getUser()`](../../auth/UserSession#getUser-summary).
 *
 * ```js
 * import { getUser } from '@esri/arcgis-rest-users';
 *
 * getUser("jsmith")
 *   .then(
 *     results => {
 *      // {
 *      //   firstName: "John",
 *      //   lastName: "Smith",
 *      //   tags: ["GIS Analyst", "City of Redlands"],
 *      //   created: 1258501046000
 *      //   etc.
 *      // };
 *   })
 * ```
 *
 * @param requestOptions - options to pass through in the request
 * @returns A Promise that will resolve with metadata about the user
 */
export function getUser(
  requestOptions?: string | IGetUserRequestOptions
): Promise<IUser> {
  let url;
  let options = { httpMethod: "GET" } as IGetUserRequestOptions;

  // if a username is passed, assume ArcGIS Online
  if (typeof requestOptions === "string") {
    url = `https://www.arcgis.com/sharing/rest/community/users/${requestOptions}`;
  } else {
    // if an authenticated session is passed, default to that user/portal unless another username is provided manually
    const username =
      requestOptions.username || requestOptions.authentication.username;
    url = `${getPortalUrl(requestOptions)}/community/users/${encodeURIComponent(
      username
    )}`;
    options = {
      ...requestOptions,
      ...options
    };
  }

  // send the request
  return request(url, options);
}

export interface INotification {
  id: string;
  type: string;
  target: string;
  targetType: string;
  received: number;
  data: { [key: string]: any };
}

export interface INotificationIdRequestOptions extends IUserRequestOptions {
  /**
   * Unique identifier of the item.
   */
  id: string;
}
export interface INotificationResult {
  notifications: INotification[];
}

/**
 * Get notifications for a user.
 *
 * @param requestOptions - options to pass through in the request
 * @returns A Promise that will resolve with the user's notifications
 */
export function getUserNotifications(
  requestOptions: IUserRequestOptions
): Promise<INotificationResult> {
  let options = { httpMethod: "GET" } as IUserRequestOptions;

  const username = encodeURIComponent(requestOptions.authentication.username);
  const portalUrl = getPortalUrl(requestOptions);
  const url = `${portalUrl}/community/users/${username}/notifications`;
  options = { ...requestOptions, ...options };

  // send the request
  return request(url, options);
}

/**
 * Delete a notification.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function removeNotification(
  requestOptions: INotificationIdRequestOptions
): Promise<any> {
  const username = encodeURIComponent(requestOptions.authentication.username);
  const portalUrl = getPortalUrl(requestOptions);
  const url = `${portalUrl}/community/users/${username}/notifications/${
    requestOptions.id
  }/delete`;

  return request(url, requestOptions);
}
