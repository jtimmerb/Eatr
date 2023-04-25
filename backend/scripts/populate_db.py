import argparse
import os
import json
import sys

import requests

SCRIPT_PATH = os.path.dirname(os.path.realpath(__file__))
API_PREFIX = "/api/v1"


def parse_args() -> str:
    parser = argparse.ArgumentParser()
    parser.add_argument("hostname")

    args = parser.parse_args()

    return args.hostname


def populate_ingredients(host: str) -> dict[str, int]:
    with open(f"{SCRIPT_PATH}/fixtures/ingredients.json", "r") as json_file:
        ingredients = json.load(json_file)

    ingredients_map: dict[str, int] = {}

    # Create ingredients
    missed_ingredients: list[str] = []
    for ingredient in ingredients:
        # Send request
        res = requests.post(f"{host}{API_PREFIX}/ingredients", json=ingredient)
        if res.status_code != 200:
            print(
                f"error creating ingredient {ingredient['name']}. {res.status_code}: {res.json()['message']}"
            )
            missed_ingredients.append(ingredient["name"])

        else:
            # Update map with ingredients ID
            ingredients_map[ingredient["name"]] = res.json()["ingredientId"]

    # Attempt to fetch ingredient IDs for any ingredients that already exist
    for name in missed_ingredients:
        res = requests.get(f"{host}{API_PREFIX}/ingredients", params=dict(name=name))
        matches = res.json()
        if matches:
            ingredients_map[name] = matches[0]["ingredientId"]

    return ingredients_map


def populate_recipes(host: str, ingredients_map: dict[str, int]):
    with open(f"{SCRIPT_PATH}/fixtures/recipes.json", "r") as json_file:
        recipes = json.load(json_file)

    # Preprocess
    for recipe in recipes:
        for ing in recipe["recipeIngredients"]:
            ing["recipeId"] = 0
            ing["recipeIngredientMembershipId"] = 0
            ing["ingredientId"] = ingredients_map.get(ing["ingredientName"], -1)

    # Send requests
    for recipe in recipes:
        res = requests.post(f"{host}{API_PREFIX}/recipes", json=recipe)
        name = recipe["recipe"]["name"]
        if res.status_code != 200:
            print(
                f"error creating recipe {name}. {res.status_code}: {res.json()['message']}"
            )
        else:
            print(f"successfully created recipe {name}")


def populate_db(host: str):
    ingredients_map = populate_ingredients(host)
    populate_recipes(host, ingredients_map)


def main():
    # Read args
    host = parse_args()

    if not host:
        print("No hostname specified.")
        sys.exit(1)

    populate_db(host)


if __name__ == "__main__":
    main()
