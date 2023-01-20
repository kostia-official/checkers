import { GameModel, RequestType } from '@services/types';
import { useEffect, useCallback } from 'react';
import { queryClient } from '@src/queryClient';
import { requestService } from '@services/request.service';
import { useQuery, useMutation } from 'react-query';
import { Unsubscribe } from 'firebase/firestore';
import { hideNotification, showNotification } from '@mantine/notifications';
import i18next from 'i18next';
import { RequestNotificationContent } from '@components/RequestNotificationContent';
import { mantineColors } from '@common/colors';

export interface HookArgs {
  game: GameModel;
}

const notificationText: Record<RequestType, string> = {
  draw: i18next.t('requestsModals.drawContent'),
  undoMove: i18next.t('requestsModals.undoContent'),
};

export const useGameRequestsReceiving = ({ game }: HookArgs) => {
  const { data: receivedRequests } = useQuery(['receivedRequests', game.id], () =>
    requestService.getReceivedRequests(game.id)
  );
  const { mutateAsync: acceptRequest } = useMutation((id: string) => requestService.accept(id));
  const { mutateAsync: declineRequest } = useMutation((id: string) => requestService.decline(id));

  useEffect(() => {
    let unsub: Unsubscribe;

    (async () => {
      unsub = await requestService.onReceivedRequestsUpdated(game.id, (data) => {
        queryClient.setQueryData(['receivedRequests', game.id], data);
      });
    })();

    return () => unsub?.();
  }, [game.id]);

  const showRequestNotification = useCallback(
    (id: string, requestType: RequestType) => {
      showNotification({
        id,
        color: mantineColors.warning,
        autoClose: false,
        message: (
          <RequestNotificationContent
            text={notificationText[requestType]}
            onAccept={async () => {
              hideNotification(id);
              await acceptRequest(id);
            }}
            onDecline={async () => {
              hideNotification(id);
              await declineRequest(id);
            }}
          />
        ),
        disallowClose: true,
      });
    },
    [acceptRequest, declineRequest]
  );

  useEffect(() => {
    receivedRequests?.forEach(({ id, acceptedAt, declinedAt, type }) => {
      if (acceptedAt || declinedAt) return;

      showRequestNotification(id, type);
    });
  }, [receivedRequests, showRequestNotification]);

  return { receivedRequests };
};
