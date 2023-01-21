import { useCallback } from 'react';
import { firebaseClient } from '@common/firebase';
import { userService } from '@services/user.service';
import { UserModel, UpdateUserInput } from '@services/types';
import { useMutation } from 'react-query';

export interface HookArgs {
  user: UserModel;
}

export const useUpdatePushToken = ({ user }: HookArgs) => {
  const { mutateAsync: updateUser } = useMutation((input: UpdateUserInput) => userService.update(input));

  const updatePushToken = useCallback(async () => {
    const pushToken = await firebaseClient.getPushToken();
    if (!pushToken) return;

    if (user && user.pushToken !== pushToken) {
      await updateUser({ pushToken });
    }
  }, [updateUser, user]);

  return { updatePushToken };
};
