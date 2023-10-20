import { type FilledRecipe } from '../../../../api-server/db/recipes/getRecipeById';
import FavoritesButton from '../../components/FavoritesButton';

type RecipeSummaryCardProps = {
  recipe: FilledRecipe;
  onClick: () => void;
  isSelected?: boolean;
};

type HSL = { h: number; s: number; l: number };

function hexToHsl(hexValue: string): HSL {
  const r = parseInt(hexValue.substring(1, 3), 16) / 255;
  const g = parseInt(hexValue.substring(3, 5), 16) / 255;
  const b = parseInt(hexValue.substring(5), 16) / 255;

  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);

  const lightness = (min + max) / 2;

  let chroma = max - min;

  let saturation;

  if (lightness === 0 || lightness === 1) {
    saturation = 0;
  } else {
    saturation = chroma / (1 - Math.abs(2 * max - chroma - 1));
  }

  let hue;

  if (max === min) {
    hue = 0;
  } else if (max === r) {
    hue = 60 * (((g - b) / chroma) % 6);
  } else if (max === g) {
    hue = 60 * ((b - r) / chroma + 2);
  } else {
    hue = 60 * ((r - g) / chroma + 4);
  }

  return { h: hue, s: saturation, l: lightness };
}

function hslToHex({ h, s, l }: HSL) {
  let chroma = (1 - Math.abs(2 * l - 1)) * s;

  let hPrime = h / 60;

  let x = chroma * (1 - Math.abs((hPrime % 2) - 1));

  let baseR;
  let baseG;
  let baseB;

  switch (true) {
    case hPrime < 1:
      [baseR, baseG, baseB] = [chroma, x, 0];
      break;
    case hPrime < 2:
      [baseR, baseG, baseB] = [x, chroma, 0];
      break;
    case hPrime < 3:
      [baseR, baseG, baseB] = [0, chroma, x];
      break;
    case hPrime < 4:
      [baseR, baseG, baseB] = [0, x, chroma];
      break;
    case hPrime < 5:
      [baseR, baseG, baseB] = [x, 0, chroma];
      break;
    case hPrime < 6:
      [baseR, baseG, baseB] = [chroma, 0, x];
      break;
    default:
      throw new Error(`hPrime was somehow ${hPrime}`);
  }

  let m = l - chroma / 2;

  let [r, g, b] = [
    Math.round((baseR + m) * 255).toString(16),
    Math.round((baseG + m) * 255).toString(16),
    Math.round((baseB + m) * 255).toString(16),
  ];

  return '#' + r + g + b;
}

function calculateLabelColor(hexCode: string) {
  const { h, s, l } = hexToHsl(hexCode);

  let res: HSL = { h, s, l };

  if (l < 0.5) {
    res.l = l + 0.5;
  } else {
    res.l = l - 0.5;
  }

  if (s < 0.5) {
    res.s += 0.4;
  } else {
    res.s -= 0.4;
  }

  return hslToHex(res);
}

calculateLabelColor('#c6cfd7');

export default function RecipeSummaryCard({
  recipe,
  onClick,
  isSelected = false,
}: RecipeSummaryCardProps) {
  return (
    <article
      onClick={onClick}
      className={`rounded-sm pl-4 gap-4 pr-6 flex items-center justify-between w-full h-[72px] shrink-0 cursor-pointer ${
        isSelected ? 'bg-white/10' : 'bg-surface-container hover:bg-white/5'
      }`}
    >
      <div className='flex items-center gap-4 w-full overflow-x-hidden'>
        {/* <div className='w-10 aspect-square rounded-full flex items-center justify-center primary-container on-primary-container-text title-large shrink-0'> */}
        <div
          className='w-10 aspect-square rounded-full flex items-center justify-center on-primary-container-text title-large shrink-0'
          style={{
            backgroundColor: recipe.author.avatarColor || '#3A4D00',
            color: calculateLabelColor(recipe.author.avatarColor || '#3A4D00'),
          }}
        >
          {recipe.author.username[0].toUpperCase()}
        </div>
        <div className='flex flex-col justify-center items-start overflow-hidden'>
          <h2 className='title-medium on-surface-text w-full overflow-hidden text-ellipsis whitespace-nowrap'>
            {recipe.title}
          </h2>
          {recipe.tags.length > 0 && (
            <p className='title-small on-surface-variant-text whitespace-nowrap text-ellipsis overflow-hidden'>
              {recipe.tags.map((tag) => tag.description).join(', ')}
            </p>
          )}
        </div>
      </div>
      <FavoritesButton recipeId={recipe.id} />
    </article>
  );
}
