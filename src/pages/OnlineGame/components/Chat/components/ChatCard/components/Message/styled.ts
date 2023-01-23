import styled from 'styled-components';

export const MessageCard = styled.div<{ isOwnUser: boolean }>`
  word-break: break-all;
  width: 100%;
  padding: 6px 12px;
  border-radius: 16px;
  background-color: ${(p) => (p.isOwnUser ? p.theme.colors.gray[3] : p.theme.colors.gray[1])};

  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const Sender = styled.div`
  font-weight: 500;
  font-size: 12px;
  padding-top: 2px;
  line-height: 12px;
`;
