// services/apiService.ts
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export interface UploadResponse {
  message: string;
  response: {
    file_id: string;
    file_hash: string;
  };
}

export interface ImageDetailsResponse {
  message: string;
  response: {
    url: string;
    [key: string]: any;
  };
}

export class ApiService {
  private static instance: ApiService;

  private constructor() {}

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  /**
   * Upload an image file to the server
   */
  async uploadImage(file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${API_BASE_URL}/upload-image`, {
        method: "POST",
        body: formData
        // Don't set Content-Type header - let the browser set it with boundary for FormData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  /**
   * Upload an image from base64 data
   */
  async uploadImageFromBase64(
    base64Data: string,
    filename: string = "image.jpg"
  ): Promise<UploadResponse> {
    try {
      // Convert base64 to blob
      const response = await fetch(base64Data);
      const blob = await response.blob();

      // Create a File object from the blob
      const file = new File([blob], filename, { type: blob.type });

      return await this.uploadImage(file);
    } catch (error) {
      console.error("Error uploading base64 image:", error);
      throw error;
    }
  }

  /**
   * Get image details by ID
   */
  async getImageDetails(imageId: string): Promise<ImageDetailsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/get-image`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ img_id: imageId })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching image details:", error);
      throw error;
    }
  }

  /**
   * Get the direct URL for an image by ID
   */
  getImageUrl(imageId: string): string {
    const PINATA_GATEWAY =
      import.meta.env.VITE_PINATA_GATEWAY || "gateway.pinata.cloud";
    return `https://${PINATA_GATEWAY}/ipfs/${imageId}`;
  }
}

// Export singleton instance
export const apiService = ApiService.getInstance();
