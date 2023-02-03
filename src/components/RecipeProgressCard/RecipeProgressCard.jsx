/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import useGetLocalStorage from '../../hooks/useGetLocalStorage';

function RecipeProgressCard({
  image, title, categoryOrAlcoholic,
  ingredients, instructions, measures, verifyIsFinish }) {
  const [checkedIngredient, setCheckedIngredient] = useState([]);

  const history = useHistory();
  const id = history.location.pathname.split('/')[2];
  const type = history.location.pathname.split('/')[1];

  const { ingredientsChecked } = useGetLocalStorage(type, id);

  useEffect(() => {
    if (!ingredientsChecked) return;
    const newIngredient = ingredients.map((e) => ingredientsChecked.includes(e));
    setCheckedIngredient(newIngredient);
  }, [ingredients]);

  useEffect(() => {
    verifyIsFinish(checkedIngredient);
  }, [checkedIngredient]);

  const handleChange = (ingredient) => {
    const getItems = JSON.parse(localStorage.getItem('inProgressRecipes'));
    const newItem = getItems;
    newItem[type][id].push(ingredient);
    localStorage.setItem('inProgressRecipes', JSON.stringify(newItem));

    const newIngredient = ingredients.map((e) => getItems[type][id].includes(e));
    setCheckedIngredient(newIngredient);
  };

  return (
    <div>
      <h1 data-testid="recipe-title">{title}</h1>
      <img
        src={ image }
        alt="imagem da receita"
        data-testid="recipe-photo"
        width={ 250 }
        height={ 200 }
      />
      <p data-testid="recipe-category">{categoryOrAlcoholic}</p>
      <div>
        {ingredients.map((ingredient, index) => (
          <label
            key={ index }
            data-testid={ `${index}-ingredient-step` }
            htmlFor={ ingredient }
            style={ { textDecoration: checkedIngredient[index]
              ? 'line-through solid rgb(0, 0, 0)' : '' } }
          >
            <input
              type="checkbox"
              id={ ingredient }
              name={ ingredient }
              onChange={ () => handleChange(ingredient) }
              checked={ checkedIngredient[index] }
              disabled={ checkedIngredient[index] }
            />
            {
              measures[index] === undefined
                ? `${ingredient}` : `${ingredient} - ${measures[index]}`
            }
          </label>
        ))}
      </div>
      <p data-testid="instructions">{instructions}</p>
    </div>
  );
}

RecipeProgressCard.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  categoryOrAlcoholic: PropTypes.string,
  ingredients: PropTypes.arrayOf(PropTypes.string),
  measures: PropTypes.arrayOf(PropTypes.string),
  instructions: PropTypes.string,
  verifyIsFinish: PropTypes.func.isRequired,
};

RecipeProgressCard.defaultProps = {
  image: '',
  title: '',
  categoryOrAlcoholic: '',
  ingredients: [],
  measures: [],
  instructions: '',
};

export default RecipeProgressCard;