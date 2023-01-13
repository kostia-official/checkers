import React, { useState, useEffect } from 'react';
import { Modal, TextInput, Button, Flex } from '@mantine/core';
import { useMutation } from 'react-query';
import { CreateUserInput, GameModel } from '@services/types';
import { userService } from '@services/user.service';
import { TextInputWrapper, ButtonWrapper } from './styled';
import { queryClient } from '@src/queryClient';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export interface NewUserJoinModalProps {
  noUser: boolean;
  game?: GameModel;
}

export const NewUserJoinModal: React.FC<NewUserJoinModalProps> = ({ noUser, game }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isShowModal, setIsShowModal] = useState(false);
  const [userName, setUserName] = useState<string | undefined>();

  const { mutateAsync: createUser } = useMutation((input: CreateUserInput) => userService.create(input));

  const onJoinGameClick = async () => {
    if (!game || !userName) return;

    const user = await createUser({ name: userName });

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
      <Flex gap="xs">
        <TextInputWrapper>
          <TextInput
            required
            placeholder={t('userForm.name')}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </TextInputWrapper>
        <ButtonWrapper>
          <Button variant="filled" onClick={onJoinGameClick}>
            {t('joinModal.start')}
          </Button>
        </ButtonWrapper>
      </Flex>
    </Modal>
  );
};
