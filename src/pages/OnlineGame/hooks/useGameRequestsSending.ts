import { useMutation, useQuery } from 'react-query';
import { requestService } from '@services/request.service';
import { CreateRequestInput, RequestType, RequestModel } from '@services/types';
import { useCallback, useEffect } from 'react';
import { Unsubscribe } from 'firebase/firestore';
import { queryClient } from '@src/queryClient';
import { showNotification } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { mantineColors } from '@common/colors';

export interface HookArgs {
  gameId: string;
  userId: string;
  opponentId?: string;
  onNewAcceptedRequest?: (type: RequestType) => void;
}

export const useGameRequestsSending = ({
  gameId,
  userId,
  opponentId,
  onNewAcceptedRequest: onNewAcceptedRequestCb,
}: HookArgs) => {
  const { t } = useTranslation();
  const { data: sentRequests } = useQuery(['sentRequests', gameId], () => requestService.getSentRequests(gameId));
  const { mutateAsync: createRequestMutation } = useMutation((input: CreateRequestInput) =>
    requestService.create(input)
  );
  const { mutateAsync: acknowledgeResponse } = useMutation((id: string) => requestService.acknowledgeResponse(id));

  const getIsActiveRequest = useCallback(
    (requestType: RequestType) => {
      return sentRequests?.reduce((result: boolean, { type, declinedAt, acceptedAt }) => {
        if (type === requestType && !declinedAt && !acceptedAt) {
          return true;
        }
        return result;
      }, false);
    },
    [sentRequests]
  );

  const getDeclineMessage = useCallback(
    (type: RequestType) => {
      switch (type) {
        case 'draw':
          return t('requestsModals.drawDeclinedContent');
        case 'undoMove':
          return t('requestsModals.undoDeclinedContent');
        default:
          return t('requestsModals.defaultDeclinedContent');
      }
    },
    [t]
  );

  const onNewDeclinedRequest = useCallback(
    async ({ id, type }: RequestModel) => {
      await acknowledgeResponse(id);
      showNotification({ id, message: getDeclineMessage(type), autoClose: 3000, color: mantineColors.decline });
    },
    [acknowledgeResponse, getDeclineMessage]
  );

  const onNewAcceptedRequest = useCallback(
    async ({ id, type }: RequestModel) => {
      onNewAcceptedRequestCb?.(type);
      await acknowledgeResponse(id);
    },
    [acknowledgeResponse, onNewAcceptedRequestCb]
  );

  useEffect(() => {
    let unsub: Unsubscribe;
    (async () => {
      unsub = await requestService.onSentRequestsUpdated(gameId, (data) => {
        data.forEach((request) => {
          if (request.responseAckAt) return;

          if (request.declinedAt) {
            onNewDeclinedRequest(request);
          }
          if (request.acceptedAt) {
            onNewAcceptedRequest(request);
          }
        });
        queryClient.setQueryData(['sentRequests', gameId], data);
      });
    })();

    return () => unsub?.();
  }, [gameId, onNewAcceptedRequest, onNewDeclinedRequest]);

  const createRequest = useCallback(
    async (requestType: RequestType) => {
      if (!opponentId) return;

      await createRequestMutation({
        gameId,
        type: requestType,
        senderId: userId,
        receiverId: opponentId,
      });
    },
    [createRequestMutation, gameId, opponentId, userId]
  );

  return {
    createRequest,
    isActiveDrawRequest: getIsActiveRequest('draw'),
    isActiveUndoRequest: getIsActiveRequest('undoMove'),
  };
};
