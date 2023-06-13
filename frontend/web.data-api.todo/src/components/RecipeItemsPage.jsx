import React from "react";
import {
  Container,
  Button,
  Typography,
  List,
  LinearProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useRecipes } from "../hooks/useRecipes";
import { RecipeItem } from "./RecipeItem";
import { useDraftRecipes } from "../hooks/useDraftRecipes";
import { DraftRecipeItem } from "./DraftRecipeItem";
import { useShowLoader } from "../hooks/util-hooks";
import { MoreInfo } from "./MoreInfo";
import { getRecipeId } from "../utils";

export function RecipeItemsPage() {
  const { loading, recipes, ...recipeActions } = useRecipes();
  const { draftRecipes, ...draftRecipeActions } = useDraftRecipes();
  const showLoader = useShowLoader(loading, 200);
  return (
    <Container className="main-container" maxWidth="sm">
      {loading ? (
        showLoader ? (
          <LinearProgress />
        ) : null
      ) : (
        <div className="recipe-items-container">
          <Typography component="p" variant="h5">
            {`You have ${recipes.length} Recipe${
              recipes.length === 1 ? "" : "s"
            }`}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => draftRecipeActions.createDraftRecipe()}
          >
            Add Recipe
          </Button>
          <List style={{ width: "100%" }}>
            {recipes.map((recipe) => (
              // Need a recipe item instead of a 'TodoItem'
              // Will need to update the attributes for all the fields in the recipe collection
              // Need to update the component (each item gets a todo item component)
              // If I have a recipe page, I need to have a recipe component w/ recipe name, ingredients, etc
              <RecipeItem
                key={getRecipeId(recipe)}
                recipe={recipe}
                recipeActions={recipeActions}
              />
            ))}
            {draftRecipes.map((draft) => (
              // this is when you are writing a todo item but haven't saved/added it yet
              <DraftRecipeItem
                key={getRecipeId(draft)}
                recipe={draft}
                recipeActions={recipeActions}
                draftRecipeActions={draftRecipeActions}
              />
            ))}
          </List>
        </div>
      )}
      <MoreInfo />
    </Container>
  );
}
