import React, { useEffect, useState } from "react";

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
import EllipsisIcon from "../images/ellipsisIcon";

import { RootState, useAppDispatch } from "../state";
import {
  createItem,
  deleteItem,
  listItems,
  searchIngredient,
} from "../state/pantry/pantry";

const Divider: React.FC = () => <div className="h-[1px] w-full bg-gray-200" />;

interface IPantryItem {
  id: number;
  name: string;
  amount: string;
  checked: boolean;
}

const unitOptions = [
  { label: "Unit", value: "unit" },
  { label: "Pound", value: "lb" },
  { label: "Ounce", value: "oz" },
];

const UserRecipePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [items, setItems] = useState<IPantryItem[]>([
    { id: 1, name: "tomatoes", amount: "6", checked: false },
    { id: 2, name: "chicken", amount: "2", checked: false },
    { id: 3, name: "broccoli", amount: "4", checked: false },
    { id: 4, name: "beef", amount: "1", checked: false },
    { id: 5, name: "pasta", amount: "2", checked: true },
  ]);

  const [showOptsModal, setShowOptsModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const handleListCheckedChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const newItems: IPantryItem[] = [...items];

    const { name, value } = event.target;
    console.log(name, value);

    // Toggle checked
    newItems.forEach((item) => {
      if (item.name === name) item.checked = !item.checked;
    });

    setItems(newItems);
  };

  const [ingredientName, setIngredientName] = useState("");
  const [ingredientCount, setIngredientCount] = useState(1);
  const [ingredientUnit, setIngredientUnit] = useState(unitOptions[0].value);

  const { search: ingredient, items: stateItems } = useSelector(
    (state: RootState) => state.pantry
  );

  useEffect(() => {
    dispatch(listItems({}));
  }, []);

  useEffect(() => {
    const checkedMap = items.reduce((acc, cur) => {
      acc.set(cur.name, cur.checked);
      return acc;
    }, new Map<string, boolean>());

    const newItems: IPantryItem[] = stateItems.map((item) => ({
      id: item.id,
      name: item.name,
      amount: item.amount,
      checked: checkedMap.get(item.name) || false,
    }));
    setItems(newItems);
  }, [stateItems]);

  useEffect(() => {
    dispatch(searchIngredient({ name: ingredientName }));
  }, [ingredientName]);

  const formValid = () => {
    const nameValid = ingredientName !== "";
    const countValid = ingredientCount > 0;
    const unitValid = ingredientUnit !== "";

    const validIngredient = ingredient ? !Number.isNaN(ingredient.id) : false;

    return nameValid && countValid && unitValid && validIngredient;
  };

  const handleSubmit = () => {
    const body = {
      ingredientId: ingredient?.id || -1,
      ingredientAmount: ingredientCount + " " + ingredientUnit,
    };
    dispatch(createItem(body))
      .unwrap()
      .then(() => {
        dispatch(listItems({}));
        setIngredientName("");
        setIngredientCount(1);
        setIngredientUnit(unitOptions[0].value);
      });
  };

  const handleDelete = () => {
    Promise.all(
      items
        .filter((item) => item.checked)
        .map((item) => dispatch(deleteItem({ ingredientID: item.id })).unwrap())
    ).then(() => dispatch(listItems({})));
  };

  return (
    <>
      <PageHeader
        backAddr="/home"
        secondaryIcon={
          <button onClick={() => setShowOptsModal(true)}>
            <EllipsisIcon className="w-6 h-6" />
          </button>
        }
      >
        My Pantry
      </PageHeader>

      <Container className="mt-4">
        <Card>
          {items.map((item, i) => (
            <div key={item.name}>
              <div className="px-4">
                <ListItem
                  name={item.name}
                  checked={item.checked}
                  amount={item.amount}
                  onChange={handleListCheckedChange}
                ></ListItem>
              </div>
              {items.length > 1 && i < items.length - 1 ? <Divider /> : null}
            </div>
          ))}
          {items.length === 0 ? (
            <p className="mx-4 my-4">Add some ingredients to your pantry.</p>
          ) : null}
        </Card>

        <div className="w-full mt-8">
          <RedSolidButton
            className="w-full"
            onClick={() => setShowAddModal(true)}
          >
            Add Item
          </RedSolidButton>
        </div>
      </Container>

      {showAddModal ? (
        <Modal title="New Item" onClose={() => setShowAddModal(false)}>
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

      {showOptsModal ? (
        <Modal title="Options" onClose={() => setShowOptsModal(false)}>
          <div className="w-full mt-4">
            <RedSolidButton
              className="w-full"
              onClick={handleDelete}
              disabled={items.filter((item) => item.checked).length === 0}
            >
              Delete Checked Items
            </RedSolidButton>
          </div>
        </Modal>
      ) : null}
    </>
  );
};

export default UserRecipePage;
