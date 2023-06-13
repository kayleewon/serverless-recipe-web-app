import React from "react";
import {
  Grid,
  TextField,
  Button,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";


export function DraftRecipeItem({ recipe, recipeActions, draftRecipeActions }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <TextField
          // style={{ width: "100%" }}
          // size="small"
          label="Title"
          value={recipe.title}
          onChange={(e) => {
            draftRecipeActions.setDraftRecipeTitle(recipe, e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          // style={{ width: "100%" }}
          // size="small"
          label="Ingredients"
          multiline
          value={recipe.ingredients}
          // value={recipe.ingredients.split("\n")}
          onChange={(e) => {
            draftRecipeActions.setDraftRecipeIngredients(recipe, e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          // style={{ width: "100%" }}
          // size="small"
          label="Instructions"
          multiline
          value={recipe.instructions}
          // value={recipe.instructions.split("\n")}
          onChange={(e) => {
            draftRecipeActions.setDraftRecipeInstructions(recipe, e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        {/* <ListItemSecondaryAction> */}
          <Button
            variant="outlined"
            size="small"
            onClick={async () => {
              await recipeActions.saveRecipe(recipe);
              draftRecipeActions.deleteDraftRecipe(recipe);
            }}
          >
            Save
          </Button>
          <Button
            edge="end"
            size="small"
            onClick={() => {
              draftRecipeActions.deleteDraftRecipe(recipe);
            }}
          >
            <ClearIcon />
          </Button>
        {/* </ListItemSecondaryAction> */}
      </Grid>
    </Grid>
  );
}
