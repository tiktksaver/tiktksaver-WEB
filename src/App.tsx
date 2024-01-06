import React, { useState } from 'react';
import './App.css';
import { Button } from "./@/components/ui/button";
import { Input } from "./@/components/ui/input";
import { ApiDownloader, ApiResponse } from './services/Api';

function App() {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ApiResponse>();
    const [video, setVideo] = useState('');

    async function getDownloadVideoUrl() {
        setLoading(true);
        const res = await ApiDownloader.getVideo(input);

        for (const videoString of res.result.video) {
            if (videoString.includes("cc=3") || videoString.includes("cc=4")) {
                setData(res);
                setVideo(videoString);
                return;
            }

            getDownloadVideoUrl();
        }
    }

    async function handleDownload(url: string) {
        try {
            const response = await fetch(url);
            setLoading(false);
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
        <>
            {!data ?
                <div className="flex items-center justify-center h-screen">
                    <div>
                        <p className="text-2xl font-bold">BAIXE AGORA SEU VÍDEO TIKTOK</p>
                        {!loading ?
                            <div className="flex w-full max-w-sm items-center space-x-2">
                                <Input type="email" placeholder="URL TIKTOK VIDEO" onChange={(ev) => setInput(ev.target.value)} value={input} />
                                <Button type="submit" onClick={getDownloadVideoUrl}>DOWNLOAD</Button>
                            </div>
                            :
                            <div className="flex w-full max-w-sm items-center space-x-2">
                                <Input disabled type="email" placeholder="URL TIKTOK VIDEO" onChange={(ev) => setInput(ev.target.value)} value={input} />
                                <Button disabled type="submit" onClick={getDownloadVideoUrl}>DOWNLOAD</Button>
                            </div>
                        }
                    </div>
                </div>
                :
                <div className="flex items-center justify-center h-screen">
                    <div className="flex flex-col items-center justify-center w-1/2 h-1/2 gap-5">
                        <div className="flex justify-center w-3/6">
                            <div className="text-center">
                                <p className="text-2xl font-bold">{data.result.description.split('#')[0]}</p>
                                <div className="flex justify-center items-center">
                                    <img className="inline-block h-6 w-6 rounded-xl ring-2 ring-white" src={data.result.author.avatarMedium[0]}/>
                                    <p className="text-2xl font-bold">@{data.result.author.username}</p>
                                </div>
                            </div>
                            <img className="object-fill h-96 w-42 rounded" src={data.result.cover[1]}/>
                        </div>
                        <div className="flex w-full max-w-items-center justify-center">
                            <Button className="flex w-full" variant="outline" onClick={() => handleDownload(video)}>SALVAR</Button>
                        </div>
                        <div className="flex w-full max-w-items-center justify-center">
                            <Button className="flex w-full" variant="outline"
                                onClick={() => {
                                    setData(undefined);
                                    setVideo('');
                                    setInput('');
                                }}>FAZER DOWNLOAD DE OUTRO VÍDEO</Button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

export default App;