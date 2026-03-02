import { Center, Stack, Tabs, Title } from '@mantine/core';
import { useState } from 'react';
import { useLogin, useRegister } from '../store/auth.store';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';
import type { AxiosResponse } from 'axios';
import type { AuthResponse, UserAuthRequest } from '../modules/User/types';
import { AuthForm } from '../shared/AuthForm';

export function LoginPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string | null>('login');

  const handleSuccessAuth = (data: AxiosResponse<AuthResponse>) => {
    Cookies.set('accessToken', data!.data.data.accessToken);
    navigate('/notes');
  };

  const { mutate: loginUser, isPending: isPendingLoginUser } = useLogin({
    onSuccess: (data) => handleSuccessAuth(data!),
  });

  const { mutate: registerUser, isPending: isPendingRegisterUser } =
    useRegister({
      onSuccess: (data) => handleSuccessAuth(data!),
    });

  const login = async (data: UserAuthRequest) => {
    await loginUser(data);
  };

  const register = async (data: UserAuthRequest) => {
    await registerUser(data);
  };

  return (
    <Stack gap={64}>
      <Title mt={32} order={1} style={{ textAlign: 'center' }}>
        Добро пожаловать в readright
      </Title>
      <Center>
        <Tabs value={activeTab} onChange={setActiveTab} w={300}>
          <Tabs.List mb={32} grow>
            <Tabs.Tab value="login">Вход</Tabs.Tab>

            <Tabs.Tab value="registration">Регистрация</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="login" keepMounted={false}>
            <AuthForm submit={login} isPending={isPendingLoginUser} />
          </Tabs.Panel>

          <Tabs.Panel value="registration" keepMounted={false}>
            <AuthForm submit={register} isPending={isPendingRegisterUser} />
          </Tabs.Panel>
        </Tabs>
      </Center>
    </Stack>
  );
}
