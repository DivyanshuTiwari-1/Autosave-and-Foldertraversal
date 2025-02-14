import React from 'react';
import Folder from './components/Folder';
import { FolderItem } from '../types/types';
import AutoSaveTextBox from './components/AutoSaveTextBox';

// Simulate fetching data from a JSON file
const fetchData = async (): Promise<FolderItem> => {
  const data = await import('../../public/Data.json');
  return data.default.root as FolderItem; // Type assertion to ensure correct type
};

export default async function Home() {
  const data = await fetchData();

  return (
    <>
      <div>
        <AutoSaveTextBox />
      </div>
      <div className="max-w-xl mx-auto mt-6 px-4">
        <h1>Folder traversal system</h1>
        <Folder folder={data} />
      </div>
    </>
  );
}
