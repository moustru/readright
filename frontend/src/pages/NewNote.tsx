import { Container, Title } from '@mantine/core';
import { NoteForm } from '../shared/NoteForm';
import { fetchNotes, useCreateNote } from '../store/notes.store';
import { useNavigate } from 'react-router';

export const NewNote = () => {
  const navigate = useNavigate();
  const { mutate: createNote, isPending: isCreatingNotePending } =
    useCreateNote({
      onSuccess: async () => {
        await fetchNotes();
        navigate('/');
      },
    });

  return (
    <Container>
      <Title order={2} mt={32}>
        Новая запись
      </Title>

      <NoteForm
        saveChanges={createNote}
        cancel={() => navigate('/')}
        pendingState={isCreatingNotePending}
      />
    </Container>
  );
};
