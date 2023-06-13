import { ClientApi } from "./client-api";
import atlasConfig from "./atlasConfig.json";

/**
 * Connect to the MongoDB Atlas App Services Data API for your App.
 */
export class DataApi {
  /**
   * Create a new Data API client.
   * @param {object} config - The configuration for the Data API client.
   * @param {string} config.appId - The Client App ID of the App Services App to connect to, e.g. `myapp-abcde`.
   * @param {function} [config.onAuthChange] - A callback that's run with the latest auth state whenever the current user changes.
   * @example
   * const dataApi = new DataApi({
   *   appId: "myapp-abcde",
   *   onAuthChange: (currentUser) => {
   *     console.log("The current user is now:", currentUser.id);
   *   }
   * });
   */
  constructor({ appId, onAuthChange }) {
    this.appId = appId;
    this.baseUrl = atlasConfig.dataApiBaseUrl;
    this.client = new ClientApi({
      appId,
      onAuthChange: (newCurrentUser) => {
        this.currentUser = newCurrentUser;
        onAuthChange?.(this.currentUser);
      },
    });
    this.currentUser = this.client.currentUser;
  }

  /**
   * Register a new user with the specified authentication provider.
   * @param {string} provider - The name of the authentication provider to use.
   * @param {object} credentials - Information used to authenticate with the specified provider.
   * @returns {Promise<void>}
   */
  registerUser = async (provider, credentials) => {
    await this.client.registerUser(provider, credentials);
  };

  /**
   * Log a user in with the specified authentication provider.
   * @param {string} provider - The name of the authentication provider to use.
   * @param {object} credentials - Information used to authenticate with the specified provider.
   * @returns {Promise<void>}
   * @example
   * await dataApi.logIn("local-userpass", {
   *   email: "someone@example.com",
   *   password: "mypassw0rd!",
   * });
   * @example
   * await dataApi.logIn("api-key", {
   *   key: "BB4Y996banzQDlEuldiBfdVi1cDsxT1uoGUFJObDEsUiFdSlIVISXzIMzpZZpJsw"
   * });
   */
  logIn = async (provider, credentials) => {
    await this.client.logIn(provider, credentials);
  };

  /**
   * Log the current user out.
   * @returns {Promise<void>}
   * @example
   * await dataApi.logOut();
   */
  logOut = async () => {
    await this.client.logOut();
  };

  /**
   * An email/password authentication wrapper around the generic auth
   * methods.
   */
  emailPasswordAuth = {
    /**
     * Register a new user with the email/password authentication provider.
     * @param {object} - credentials The email and password to register with.
     * @param {string} - credentials.email The email address to register with.
     * @param {string} - credentials.password The password to register with.
     * @returns {Promise<void>}
     * @example
     * await dataApi.emailPasswordAuth.registerUser({
     *  email: "someone@example.com",
     *  password: "mypassw0rd!",
     * });
     */
    registerUser: async ({ email, password }) => {
      return await this.registerUser("local-userpass", { email, password });
    },

    /**
     * Log a user in with the email/password authentication provider.
     * @param {object} - credentials The email and password to log in with.
     * @param {string} - credentials.email The email address to log in with.
     * @param {string} - credentials.password The password to log in with.
     * @returns {Promise<void>}
     * @example
     * await dataApi.emailPasswordAuth.logIn({
     *  email: "someone@example.com",
     *  password: "mypassw0rd!",
     * });
     */
    logIn: async ({ email, password }) => {
      return await this.logIn("local-userpass", { email, password });
    },
  };

  /**
   * Call a specified HTTPS endpoint.
   * @param {string} route - The name of the HTTPS endpoint route, e.g. "insertOne"
   * @param {object} input - The request body for the action.
   * @returns {object} - The response body for the action.
   */
  async action(route, input) {
    if (!this.currentUser) {
      throw new Error(`Must be logged in to call a HTTPS endpoint`);
    }
    // If the current user access token is expired, try to refresh the
    // session and get a new access token.
    await this.client.refreshExpiredAccessToken();
    const url = new URL(
      `/app/${this.appId}/endpoint/${route}`,
      this.baseUrl
    ).href;
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/ejson",
        Accept: "application/ejson",
        Authorization: `Bearer ${this.currentUser.access_token}`,
      },
      body: JSON.stringify(input),
    });
    const response = await resp.json();

    if (resp.status === 200 || resp.status === 201) {
      if (route == "getRecipes") {
        const new_response = {documents: response};
        return new_response;
      }
      return response;
    } else {
      throw new Error(response);
    }
  }

  /**
   * @typedef {Object} FindInput
   * @property {string} dataSource - The name of the data source to use.
   * @property {string} database - The name of the database to use.
   * @property {string} collection - The name of the collection to use.
   * @property {object} [filter] - A MongoDB query filter to match documents.
   * @property {object} [projection] - A MongoDB projection to control which fields are returned.
   * @property {object} [sort] - A MongoDB sort specification to control the order of the results.
   * @property {number} [skip] - The number of documents to skip before returning results.
   * @property {number} [limit] - The maximum number of documents to return.
   *
   * @typedef {Object} FindResult
   * @property {object[]} documents - The documents that matched the filter.
   */

  /**
   * Returns all documents in a collection.
   * @param {FindInput} input - The request body for the action.
   * @returns {Promise<FindResult>} - The response body for the action.
   */
   getRecipes = async (input) => {
    return this.action("getRecipes", input);
  };

  /**
   * @typedef {Object} InsertOneInput
   * @property {string} dataSource - The name of the data source to use.
   * @property {string} database - The name of the database to use.
   * @property {string} collection - The name of the collection to use.
   * @property {object} document - The document to insert.
   *
   * @typedef {Object} InsertOneResult
   * @property {string} insertedId - The _id of the inserted document.
   */

  /**
   * Insert a single recipe into the collection.
   * @param {InsertOneInput} input - The request body for the action.
   * @returns {Promise<InsertOneResult>} - The response body for the action.
   */
   addRecipe = async (input) => {
    return this.action("addRecipe", input);
  };

  /**
   * @typedef {Object} DeleteInput
   * @property {string} dataSource - The name of the data source to use.
   * @property {string} database - The name of the database to use.
   * @property {string} collection - The name of the collection to use.
   * @property {object} filter - A MongoDB query filter to match documents.
   *
   * @typedef {Object} DeleteResult
   * @property {number} deletedCount - The number of documents that were deleted.
   */

  /**
   * Delete a single recipe from a collection.
   * @param {DeleteInput} input - The request body for the action.
   * @returns {Promise<DeleteResult>} - The response body for the action.
   */
   deleteRecipe = async (input) => {
    return this.action("deleteRecipe", input);
  };
}
