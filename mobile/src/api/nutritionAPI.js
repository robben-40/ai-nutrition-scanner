const BASE_URL = "http://192.168.0.185:8000";

export const scanFood = async (imageUri) => {
  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    type: "image/jpeg",
    name: "food.jpg",
  });

  try{
    const response = await fetch(`${BASE_URL}/scan`, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    });

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || "Could not detect food");
    }

    return data;

  } catch (error){
    console.error("Upload Error", error)
    throw new Error(error.message || "Network error");
  }
};