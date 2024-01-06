import React from 'react';
import './App.css';
import { Button } from "./@/components/ui/button"
import { Input } from "./@/components/ui/input"
import { ApiDownloader } from './services/api';

function App() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div>
        <p className="text-2xl font-bold">BAIXE AGORA SEU VÍDEO TIKTOK</p>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input type="url" placeholder="URL TIKTOK VIDEO" id='url'/>
          <Button type="submit" onClick={()=> ApiDownloader.getVideo('https://www.tiktok.com/@whtnatan/video/7320666232867409157')}>DOWNLOAD</Button>
        </div>
      </div>
    </div>
  );
}

export default App;