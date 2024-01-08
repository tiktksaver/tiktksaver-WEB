import React from 'react';
import './globals.css';
import { ApiDownloader, ApiResponse, VideoData } from '../services/Api';
import { t } from '../services/Translate';

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ThumbsUp, Eye, MessageCircle, Play, Globe2, ChevronDown, ClipboardPaste, Check } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../components/ui/dialog";
// import LinearProgress from '@mui/material/LinearProgress';

import { Progress } from "../components/ui/progress";

export default function Home() {
    const [input, setInput] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [data, setData] = React.useState<ApiResponse>();
    const [video, setVideo] = React.useState('');
    const [fullHDVideo, setFullHDVideo] = React.useState('');
    const [music, setMusic] = React.useState<VideoData['music']>();
    const [error, setError] = React.useState(false);
    const [pasted, setPaste] = React.useState(false);
    const [progress, setProgress] = React.useState(0);

    const [debug, setDebug] = React.useState(false);

    async function getDownloadVideoUrl() {
        setDebug(true);
        setLoading(true);
        try {
            const res = await ApiDownloader.getVideo(input);
            setProgress(37);
            const response = await ApiDownloader.getHDVideo(input);

            for (const videoString of res.result.video) {
                if (videoString.includes("cc=3") || videoString.includes("cc=4")) {
                    setProgress(83);
                    setTimeout(() => {
                        setProgress(100);
                    }, 2000);
                    return setTimeout(() => {
                        setData(res);
                        setVideo(videoString);
                        setMusic(res.result.music);
                        setFullHDVideo(response.result.video_hd);
                    }, 3000);
                }
            }

            if (!video || !data) {
                getDownloadVideoUrl();
            }
        } catch {
            setLoading(false);
            // setInput('');
            setError(true);
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

    function getTranslate(locale: string) {
        t.setLocale(locale);
        window.location.reload();
    }

    return (
        <>
            <nav className="inset-x-0 top-0 z-10 w-full px-4 py-1 bg-white shadow-md border-slate-500 dark:bg-[#0c1015] transition duration-700 ease-out">
                <div className="flex justify-between p-4">
                    <div className="text-[2rem] leading-[3rem] tracking-tight font-bold text-black dark:text-white cursor-pointer"
                        onClick={() => {
                            setData(undefined);
                            setVideo('');
                            setInput('');
                            setFullHDVideo('');
                            setError(false);
                            setProgress(-15);
                            setLoading(false);
                        }}>
                        TikTkSaver
                    </div>
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className='flex flex-row gap-1'>
                                    <Globe2 className='h-5 w-5' />
                                    <ChevronDown className='h-3 w-3' />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>{t.translate('TRANSLATE_LABEL')}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => getTranslate('pt')}>
                                    {t.translate('PT')}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => getTranslate('en')}>
                                    {t.translate('EN')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </nav>
            <div className='flex bg-gradient-to-r from-cyan-500 to-blue-500 w-10/12 rounded-xl h-96 m-auto items-center justify-center mt-10 bg-white shadow-md'>
                {!data ?
                    <div className="flex items-center justify-center w-10/12">
                        <div className='w-10/12'>
                            <p className="text-4xl font-bold text-white">{t.translate('TIKTOK_DOWNLOAD_INPUT_LABEL')}</p>
                            <div className="flex w-full max-w items-center space-x-2">
                                <Button disabled={loading} type="submit" variant={'outline'} onClick={async () => {
                                    setInput(await navigator.clipboard.readText()); setPaste(true);
                                }} onMouseLeave={() => setPaste(false)}>
                                    {pasted ? <Check/> : <ClipboardPaste />}
                                </Button>
                                <Input className={error ? 'border-red-600 focus-visible:ring-transparent ring-offset-transparent' : 'border-0 focus-visible:ring-transparent ring-offset-transparent'} required disabled={loading} type="text" placeholder={t.translate(!error ? 'TIKTOK_DOWNLOAD_INPUT_PLACEHOLDER' : 'TIKTOK_DOWNLOAD_INPUT_ERROR')} onChange={(ev) => setInput(ev.target.value)} value={input} />
                                <Button disabled={loading} type="submit" onClick={getDownloadVideoUrl}>
                                    {loading ?
                                        <>
                                            <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                                            </svg>
                                            Loading...
                                        </>
                                        : 'DOWNLOAD'}
                                </Button>
                            </div>
                            <Progress value={progress} className={!loading ? 'hidden' : 'mt-2 h-3'}/>
                            {debug && (<div>URL: {input}</div>)}
                        </div>
                    </div>
                    :
                    <div className="flex items-center justify-center">
                        <div className="flex items-center justify-center gap-6 flex-row flex-wrap">
                            <div className="flex justify-center cursor-pointer" onClick={handleClick}>
                                <Play className="h-20 w-20 fixed self-center z-50 opacity-100 hover:opacity-80" fill="white" stroke='white' />
                                <div className='h-64 w-64 fixed bg-black opacity-15 rounded-3xl' />
                                <img className="object-fill h-64 w-64 rounded-3xl cursor-pointer" src={data.result.dynamicCover[0]} />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <Button variant="link" onClick={handleClick} className="text-2xl text-white max-w-prose font-light">{data.result.description.split('#')[0]}</Button>
                                <div className='flex justify-center gap-1'>
                                    <Button variant="default" size="icon" className="flex w-full px-20 hover:bg-primary cursor-default gap-2" >
                                        <ThumbsUp className="h-4 w-4" />
                                        <p className="font-bold">{data.result.statistics.likeCount.toLocaleString('pt-BR', { style: 'decimal', maximumFractionDigits: 2 })}</p>
                                    </Button>
                                    <Button variant="default" size="icon" className="flex w-full px-20 hover:bg-primary cursor-default gap-2">
                                        <Eye className="h-4 w-4" />
                                        <p className="font-bold">{data.result.statistics.playCount.toLocaleString('pt-BR', { style: 'decimal', maximumFractionDigits: 2 })}</p>
                                    </Button>
                                    <Button variant="default" size="icon" className="flex w-full px-20 hover:bg-primary cursor-default gap-2">
                                        <MessageCircle className="h-4 w-4" />
                                        <p className="font-bold">{data.result.statistics.commentCount.toLocaleString('pt-BR', { style: 'decimal', maximumFractionDigits: 2 })}</p>
                                    </Button>
                                </div>
                                <div className="flex w-full max-w-items-center justify-center">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="flex w-full" variant="outline" onClick={() => handleDownloadFullHDVideo()}>Save FULL HD Video (.mp4)</Button>
                                        </DialogTrigger>
                                        <DialogContent className="w-96">
                                            <DialogHeader>
                                                <DialogTitle>O download começará automaticamente, por favor espere um momento.</DialogTitle>
                                                <DialogDescription>
                                                    Dependendo da sua internet pode demorar alguns minutos.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter className="sm:justify-start">
                                                <DialogClose asChild>
                                                    <Button type="button" variant="secondary" className="w-full">
                                                        Close
                                                    </Button>
                                                </DialogClose>
                                            </DialogFooter>
                                            {/* <LinearProgress /> */}
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <div className="flex w-full max-w-items-center justify-center">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="flex w-full" variant="outline" onClick={() => handleDownloadVideo()}>Save HD Video (.mp4)</Button>
                                        </DialogTrigger>
                                        <DialogContent className="w-96">
                                            <DialogHeader>
                                                <DialogTitle>O download começará automaticamente, por favor espere um momento.</DialogTitle>
                                                <DialogDescription>
                                                    Dependendo da sua internet pode demorar alguns minutos.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter className="sm:justify-start">
                                                <DialogClose asChild>
                                                    <Button type="button" variant="secondary" className="w-full">
                                                        Close
                                                    </Button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <div className="flex w-full max-w-items-center justify-center">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="flex w-full" variant="outline" onClick={() => handleDownloadMusic()}>Save Music (.mp3)</Button>
                                        </DialogTrigger>
                                        <DialogContent className="w-96">
                                            <DialogHeader>
                                                <DialogTitle>O download começará automaticamente, por favor espere um momento.</DialogTitle>
                                                <DialogDescription>
                                                    Dependendo da sua internet pode demorar alguns minutos.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter className="sm:justify-start">
                                                <DialogClose asChild>
                                                    <Button type="button" variant="secondary" className="w-full">
                                                        Close
                                                    </Button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <div className="flex w-full max-w-items-center justify-center">
                                    <Button className="flex w-full" variant="outline"
                                        onClick={() => {
                                            setData(undefined);
                                            setVideo('');
                                            setInput('');
                                            setFullHDVideo('');
                                            setError(false);
                                            setProgress(-15);
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