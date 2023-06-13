import React from "react";
import { EJSON, ObjectId } from "bson";
import atlasConfig from "../atlasConfig.json";
import { useDataApi } from "./useDataApi";
import {
  addValueAtIndex,
  removeValueAtIndex,
  getRecipeIndex,
} from "../utils";

const { dataSourceName } = atlasConfig;

const recipeCollection = {
  dataSource: dataSourceName,
  database: "recipes",
  collection: "recipe",
}

export function useRecipes() {
  // Set up a list of recipes in state
  const api = useDataApi();
  const [recipes, setRecipes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch all recipes on load and whenever our collection changes (e.g. if the current user changes)
  React.useEffect(() => {
    if (api.currentUser) {
      (async () => {
        try {
          const { documents } = await api.getRecipes({
            ...recipeCollection,
            filter: {},
          });
          console.log("documents: " + documents);
          setRecipes(documents);
          setLoading(false);
        } catch (err) {
          console.error(err)
        }
      })();
    }
  }, [api, api.currentUser?.id]);

  // Given a draft recipe, format it and then insert it
  const saveRecipe = async (draftRecipe) => {
    // Instead of a summary, I would need to change this to recipe name, list of ingredientsa
    if (draftRecipe.title && draftRecipe.ingredients && draftRecipe.instructions) {
      try {
        const document = {
          ...draftRecipe,
          owner_id: api.currentUser.id,
        };
        console.log("adding document:" + document);
        await api.addRecipe({
          // ...recipeCollection,
          ...document,
        });
        setRecipes((oldRecipes) => {
          const idx = oldRecipes.length;
          return addValueAtIndex(oldRecipes, idx, {
            ...document,
          });
        });
      } catch (err) {
        if (err.error?.match(/^Duplicate key error/)) {
          console.warn(
            `The following error means that this app tried to insert a recipe multiple times (i.e. an existing recipe has the same _id). In this app we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
          );
        }
        console.error(err);
      }
    }
  };

  // Delete a given recipe
  const deleteRecipe = async (recipe) => {
    await api.deleteRecipe({
       title: recipe.title
    });
    setRecipes((oldRecipes) => {
      const idx = getRecipeIndex(oldRecipes, recipe);
      return removeValueAtIndex(oldRecipes, idx);
    });
  };

  return {
    loading,
    recipes,
    saveRecipe,
    deleteRecipe,
  };
}
