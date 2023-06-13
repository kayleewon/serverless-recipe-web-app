import { createContext, useContext, useState, useMemo } from "react";
import { DataApi } from "../data-api";

const DataApiContext = createContext(null);

export const DataApiProvider = ({ appId, location, children }) => {

  const deployment_model = location.deployment_model ??
    (location.cloud || location.region ? "LOCAL" : "GLOBAL");

  const { cloud, region } = location;
  const api = useMemo(() => {
    return new DataApi({
      appId,
      deployment_model,
      cloud,
      region,
      onAuthChange: (newCurrentUser) => {
        setCurrentUser(newCurrentUser);
      }
    });
  }, [appId, deployment_model, cloud, region])

  const [currentUser, setCurrentUser] = useState(api.currentUser);

  const contextValue = useMemo(() => {
    return {
      // User Auth
      currentUser,
      logIn: api.logIn,
      logOut: api.logOut,
      registerUser: api.registerUser,
      emailPasswordAuth: api.emailPasswordAuth,
      // HTTPS Endpoints
      getRecipes: api.getRecipes,
      addRecipe: api.addRecipe,
      deleteRecipe: api.deleteRecipe,
    }
  }, [api, currentUser]);
  return (
    <DataApiContext.Provider value={contextValue}>
      {children}
    </DataApiContext.Provider>
  );
};

export function useDataApi() {
  const api = useContext(DataApiContext);
  if (!api) {
    throw new Error(
      `You must call useDataApi() inside of a <DataApiProvider>.`
    );
  }
  return api;
}
