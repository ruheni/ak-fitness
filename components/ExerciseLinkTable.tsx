import { Anchor, Button, Modal, Stack, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Exercise } from "@prisma/client";
import { useState } from "react";
import { useGetEffect } from "../hooks/useGetEffect";
import { NewWorkoutExercise } from "../types/types";
import WorkoutExerciseModal from "./WorkoutExerciseModal";

type Props = {
  initialWorkoutExercises?: NewWorkoutExercise[];
  onChange: (workoutExercises: NewWorkoutExercise[]) => void;
};

export const ExerciseLinkTable: React.FC<Props> = (props) => {
  //   const { data: session, status } = useSession();
  const exercises = useGetEffect<Exercise[]>(`/api/exercise`, []);
  const [opened, { open, close }] = useDisclosure(false);
  const [workoutExercises, setWorkoutExercises] = useState<
    NewWorkoutExercise[]
  >(props.initialWorkoutExercises ? props.initialWorkoutExercises : []);

  const rows = workoutExercises.map((workoutExercise) => (
    <tr key={workoutExercise.key}>
      <td>
        {
          exercises?.find((value) => value.id === workoutExercise.exerciseId)
            ?.name
        }
      </td>
      <td>{workoutExercise.sets}</td>
      <td>{workoutExercise.reps}</td>
      <td>{workoutExercise.restSeconds}</td>
      <td>
        <Anchor>Edit</Anchor> |{" "}
        <Anchor
          onClick={() => {
            unLinkExercise(workoutExercise.key);
          }}
        >
          Remove
        </Anchor>
      </td>
    </tr>
  ));

  const unLinkExercise = (key: string) => {
    setWorkoutExercises(workoutExercises.filter((value) => value.key !== key));
    props.onChange(workoutExercises.filter((value) => value.key !== key));
  };
  const linkExercise = (workoutExercise: NewWorkoutExercise) => {
    setWorkoutExercises(workoutExercises.concat([workoutExercise]));
    props.onChange(workoutExercises.concat([workoutExercise]));
  };

  return (
    <Stack>
      <Modal opened={opened} onClose={close} title="Link an Exercise">
        <WorkoutExerciseModal
          exercises={exercises}
          onSubmit={linkExercise}
          close={close}
        />
      </Modal>

      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Sets</th>
            <th>Reps</th>
            <th>Rest Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      <Button onClick={open} variant="default">
        Add Exercise
      </Button>
    </Stack>
  );
};
