export const enum Category {
  Vegi = 'Vegi',
  Meat = 'Meat',
  VegiMeat = 'VegiMeat',
  Carb = 'Carb',
  AltCarb = 'AltCarb',
  Soup = 'Soup',
  FullDish = 'FullDish',
  Drink = 'Drink',
  Egg = 'Egg',
  Pasta = 'Pasta',
}

export interface Recipe {
  ingredients: Array<Ingredient>
  
}

export interface Ingredient {

}
