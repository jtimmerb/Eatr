import React, { useState } from "react";

import { useSelector } from "react-redux";
// import { selectName, selectId } from "../states/userSlice";
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

const testIngred = [{ id: 1, name: "tomatoes", amount: "6", checked: false },
    { id: 2, name: "chicken", amount: "2", checked: false },
    { id: 3, name: "broccoli", amount: "4", checked: false },
    { id: 4, name: "beef", amount: "1", checked: false },
    { id: 5, name: "pasta", amount: "2", checked: true },]
  
const testSteps = [
  { name: "step1", content: "step1", checked: false },
  { name: "step2", content: "step2", checked: false },
  {
    name: "step3",
    content: "step3 looong long long long long long long long long long ",
    checked: false,
  },
];
const CreateRecipePage: React.FC = () => {
  const navigate = useNavigate();

  const [ingItems, setIngItems] = useState<IIngredientItem[]>(testIngred);
  const [steps, setSteps] = useState<IPrepItem[]>([]);

  const handleSubmit = () => {};

  const unitOptions = [
    { label: "Unit", value: "unit" },
    { label: "Pound", value: "lb" },
    { label: "Ounce", value: "oz" },
  ];

  console.log(ingItems)

  const [showOptsModal, setShowOptsModal] = useState<boolean>(false);
  const [showAddPrepModal, setShowAddPrepModal] = useState<boolean>(false);
  const [showAddIngrModal, setShowAddIngrModal] = useState<boolean>(false);
  const [recipeName, setRecipeName] = useState("");
  const [stepDescr, setStepDescr] = useState("");
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientCount, setIngredientCount] = useState(1);
  const [ingredientUnit, setIngredientUnit] = useState(unitOptions[0].value);
  const { search: ingredient, items: stateItems } = useSelector(
    (state: RootState) => state.pantry
  );

  const formValid = () => {
    const nameValid = ingredientName !== "";
    const countValid = ingredientCount > 0;
    const unitValid = ingredientUnit !== "";

    const validIngredient = ingredient ? !Number.isNaN(ingredient.id) : false;

    return nameValid && countValid && unitValid && validIngredient;
  };

  
  const handleRecipeNameChange = (event: any) => {
    setRecipeName(event.target.value);
  };

  const handleStepDescrChange = (event: any) => {
    setStepDescr(event.target.value);
  };

  const handleChangeIngr = (event: any) => {
    const newItems: IIngredientItem[] = [...ingItems];

    const { name, value } = event.target;
    console.log(name, value);

    // Toggle checked
    newItems.forEach((item) => {
      if (item.name === name) item.checked = !item.checked;
    });

    setIngItems(newItems);
  };

  const handleChangeSteps = (event: any) => {
    const newSteps: IPrepItem[] = [...steps];

    const { name, value } = event.target;
    console.log(name, value);

    // Toggle checked
    newSteps.forEach((item) => {
      if (item.name === name) item.checked = !item.checked;
    });

    setSteps(newSteps);
  };


  return (
    <>
      <PageHeader backAddr="/home" secondaryIcon={null}>
        Create Recipe
      </PageHeader>

      <Container className="">
        <form onSubmit={() => {}} className="flex flex-col">
          <div className="pt-2">
            <TextInput
              name="recipe name"
              inputID="recipe"
              value={recipeName}
              label="Recipe Name"
              placeholder="Recipe Name"
              onChange={(e: any) => setRecipeName(e.target.val)}
            />
          </div>
          <div className="w-full flex flex-row items-center">
            <p className="text-gray-700 text-sm font-bold pr-2">Ingredients</p>
            <div className="flex flex-row space-x-2">
              <RedSolidButton
                className="w-12 h-8 flex items-center justify-center"
                onClick={() => setShowAddIngrModal(true)}
              >
                Add
              </RedSolidButton>
              <RedSolidButton
                className="h-8 flex items-center justify-center"
                onClick={() => setShowAddIngrModal(true)}
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
              <>
                <div className="px-4">
                  <ListItem
                    key={item.name}
                    name={item.name}
                    checked={item.checked}
                    amount={"5"}
                    onChange={handleChangeIngr}
                  ></ListItem>
                </div>
                {ingItems.length > 1 && i < ingItems.length - 1 ? (
                  <Divider />
                ) : null}
              </>
            ))}
            {ingItems.length === 0 ? (
              <p className="mx-4 my-4">Add some ingredients to your pantry.</p>
            ) : null}
          </Card>
          <div className="w-full mt-4 flex flex-row items-center">
            <p className="text-gray-700 text-sm font-bold pr-2">Preparations</p>
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
                onClick={() => setShowAddIngrModal(true)}
                padded
                disabled={ingItems.length > 1}
              >
                Remove
              </RedSolidButton>
            </div>
          </div>
          <Card
            className="flex flex-col flex-nowrap max-h-[14rem] overflow-y-scroll mt-2"
            padded={false}
          >
            {steps.map((item, i) => (
              <>
                <div className="px-4">
                  <ListStep
                    key={item.name}
                    name={item.name}
                    checked={item.checked}
                    content={item.content}
                    onChange={handleChangeSteps}
                  ></ListStep>
                </div>
                {ingItems.length > 1 && i < ingItems.length - 1 ? (
                  <Divider />
                ) : null}
              </>
            ))}
          </Card>

          <div className="absolute bottom-16 z-10 inset-x-6 flex justify-center">
            <RedSolidButton onClick={() => null}>Create</RedSolidButton>
          </div>
        </form>
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
                onClick={handleSubmit}
                disabled={!formValid()}
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
              value={stepDescr}
              onChange={handleStepDescrChange}
              className="border rounded-md py-2 px-3 w-full text-gray-700 text-sm"
            />
            <div className="w-full mt-4">
              <RedSolidButton className="w-full" onClick={() => null}>
                Add Step
              </RedSolidButton>
            </div>
          </div>
        </Modal>
      ) : null}

      {showOptsModal ? (
        <Modal title="Options" onClose={() => setShowOptsModal(false)}>
          <div className="w-full mt-4">
            <RedSolidButton className="w-full" onClick={() => null}>
              Delete Checked Items
            </RedSolidButton>
          </div>
        </Modal>
      ) : null}
    </>
  );
};

export default CreateRecipePage;
