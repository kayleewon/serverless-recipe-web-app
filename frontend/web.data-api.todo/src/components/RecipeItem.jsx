import React from "react";
import {
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

export function RecipeItem({ recipe, recipeActions }) {
  const ingredients = recipe.ingredients.split("\n")
  const instructions = recipe.instructions.split("\n")
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        Name: {recipe.title}
      </Grid>
      <Grid item xs={12}>
        <List>
          Ingredients: {ingredients.map((item, index) => (
            <ListItem key={index}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid item xs={12}>
      <List>
          Instructions: {instructions.map((item, index) => (
            <ListItem key={index}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid item>
        {/* <ListItemSecondaryAction> */}
          <IconButton
            data-testid="recipe-delete-button"
            edge="end"
            size="small"
            onClick={() => {
              recipeActions.deleteRecipe(recipe);
            }}
          >
            <ClearIcon />
          </IconButton>
        {/* </ListItemSecondaryAction> */}
        </Grid>
    </Grid>
  );
}
