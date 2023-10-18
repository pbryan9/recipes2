import GroupsWrapper from './GroupsWrapper';

type IngredientsSectionProps = {};

export default function IngredientsSection({} // control,
: IngredientsSectionProps) {
  return (
    <section
      id='ingredients-section'
      className='w-full flex flex-col items-start gap-6 border-y border-y-outline-variant py-6'
    >
      <h2 className='title-large'>Ingredients</h2>
      <GroupsWrapper groupType='ingredientGroups' />
    </section>
  );
}
