const backend_endpoint = process.env.BACKEND_ENDPOINT;

interface Author {
    uid: string;
    username: string;
    nickname: string;
    signature: string;
    region: string;
    avatarThumb: string[];
    avatarMedium: string[];
    url: string;
  }

  interface Statistics {
    playCount: number;
    downloadCount: number;
    shareCount: number;
    commentCount: number;
    likeCount: number;
    favoriteCount: number;
    forwardCount: number;
    whatsappShareCount: number;
    loseCount: number;
    loseCommentCount: number;
  }

  interface VideoData {
    type: string;
    id: string;
    createTime: number;
    description: string;
    hashtag: string[];
    duration: string;
    author: Author;
    statistics: Statistics;
    video: string[];
    cover: string[];
    dynamicCover: string[];
    originCover: string[];
    music: {
      id: number;
      title: string;
      author: string;
      album: string;
      playUrl: string[];
      coverLarge: string[];
      coverMedium: string[];
      coverThumb: string[];
      duration: number;
    };
  }

  interface ApiResponse {
    status: string;
    result: VideoData;
  }

class TiktokDownloader {

    getHeaders(contentType?: string) {
        const headers = new Headers();

        if (contentType) {
            headers.set("Content-Type", contentType);
        }

        return headers;
    }

    async getVideo(url: string): Promise<ApiResponse> {
        const res = await fetch(`${backend_endpoint}/api/v2/download/tiktok`, {
            method: "POST",
            headers: this.getHeaders('application/json'),
            body: JSON.stringify({
                'url': url,
            }),

        });

        return await res.json();
    }

    async getHDVideo(url: string) {
        const res = await fetch(`${backend_endpoint}/api/v3/download/tiktok`, {
            method: "POST",
            headers: this.getHeaders('application/json'),
            body: JSON.stringify({
                'url': url,
            })
        });

        return await res.json();
    }
}

export const ApiDownloader = new TiktokDownloader();
export type { ApiResponse, VideoData };