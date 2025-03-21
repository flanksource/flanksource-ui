import { ArtifactAPI } from "../axios";

export async function downloadArtifact(artifactId: string) {
  try {
    const response = await ArtifactAPI.get(`/download/${artifactId}`, {
      responseType: "text"
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching artifact content:", artifactId, error);
    return null;
  }
}
