import React from "react";
import { createObjectId } from "../utils";

export function useDraftRecipes() {
  const [drafts, setDrafts] = React.useState([]);

  const createDraftRecipe = () => {
    const draftRecipe = {
      _id: createObjectId(),
      title: "",
      ingredients: [],
      instructions: []
    };
    setDrafts((d) => [...d, draftRecipe]);
  };

  const setDraftRecipeTitle = (draft, title) => {
    setDrafts((oldDrafts) => {
      const idx = oldDrafts.findIndex((d) => d._id === draft._id);
      return [
        ...oldDrafts.slice(0, idx),
        { ...oldDrafts[idx], title },
        ...oldDrafts.slice(idx + 1),
      ];
    });
  };

  const setDraftRecipeIngredients = (draft, ingredients) => {
    setDrafts((oldDrafts) => {
      const idx = oldDrafts.findIndex((d) => d._id === draft._id);
      return [
        ...oldDrafts.slice(0, idx),
        { ...oldDrafts[idx], ingredients },
        ...oldDrafts.slice(idx + 1),
      ];
    });
  };

  const setDraftRecipeInstructions = (draft, instructions) => {
    setDrafts((oldDrafts) => {
      const idx = oldDrafts.findIndex((d) => d._id === draft._id);
      return [
        ...oldDrafts.slice(0, idx),
        { ...oldDrafts[idx], instructions },
        ...oldDrafts.slice(idx + 1),
      ];
    });
  };

  const deleteDraftRecipe = (draft) => {
    setDrafts((oldDrafts) => {
      const idx = oldDrafts.findIndex((d) => d._id === draft._id);
      return [...oldDrafts.slice(0, idx), ...oldDrafts.slice(idx + 1)];
    });
  };

  return {
    draftRecipes: drafts,
    createDraftRecipe,
    setDraftRecipeTitle,
    setDraftRecipeIngredients,
    setDraftRecipeInstructions,
    deleteDraftRecipe,
  };
}
