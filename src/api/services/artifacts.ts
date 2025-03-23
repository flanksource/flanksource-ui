import { ArtifactAPI } from "../axios";

export async function downloadArtifact(artifactId: string) {
  const response = await ArtifactAPI.get(`/download/${artifactId}`, {
    responseType: "text"
  });
  return response.data;
}
