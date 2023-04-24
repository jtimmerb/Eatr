import React, { useState } from "react";

import { useSelector } from "react-redux";
import { selectName, selectId } from "../states/userSlice";
import { useNavigate } from "react-router-dom";
import PageHeader from "../elements/pageHeader";
import Card from "../elements/layout/card";
import Container from "../elements/layout/container";
import ListItem from "../elements/pantry/listItem";

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

  return (
    <>
      <PageHeader pageName="My Pantry" backAddr="/userhome" />

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
      </Container>
    </>
  );
};

export default UserRecipePage;
