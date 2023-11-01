import prisma from '../prismaSingleton';
import type { ShareRecipeInput } from '../../validators/shareRecipeValidator';
import { TRPCError } from '@trpc/server';
import 'dotenv/config';
import nodemailer, { SendMailOptions } from 'nodemailer';

const { NODEMAILER_SHARE_USER, NODEMAILER_SHARE_PASSWORD } = process.env;

export default async function shareRecipe(
  { toEmail, recipeId }: ShareRecipeInput,
  fromUserId: string
) {
  // pull from user & recipe from database (error if either are missing)
  const fromUserP = prisma.user.findUnique({ where: { id: fromUserId } });
  const recipeP = prisma.recipe.findUnique({
    where: { id: recipeId },
    include: {
      ingredientGroups: {
        include: {
          ingredients: true,
        },
      },
      procedureGroups: {
        include: {
          procedureSteps: true,
        },
      },
    },
  });

  const [fromUser, recipe] = await Promise.all([fromUserP, recipeP]);

  if (!fromUser) throw new TRPCError({ code: 'NOT_FOUND', message: 'user' });
  if (!recipe) throw new TRPCError({ code: 'NOT_FOUND', message: 'recipe' });

  // step through recipe, constructing titles & lists for each ingredient group

  let ingredientGroups = '';

  recipe.ingredientGroups.forEach((group) => {
    if (ingredientGroups !== '' && group.groupTitle === '')
      ingredientGroups += '<p>~~~~~</p>';

    let ingredients = '';

    if (group.groupTitle !== '') {
      ingredients += `<h3>${group.groupTitle}</h3>`;
    }

    ingredients += '<ul>';

    group.ingredients.forEach((ing) => {
      ingredients += `<li>${[ing.qty, ing.uom, ing.description].join(
        ' '
      )}</li>`;
    });

    ingredients += '</ul>';

    ingredientGroups += ingredients;
  });

  // step through recipe, constructing titles & lists for each procedure group

  let procedureGroups = '';

  recipe.procedureGroups.forEach((group) => {
    if (procedureGroups !== '' && group.groupTitle === '')
      procedureGroups += '<p>~~~~~</p>';

    let steps = '';

    if (group.groupTitle !== '') steps += `<h3>${group.groupTitle}</h3>`;

    steps += '<ol>';

    group.procedureSteps.forEach((step) => {
      steps += `<li>${step.description}</li>`;
    });

    steps += '</ol>';

    procedureGroups += steps;
  });

  // prepare emailer

  const transporter = nodemailer.createTransport({
    host: 'smtp.forwardemail.net',
    port: 465,
    secure: true,
    auth: {
      user: NODEMAILER_SHARE_USER,
      pass: NODEMAILER_SHARE_PASSWORD,
    },
  });

  // construct email

  const mailOptions: SendMailOptions = {
    from: `"Family Recipes" <${NODEMAILER_SHARE_USER}>`,
    to: toEmail,
    subject: `Shared recipe: ${recipe.title}`,
    html: `
    <p>Hi there -- ${fromUser.username} has shared a recipe with you!</p>
    
    <p>You can read the recipe below, or click <a href="https://recipes.pattyb.dev/recipes?recipeId=${recipe.id}">here</a> for the most up-to-date version. We'd love it if you'd come by and visit, and maybe even share some of your own!</p>

    <h1>${recipe.title}</h1>
    
    <h2>Ingredients</h2>

    ${ingredientGroups}
    
    <h2>Procedure</h2>

    ${procedureGroups}

    <p>
      And that's it! We hope you have as much luck with this recipe as ${fromUser.username} has, and that you'll come visit us soon at <a href='https://recipes.pattyb.dev'>Family Recipes</a> to find more great ideas & show us a few of your own!
    </p>
    `,
  };

  // send email & return

  const info = await transporter.sendMail(mailOptions);

  return { message: 'email sent to ' + toEmail, messageId: info.messageId };
}
