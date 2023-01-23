import React, { useState, useEffect } from 'react';
import { Modal, TextInput, Button, Flex } from '@mantine/core';
import { useMutation } from 'react-query';
import { CreateUserInput, GameModel } from '@services/types';
import { userService } from '@services/user.service';
import { TextInputWrapper, ButtonWrapper } from './styled';
import { queryClient } from '@src/queryClient';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from '@mantine/form';
import { required } from '@common/form/validators';

export interface NewUserJoinModalProps {
  noUser: boolean;
  game?: GameModel;
}

export const NewUserJoinModal: React.FC<NewUserJoinModalProps> = ({ noUser, game }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { i18n } = useTranslation();

  const form = useForm({
    initialValues: {
      userName: '',
    },
    validate: { userName: required },
  });

  const [isShowModal, setIsShowModal] = useState(false);

  const { mutateAsync: createUser, isLoading } = useMutation((input: CreateUserInput) =>
    userService.create(input)
  );

  const onSubmit = async (values: typeof form.values) => {
    if (!game || !values.userName) return;

    const user = await createUser({ name: values.userName, language: i18n.resolvedLanguage });

    queryClient.setQueryData('currentUser', user);
    setIsShowModal(false);
  };

  useEffect(() => {
    if (noUser) {
      setIsShowModal(true);
    }
  }, [noUser]);

  return (
    <Modal
      opened={isShowModal}
      onClose={() => navigate('/')}
      centered
      overlayOpacity={0.1}
      withCloseButton={false}
      title={t('joinModal.title')}
    >
      <form onSubmit={form.onSubmit(onSubmit)} noValidate>
        <Flex gap="xs">
          <TextInputWrapper>
            <TextInput
              required
              placeholder={t('userForm.name')}
              {...form.getInputProps('userName')}
              error={form.errors['userName']}
            />
          </TextInputWrapper>
          <ButtonWrapper>
            <Button variant="filled" type="submit" loading={isLoading} loaderPosition="center">
              {t('joinModal.start')}
            </Button>
          </ButtonWrapper>
        </Flex>
      </form>
    </Modal>
  );
};
