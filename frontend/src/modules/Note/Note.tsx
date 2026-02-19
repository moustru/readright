import {
  Box,
  Button,
  Stack,
  Text,
  Title,
  type StackProps,
} from '@mantine/core';
import type { NoteProps } from './types';

export function Note({
  noteId,
  title,
  author,
  createdAt,
  deleteNote,
  ...props
}: NoteProps & StackProps & { deleteNote: (id: number) => void }) {
  return (
    <Stack gap={8} {...props} style={{ cursor: 'pointer' }}>
      <Box h={200} bg="gray"></Box>

      <Title order={4}>{title}</Title>

      <Text>Автор: {author}</Text>

      <Text>{createdAt}</Text>

      <Button color="red" w={100} onClick={() => deleteNote(noteId)}>
        Удалить
      </Button>
    </Stack>
  );
}
