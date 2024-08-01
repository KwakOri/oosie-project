import api from '@/service/service';
import { DietType } from '@/types/diet';

export const dietsQueryKeys = {
  all: ['diet'] as const,
};

export const queryOptions = {
  getDiets: (date: string) => ({
    queryKey: [dietsQueryKeys.all, date], // TODO: refactoring 필요
    queryFn: async () => {
      const diets = await api.diet.getDietsByDate(date);
      if (!diets) throw new Error('Diet not found');
      return diets;
    },
  }),
};

export const mutationOptions = {
  submitDiet: {
    mutationFn: ({ id, date, dietType, foods }: DietType) => {
      if (id) {
        return api.diet.putDiet({ id, date, dietType, foods });
      } else {
        return api.diet.postDiet({ date, dietType, foods });
      }
    },
  },
};
