import {
  ActionIcon,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { IconLogout, IconPlus } from '@tabler/icons-react';
import { Note } from '../modules/Note/Note';
import { useNavigate } from 'react-router';
import { fetchNotes, useDeleteNote, useNotes } from '../store/notes.store';
import { useLogout } from '../store/auth.store';
import Cookies from 'js-cookie';

export const Notes = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useNotes();

  const { mutate: deleteNote } = useDeleteNote({
    onSuccess: () => fetchNotes(),
  });

  const { mutate: logout } = useLogout({
    onSuccess: () => {
      Cookies.remove('accessToken');
      window.location.href = '/';
    },
  });

  const handleLogout = async () => {
    await logout();
  };

  const toNewNote = () => {
    navigate('/notes/new');
  };

  if (isLoading) {
    return (
      <Center>
        <Title order={1}>Loading...</Title>
      </Center>
    );
  }

  if (isError) {
    return (
      <Center>
        <Title order={1}>Error!</Title>
      </Center>
    );
  }

  return (
    <Container maw={1200}>
      <Flex
        bg={theme.colors.gray[1]}
        p={16}
        mb={16}
        justify="space-between"
        pos="sticky"
        top={0}
      >
        <Title order={1}>User name</Title>

        <Flex gap={8} align="center">
          <Button
            color="green"
            size="md"
            h={44}
            leftSection={<IconPlus />}
            onClick={toNewNote}
          >
            Добавить запись
          </Button>

          <ActionIcon
            variant="filled"
            color="red"
            size="xl"
            title="Выход"
            onClick={handleLogout}
          >
            <IconLogout />
          </ActionIcon>
        </Flex>
      </Flex>

      <Grid>
        {data?.map((note) => (
          <Grid.Col
            span={4}
            key={note.noteId}
            onClick={() => navigate('/notes/' + note.noteId)}
          >
            <Note {...note} deleteNote={deleteNote} />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
};
