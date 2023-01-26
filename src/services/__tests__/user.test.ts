/**
 * @jest-environment node
 */

import { CreateUserInput } from '../types';
import 'firebase/firestore';
import { assertSucceeds } from '@firebase/rules-unit-testing';
import { userService } from '../user.service';

describe('User service', () => {
  it('should create a user and return it', async () => {
    const input: CreateUserInput = { name: 'Kostia', language: 'en' };
    const user = await assertSucceeds(userService.create(input));

    expect(user).toEqual({
      ...input,
      id: expect.any(String),
      createdAt: expect.any(Date),
    });
  });
});
