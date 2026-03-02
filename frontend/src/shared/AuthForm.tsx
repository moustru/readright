import { Button, PasswordInput, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

export function AuthForm({
  submit,
  isPending,
}: {
  submit: ({ name, password }: { name: string; password: string }) => void;
  isPending: boolean;
}) {
  const form = useForm<{ name: string; password: string }>({
    mode: 'uncontrolled',
  });

  const handleSubmit = () => {
    submit(form.getValues());
  };

  return (
    <Stack>
      <TextInput
        withAsterisk
        label="Логин"
        key={form.key('name')}
        {...form.getInputProps('name')}
      />
      <PasswordInput
        withAsterisk
        label="Пароль"
        key={form.key('password')}
        {...form.getInputProps('password')}
      />

      <Button onClick={handleSubmit} loading={isPending}>
        Вход
      </Button>
    </Stack>
  );
}
