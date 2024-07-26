import { FoodType } from '@/types/diet';
import axios from 'axios';

class DietAPI {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/diets') {
    this.baseUrl = baseUrl;
  }

  // 회원가입
  postDiet = async (
    imageFiles: File[],
    dietType: string,
    foodForms: FoodType[],
  ): Promise<{ message: { message: string } }> => {
    try {
      const formData = new FormData();
      imageFiles.forEach((file: File) => {
        formData.append('imageFiles', file);
      });
      formData.append('dietType', dietType);
      formData.append('foodInfo', JSON.stringify(foodForms));

      const response = await axios.post(`${this.baseUrl}`, formData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || error.message);
      }
      throw error;
    }
  };
}

export default DietAPI;