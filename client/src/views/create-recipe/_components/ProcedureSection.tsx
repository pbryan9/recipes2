import GroupsWrapper from './GroupsWrapper';

type ProcedureSectionProps = {};

export default function ProcedureSection({}: ProcedureSectionProps) {
  return (
    <section
      id='procedure-section'
      className='w-full flex flex-col items-start gap-6'
    >
      <h2 className='title-large'>Procedure</h2>
      <GroupsWrapper groupType='procedureGroups' />
    </section>
  );
}
