import React, { useState } from "react";

import { useSelector } from "react-redux";
import { selectName, selectId } from "../state/user/user";
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

const Divider: React.FC = () => <div className="h-[1px] w-full bg-gray-200" />;

interface IPantryItem {
  name: string;
  count: number;
  checked: boolean;
}

const UserRecipePage: React.FC = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState<IPantryItem[]>([
    { name: "tomatoes", count: 6, checked: false },
    { name: "chicken", count: 2, checked: false },
    { name: "broccoli", count: 4, checked: false },
    { name: "beef", count: 1, checked: false },
    { name: "pasta", count: 2, checked: true },
  ]);

  const [showOptsModal, setShowOptsModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const navFindRec = () => {
    console.log("findrec");
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const newItems: IPantryItem[] = [...items];

    const { name, value } = event.target;
    console.log(name, value);

    // Toggle checked
    newItems.forEach((item) => {
      if (item.name === name) item.checked = !item.checked;
    });

    setItems(newItems);
  };

  const unitOptions = [
    { label: "Unit", value: "unit" },
    { label: "Pound", value: "lb" },
    { label: "Ounce", value: "oz" },
  ];

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
            <>
              <div className="px-4">
                <ListItem
                  key={item.name}
                  name={item.name}
                  checked={item.checked}
                  count={item.count}
                  onChange={handleChange}
                ></ListItem>
              </div>
              {items.length > 1 && i < items.length - 1 ? <Divider /> : null}
            </>
          ))}
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
            <TextInput label="Name" placeholder="Enter ingredient name" />
            <div className="flex flex-row justify-around">
              <NumberInput label="Count" placeholder="Enter count" value={1} />
              <div className="mx-2"></div>
              <SelectInput
                label="Unit"
                value={unitOptions[0].value}
                options={unitOptions}
              />
            </div>

            <div className="w-full mt-4">
              <RedSolidButton className="w-full" onClick={() => null}>
                Add Item
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

export default UserRecipePage;
