import { useNavigate, useParams } from 'react-router';
import { Button, Container, Stack, Text, Title } from '@mantine/core';
import { fetchNote, useNote, useUpdateNote } from '../store/notes.store';
import { IconArrowLeft } from '@tabler/icons-react';
import { useState } from 'react';
import { NoteForm } from '../shared/NoteForm';

export const NotePage = () => {
  const { id } = useParams();
  const { data } = useNote(+id!);
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);

  const { mutate: updateNote, isPending: isUpdatingNotePending } =
    useUpdateNote({
      onSuccess: () => {
        fetchNote(+id!);
        setEditMode(false);
      },
    });

  const enableEditMode = () => {
    setEditMode(true);
  };

  const toNotes = () => {
    navigate('/');
  };

  return (
    <Container>
      {!editMode && (
        <Button
          variant="transparent"
          leftSection={<IconArrowLeft />}
          my={16}
          onClick={toNotes}
        >
          Назад
        </Button>
      )}

      {editMode ? (
        <NoteForm
          pendingState={isUpdatingNotePending}
          initialValues={data}
          saveChanges={(note) =>
            updateNote({
              title: note.title,
              content: note.content,
              id: id!,
            })
          }
          cancel={() => setEditMode(false)}
        />
      ) : (
        <>
          <Stack gap={16} mb={32}>
            <Title order={1}>{data?.title}</Title>

            <Text size="lg">Автор: {data?.author}</Text>

            <Text size="lg">Написано: {data?.createdAt}</Text>

            <Text size="lg">Просмотров: {data?.views}</Text>
          </Stack>

          <Text mb={32}>{data?.content}</Text>
        </>
      )}

      {!editMode && (
        <Button color="cyan" onClick={enableEditMode}>
          Изменить
        </Button>
      )}
    </Container>
  );
};
