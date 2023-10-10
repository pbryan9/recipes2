import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className='p-6 basis-8/12 flex flex-col gap-5 overflow-y-auto min-h-[calc(100vh_-_80px)]'>
      <h1>Home</h1>
      <Link to='/recipes'>Recipes</Link>
      <Link to='/recipes/create-new-recipe'>New Recipe Form</Link>
    </main>
  );
}
