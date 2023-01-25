import { Card } from '@mantine/core';
import React from 'react';
import { TextProps } from '@mantine/core/lib/Text/Text';
import { Title } from './styled';

export interface SimpleCardProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  titleAlign?: TextProps['align'];
  className?: string;
}

export const SimpleCard: React.FC<SimpleCardProps> = ({
  children,
  title,
  titleAlign = 'center',
  className,
}) => {
  return (
    <Card withBorder className={className}>
      <Title size="md" align={titleAlign} weight="500">
        {title}
      </Title>

      {children}
    </Card>
  );
};
