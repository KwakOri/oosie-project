import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExercisesQueryKeys, mutationOptions, queryOptions } from './queries';

// 운동 기록 등록
export const useRegisterExercise = () => useMutation(mutationOptions.register);

// 운동 기록 수정
export const useUpdateExercise = () => useMutation(mutationOptions.update);

// 운동 북마크 목록 조회
export const useGetExerciseBookmarks = () => useQuery(queryOptions.getExercisesBookmarks());

// 운동 북마크 토글
export const useToggleBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    ...mutationOptions.toggleBookmark,
    onMutate: async (exerciseName: string) => {
      await queryClient.cancelQueries({ queryKey: ExercisesQueryKeys.bookmark() });

      const previousBookmarks = queryClient.getQueryData(ExercisesQueryKeys.bookmark());

      queryClient.setQueryData(ExercisesQueryKeys.bookmark(), (old: any) => {
        if (Array.isArray(old)) {
          const exerciseIndex = old.findIndex((exercise) => exercise.exerciseName === exerciseName);
          if (exerciseIndex !== -1) {
            return old.filter((_, index) => index !== exerciseIndex);
          } else {
            return [...old, { exerciseName }];
          }
        }
        return old;
      });

      return { previousBookmarks };
    },
    onSuccess: (data, exerciseName) => {
      queryClient.setQueryData(ExercisesQueryKeys.bookmark(), (old: any) => {
        if (Array.isArray(old)) {
          if (data.isBookmarked) {
            if (!old.some((exercise) => exercise.exerciseName === exerciseName)) {
              return [...old, { exerciseName }];
            }
          } else {
            return old.filter((exercise) => exercise.exerciseName !== exerciseName);
          }
        }
        return old;
      });
    },
    onError: (err, exerciseName, context) => {
      queryClient.setQueryData(ExercisesQueryKeys.bookmark(), context?.previousBookmarks);
      console.error('북마크 토글 실패:', err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ExercisesQueryKeys.bookmark() });
    },
  });
};
// 운동 완료 토글
export const useToggleCompleted = () => useMutation(mutationOptions.toggleCompleted);

export const useToggleComplete = () => useMutation(mutationOptions.toggleComplete);

// 운동 기록 항목
export const useGetExerciseRecord = (id: string) => useQuery(queryOptions.getExerciseRecord(id));

export const useGetExercises = (date: string) => {
  return useQuery(queryOptions.getExercises(date));
};

export const useDeleteExercises = () => useMutation(mutationOptions.deleteDiet);
