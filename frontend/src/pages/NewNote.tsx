import { Container, Title } from '@mantine/core';
import { NoteForm } from '../shared/NoteForm';
import { useCreateNote } from '../store/notes.store';
import { useNavigate } from 'react-router';

export const NewNote = () => {
  const navigate = useNavigate();
  const { mutate: createNote, isPending: isCreatingNotePending } =
    useCreateNote({ onSuccess: () => navigate('/') });

  return (
    <Container>
      <Title order={2} mt={32}>
        Новая запись
      </Title>

      <NoteForm
        saveChanges={(note) => createNote({ author: 'moustru', ...note })}
        cancel={() => navigate('/')}
        pendingState={isCreatingNotePending}
      />
    </Container>
  );
};
