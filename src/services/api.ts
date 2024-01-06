const backend_endpoint = process.env.BACKEND_ENDPOINT;

class TiktokDownloader {
     async getVideo(url: string) {
      const res = await fetch(`http://localhost:4000/api/v1/download/tiktok`, {
          method: "POST",
          body: JSON.stringify({
            'url': url,
          })
      });

      return await res.json();
  }
}

export const ApiDownloader = new TiktokDownloader();