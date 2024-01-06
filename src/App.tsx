/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import './App.css';
import { Button } from "./@/components/ui/button";
import { Input } from "./@/components/ui/input";
import { ApiDownloader } from './services/api';

function App() {
    const [input, setInput] = useState('');
    async function getDownloadVideoUrl() {
        const res = await ApiDownloader.getVideo(input);
        const videoUrl = res.result.video[0];

        await handleDownload(videoUrl);
    }

    async function handleDownload(url: string) {
        try {
            const response = await fetch(url);
            const videoBlob = await response.blob();
            const blobUrl = window.URL.createObjectURL(videoBlob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', `tiktksaver-${new Date().getTime()}.mp4`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);

        } catch (err) {
            console.error('Erro ao baixar o vídeo:', err);
        }

    }

    return (
        <div className="flex items-center justify-center h-screen">
            <div>
                <p className="text-2xl font-bold">BAIXE AGORA SEU VÍDEO TIKTOK</p>
                <div className="flex w-full max-w-sm items-center space-x-2">
                    <Input type="email" placeholder="URL TIKTOK VIDEO" onChange={(ev) => setInput(ev.target.value)} value={input} />
                    <Button type="submit" onClick={getDownloadVideoUrl}>DOWNLOAD</Button>
                </div>
            </div>
        </div>
    );
}

export default App;