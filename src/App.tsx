import React from 'react';
import './App.css';
import { Button } from "./@/components/ui/button";
import { Input } from "./@/components/ui/input";

function App() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div>
                <p className="text-2xl font-bold">BAIXE AGORA SEU VÍDEO TIKTOK</p>
                <div className="flex w-full max-w-sm items-center space-x-2">
                    <Input type="email" placeholder="URL TIKTOK VIDEO" />
                    <Button type="submit">DOWNLOAD</Button>
                </div>
            </div>
        </div>
    );
}

export default App;