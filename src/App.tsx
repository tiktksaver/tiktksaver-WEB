import React, { useState } from 'react';
import './App.css';
import { ApiDownloader, ApiResponse, VideoData } from './services/Api';

import { Button } from "./@/components/ui/button";
import { Input } from "./@/components/ui/input";
import { ThumbsUp, Eye, MessageCircle, Play } from 'lucide-react';

function App() {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ApiResponse>();
    const [video, setVideo] = useState('');
    const [fullHDVideo, setFullHDVideo] = useState('');
    const [music, setMusic] = useState<VideoData['music']>();

    async function getDownloadVideoUrl() {
        setLoading(true);
        const res = await ApiDownloader.getVideo(input);
        const response = await ApiDownloader.getHDVideo(input);

        for (const videoString of res.result.video) {
            if (videoString.includes("cc=3") || videoString.includes("cc=4")) {
                setData(res);
                setVideo(videoString);
                setMusic(res.result.music);
                setFullHDVideo(response.result.video_hd);
                return;
            }
        }

        if (!video || !data) {
            getDownloadVideoUrl();
        }
    }
    async function handleDownloadVideo() {
        try {
            const response = await fetch(video);
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

    async function handleDownloadMusic() {
        try {
            if (!music) return;
            const response = await fetch(music.playUrl[0]);
            setLoading(false);
            const videoBlob = await response.blob();
            const blobUrl = window.URL.createObjectURL(videoBlob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', `tiktksaver-${music.title}-${new Date().getTime()}.mp3`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error('Erro ao baixar o vídeo:', err);
        }
    }

    async function handleDownloadFullHDVideo() {
        window.location.href = fullHDVideo;
    }

    async function handleClick() {
        window.open(input, '_blank');
    }

    return (
        <>
            <nav
                className="inset-x-0 top-0 z-10 w-full px-4 py-1 bg-white shadow-md border-slate-500 dark:bg-[#0c1015] transition duration-700 ease-out"
            >
                <div className="flex justify-between p-4">
                    <div className="text-[2rem] leading-[3rem] tracking-tight font-bold text-black dark:text-white">
				TikTkSaver
                    </div>
                </div>
            </nav>
            <div className='flex bg-gradient-to-r from-cyan-500 to-blue-500 w-10/12 rounded-xl h-96 m-auto items-center justify-center mt-10 bg-white shadow-md'>
                {!data ?
                    <div className="flex items-center justify-center w-10/12">
                        <div className='w-10/12'>
                            <p className="text-2xl font-bold text-stone-50">BAIXE AGORA SEU VÍDEO TIKTOK</p>
                            {!loading ?
                                <div className="flex w-full max-w items-center space-x-2">
                                    <Input type="email" placeholder="URL TIKTOK VIDEO" onChange={(ev) => setInput(ev.target.value)} value={input}/>
                                    <Button type="submit" onClick={getDownloadVideoUrl}>DOWNLOAD</Button>
                                </div>
                                :
                                <div className="flex w-full max-w items-center space-x-2">
                                    <Input disabled type="email" placeholder="URL TIKTOK VIDEO" onChange={(ev) => setInput(ev.target.value)} value={input} />
                                    <Button disabled type="submit" onClick={getDownloadVideoUrl}>DOWNLOAD</Button>
                                </div>
                            }
                        </div>
                    </div>
                    :
                    <div className="flex items-center justify-center">
                        <div className="flex items-center justify-center gap-6 flex-row flex-wrap">
                            <div className="flex justify-center cursor-pointer" onClick={handleClick}>
                                <Play className="h-20 w-20 fixed self-center z-50 opacity-100 hover:opacity-80" fill="white" stroke='white'/>
                                <div className='h-64 w-64 fixed bg-black opacity-15 rounded-3xl'/>
                                <img className="object-fill h-64 w-64 rounded-3xl cursor-pointer" src={data.result.dynamicCover[0]}/>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <Button variant="link" onClick={handleClick} className="text-2xl text-stone-50 max-w-prose font-light">{data.result.description.split('#')[0]}</Button>
                                <div className='flex justify-center gap-1'>
                                    <Button variant="default" size="icon" className="flex w-full px-20 hover:bg-primary cursor-default" >
                                        <ThumbsUp className="h-4 w-4" />
                                        <p className="font-bold">{data.result.statistics.likeCount}</p>
                                    </Button>
                                    <Button variant="default" size="icon" className="flex w-full px-20 hover:bg-primary cursor-default">
                                        <Eye className="h-4 w-4" />
                                        <p className="font-bold">{data.result.statistics.playCount}</p>
                                    </Button>
                                    <Button variant="default" size="icon" className="flex w-full px-20 hover:bg-primary cursor-default">
                                        <MessageCircle className="h-4 w-4" />
                                        <p className="font-bold">{data.result.statistics.commentCount}</p>
                                    </Button>
                                </div>
                                <div className="flex w-full max-w-items-center justify-center">
                                    <Button className="flex w-full" variant="outline" onClick={() => handleDownloadFullHDVideo()}>Save FULL HD Video (.mp4)</Button>
                                </div>
                                <div className="flex w-full max-w-items-center justify-center">
                                    <Button className="flex w-full" variant="outline" onClick={() => handleDownloadVideo()}>Save HD Video (.mp4)</Button>
                                </div>
                                <div className="flex w-full max-w-items-center justify-center">
                                    <Button className="flex w-full" variant="outline" onClick={() => handleDownloadMusic()}>Save Music (.mp3)</Button>
                                </div>
                                <div className="flex w-full max-w-items-center justify-center">
                                    <Button className="flex w-full" variant="outline"
                                        onClick={() => {
                                            setData(undefined);
                                            setVideo('');
                                            setInput('');
                                            setLoading(false);
                                        }}>Download another video</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    );
}

export default App;