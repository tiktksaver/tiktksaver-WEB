const backend_endpoint = process.env.BACKEND_ENDPOINT;

class TiktokDownloader {

    getHeaders(contentType?: string) {
        const headers = new Headers();

        if (contentType) {
            headers.set("Content-Type", contentType);
        }

        return headers;
    }

    async getVideo(url: string) {
        const res = await fetch(`${backend_endpoint}/api/v2/download/tiktok`, {
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