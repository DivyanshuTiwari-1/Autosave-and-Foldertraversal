// src/components/Folder.tsx
'use client'; // Mark this as a Client Component

import React, { useState } from 'react';
import { FolderItem } from '../../types/types';

interface FolderProps {
  folder: FolderItem;
}

const Folder: React.FC<FolderProps> = ({ folder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFolder = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div onClick={toggleFolder} style={{ cursor: 'pointer' }}>
        {folder.type === 'folder' ? (isOpen ? '📂' : '📁') : '📄'} {folder.name}
      </div>
      {isOpen && folder.children && (
        <div style={{ marginLeft: '20px' }}>
          {folder.children.map((child, index) => (
            <Folder key={index} folder={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Folder;