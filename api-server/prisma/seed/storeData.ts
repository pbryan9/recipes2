import { getAllRecipes } from '../../db/recipes/getAllRecipes';

import fs from 'fs';
import path from 'path';
import getAllUsers from '../../db/users/getAllUsers';
import getAllTags from '../../db/tags/getAllTags';

async function storeRecipeData() {
  const recipes = await getAllRecipes();

  await saveData({ data: recipes, filename: 'recipes.json' });

  return recipes;
}

async function storeUserData() {
  const users = await getAllUsers();

  await saveData({ data: users, filename: 'users.json' });

  return users;
}

async function storeTagData() {
  const tags = await getAllTags();

  await saveData({ data: tags, filename: 'tags.json' });

  return tags;
}

type SaveDataParams = {
  data: Object[];
  filename: string;
  writeDir?: string;
};

async function saveData({
  data,
  filename,
  writeDir = 'stored-data',
}: SaveDataParams) {
  let writeData = Buffer.from(JSON.stringify(data));
  let fullPath = path.join(__dirname, writeDir, filename);

  createDirIfNeeded(fullPath);

  // console.log({ fullPath });

  fs.writeFile(fullPath, writeData, (err) => {
    if (err) console.log({ err });
  });
}

function createDirIfNeeded(absolutePath: string) {
  if (!path.isAbsolute(absolutePath))
    throw new Error('Error: requires absolute path');

  let dirName = path.dirname(absolutePath);

  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }

  return;
}

function main() {
  storeUserData()
    .then(() => console.log('saved users'))
    .catch((err) => console.log('Error saving users:', err));

  storeRecipeData()
    .then(() => console.log('saved recipes'))
    .catch((err) => console.log('Error saving recipes:', err));

  storeTagData()
    .then(() => console.log('saved tags'))
    .catch((err) => console.log('Error saving tags:', err));
}

main();
