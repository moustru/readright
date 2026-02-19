import { Button, Flex, Stack, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

type NoteFormProps = {
  pendingState?: boolean;
  initialValues?: { title: string; content: string };
  saveChanges: (value: { title: string; content: string }) => void;
  cancel: () => void;
};

export const NoteForm = ({
  pendingState = false,
  initialValues = { title: '', content: '' },
  saveChanges,
  cancel,
}: NoteFormProps) => {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues,
  });

  const handleSaving = () => {
    saveChanges(form.getValues());
  };

  const handleCancel = () => {
    form.reset();
    cancel();
  };

  return (
    <Stack gap={8} mt={32}>
      <TextInput
        withAsterisk
        label="Название записи"
        key={form.key('title')}
        {...form.getInputProps('title')}
      />

      <Textarea
        label="Запись"
        autosize
        minRows={10}
        key={form.key('content')}
        {...form.getInputProps('content')}
      />

      <Flex mt={8} gap={8}>
        <Button color="green" onClick={handleSaving} loading={pendingState}>
          Сохранить
        </Button>
        <Button color="red" onClick={handleCancel}>
          Отмена
        </Button>
      </Flex>
    </Stack>
  );
};
