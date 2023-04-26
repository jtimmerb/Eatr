import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import PageHeader from "../elements/pageHeader";
import Card from "../elements/layout/card";
import Container from "../elements/layout/container";
import ListItem from "../elements/pantry/listItem";
import RedSolidButton from "../elements/buttons/red-solid-button";
import Modal from "../elements/layout/modal";
import TextInput from "../elements/input/text";
import NumberInput from "../elements/input/number";
import SelectInput from "../elements/input/select";
import ListStep from "../elements/createRecipe/listStep";
import { RootState, useAppDispatch } from "../state";
import { searchIngredient } from "../state/pantry/pantry";
import { createRecipe } from "../state/recipes/recipes";

const Divider: React.FC = () => <div className="h-[1px] w-full bg-gray-200" />;

interface IIngredientItem {
  id: number;
  name: string;
  amount: string;
  checked: boolean;
}

interface IPrepItem {
  name: string;
  content: string;
  checked: boolean;
}

const unitOptions = [
  { label: "Unit", value: "unit" },
  { label: "Pound", value: "lb" },
  { label: "Ounce", value: "oz" },
  { label: "Cup", value: "cup" },
  { label: "Tablespoon", value: "tbsp" },
  { label: "Teaspoon", value: "tspn" },
];


const CreateRecipePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [ingItems, setIngItems] = useState<IIngredientItem[]>([]);
  const [prepItems, setPrepItems] = useState<IPrepItem[]>([]);
  
  const [showAddPrepModal, setShowAddPrepModal] = useState<boolean>(false);
  const [showAddIngrModal, setShowAddIngrModal] = useState<boolean>(false);
  const [recipeName, setRecipeName] = useState("");
  const [prepName, setPrepName] = useState("");
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientCount, setIngredientCount] = useState(1);
  const [ingredientUnit, setIngredientUnit] = useState(unitOptions[0].value);

  const { search: ingredient, items: stateItems } = useSelector(
    (state: RootState) => state.pantry
  );

  useEffect(() => {
    dispatch(searchIngredient({ name: ingredientName}))
  }, [ingredientName])

  const formValidIngr = () => {
    const nameValid = ingredientName !== "";
    const countValid = ingredientCount > 0;
    const unitValid = ingredientUnit !== "";

    const validIngredient = ingredient ? (ingredientName == ingredient.name && !Number.isNaN(ingredient.id)) : false;

    return nameValid && countValid && unitValid && validIngredient;
  };

 

  const handleChangeIngr = (event: any) => {
    const newItems: IIngredientItem[] = [...ingItems];

    const { name, value } = event.target;
    
    // Toggle checked
    newItems.forEach((item) => {
      if (item.name === name) item.checked = !item.checked;
    });

    setIngItems(newItems);
  };

  const handleRemoveIngr = () => {
    let newItems : IIngredientItem[] = [...ingItems];
    newItems = newItems.filter((item) => !item.checked)
    setIngItems(newItems);
  }
  
  const handleChangePrep = (event: any) => {
    const newSteps: IPrepItem[] = [...prepItems];

    const { name, value } = event.target;


    // Toggle checked
    newSteps.forEach((item) => {
      if (item.name === name) item.checked = !item.checked;
    });

    setPrepItems(newSteps);
  };

  const handleRemovePrep = () => {
    let newItems: IPrepItem[] = [...prepItems];
    newItems = newItems.filter((item) => !item.checked);
    setPrepItems(newItems);
  };

  const handleAddIngr = () => {
    if (ingredient === undefined) return;
    const newIngredient:IIngredientItem = {
      id: ingredient.id,
      name: ingredientName,
      amount: ingredientCount + " "+ingredientUnit,
      checked: false
    }
    setIngItems([...ingItems, newIngredient])
    setIngredientName("")
    setIngredientCount(1)
    setIngredientUnit(unitOptions[0].value);
    setShowAddIngrModal(false)
  }

  const handleAddPrep = () => {
    const newPrep: IPrepItem = {
      name: v4(),
      content: prepName,
      checked: false
    }

    setPrepItems([...prepItems, newPrep])
    setPrepName("")
    setShowAddPrepModal(false)
  }

  const valid = () => {
    const hasName = recipeName.length > 0;
    const hasIng = ingItems.length > 0;
    const hasPrep = prepItems.length > 0;

    return hasName && hasIng && hasPrep;
  }

  const handleSubmit = () => {
    dispatch(createRecipe({
      recipeName,
      steps: prepItems.map(item => item.content),
      ingredients: ingItems,
    })).unwrap().then(() => {
      setIngItems([])
      setPrepItems([])
      setRecipeName("")
    })
  };

  return (
    <>
      <PageHeader backAddr="/home" secondaryIcon={null}>
        Create Recipe
      </PageHeader>

      <Container className="">
        <div className="flex flex-col">
          <div className="pt-2">
            <TextInput
              name="recipe name"
              inputID="recipe"
              value={recipeName}
              label="Recipe Name"
              placeholder="Recipe Name"
              onChange={(event) => setRecipeName(event.target.value)}
            />
          </div>
          <div className="w-full flex flex-row items-center">
            <p className="text-gray-700 text-sm font-bold pr-2">Ingredients</p>
            <div className="flex flex-row space-x-2">
              <RedSolidButton
                className="h-8 flex items-center justify-center"
                onClick={() => setShowAddIngrModal(true)}
                padded
              >
                Add
              </RedSolidButton>
              <RedSolidButton
                className="h-8 flex items-center justify-center"
                onClick={handleRemoveIngr}
                padded
                disabled={ingItems.filter((ing) => ing.checked).length == 0}
              >
                Remove
              </RedSolidButton>
            </div>
          </div>
          <Card
            className="flex flex-col flex-nowrap max-h-[14rem] overflow-y-scroll mt-2"
            padded={false}
          >
            {ingItems.map((item, i) => (
              <div key={item.name}>
                <div className="px-4">
                  <ListItem
                    name={item.name}
                    checked={item.checked}
                    amount={item.amount}
                    onChange={handleChangeIngr}
                  ></ListItem>
                </div>
                {ingItems.length > 1 && i < ingItems.length - 1 ? (
                  <Divider />
                ) : null}
              </div>
            ))}
            {ingItems.length === 0 ? (
              <p className="mx-4 my-4">Add some ingredients to your recipe.</p>
            ) : null}
          </Card>
          <div className="w-full mt-4 flex flex-row items-center">
            <p className="text-gray-700 text-sm font-bold pr-2">Preparations</p>
            <div className="flex flex-row space-x-2">
              <RedSolidButton
                className="h-8 flex items-center justify-center"
                onClick={() => setShowAddPrepModal(true)}
                padded
              >
                Add
              </RedSolidButton>

              <RedSolidButton
                className="h-8 flex items-center justify-center"
                onClick={handleRemovePrep}
                padded
                disabled={prepItems.filter((prep) => prep.checked).length == 0}
              >
                Remove
              </RedSolidButton>
            </div>
          </div>
          <Card
            className="flex flex-col flex-nowrap max-h-[14rem] overflow-y-scroll mt-2"
            padded={false}
          >
            {prepItems.map((item, i) => (
              <div key={item.name}>
                <div className="px-4">
                  <ListStep
                    name={item.name}
                    label={`Step ${i + 1}`}
                    checked={item.checked}
                    content={item.content}
                    onChange={handleChangePrep}
                  ></ListStep>
                </div>
                {prepItems.length > 1 && i < prepItems.length - 1 ? (
                  <Divider />
                ) : null}
              </div>
            ))}
            {prepItems.length === 0 ? (
              <p className="mx-4 my-4">
                Add some preparation instructions to your recipe.
              </p>
            ) : null}
          </Card>

          <div className="absolute bottom-16 z-10 inset-x-6 flex justify-center">
            <RedSolidButton onClick={handleSubmit} disabled={!valid()}>Create</RedSolidButton>
          </div>
        </div>
      </Container>

      {showAddIngrModal ? (
        <Modal title="New Item" onClose={() => setShowAddIngrModal(false)}>
          <div>
            <TextInput
              label="Name"
              onChange={(event) => setIngredientName(event.target.value)}
              placeholder="Enter ingredient name"
              value={ingredientName}
            />
            <div className="flex flex-row justify-around">
              <NumberInput
                label="Count"
                placeholder="Enter count"
                value={ingredientCount}
                onChange={(event) =>
                  setIngredientCount(parseInt(event.target.value, 10))
                }
              />
              <div className="mx-2"></div>
              <SelectInput
                label="Unit"
                value={ingredientUnit}
                options={unitOptions}
                onChange={(event) => setIngredientUnit(event.target.value)}
              />
            </div>
            <div className="w-full mt-4">
              <RedSolidButton
                className="w-full"
                onClick={handleAddIngr}
                disabled={!formValidIngr()}
              >
                Add Item
              </RedSolidButton>
            </div>
          </div>
        </Modal>
      ) : null}

      {showAddPrepModal ? (
        <Modal title="New Step" onClose={() => setShowAddPrepModal(false)}>
          <div>
            <input
              type="text"
              id="stepdescr"
              placeholder="Enter preparation step"
              name="stepdescr"
              value={prepName}
              onChange={(e) => setPrepName(e.target.value)}
              className="border rounded-md py-2 px-3 w-full text-gray-700 text-sm"
            />
            <div className="w-full mt-4">
              <RedSolidButton
                className="w-full"
                onClick={handleAddPrep}
                disabled={prepName.length === 0}
              >
                Add Step
              </RedSolidButton>
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  );
};

export default CreateRecipePage;
