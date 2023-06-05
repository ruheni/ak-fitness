// pages/drafts.tsx

import { Alert, Anchor, Group, Loader, Stack, Title } from "@mantine/core";
import { User, Workout } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import React from "react";
import { AuthAdminRequired } from "../components/AuthAdminRequired";
import { useGetEffect } from "../hooks/useGetEffect";
import prisma from "../lib/prisma";
import { nextAuthOptions } from "./api/auth/[...nextauth]";
import { WorkoutEdit } from "../components/WorkoutEdit";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, nextAuthOptions);
  if (!session) {
    res.statusCode = 403;
    return { props: { exercises: [] } };
  }

  const workouts = await prisma.workout.findMany({
    include: {
      workoutExercises: true,
    },
  });
  return {
    props: { workouts },
  };
};

type Props = {
  workouts: Workout[];
};

const Workouts: React.FC<Props> = (props) => {
  const { data: session, status } = useSession({ required: true });
  const me = useGetEffect<User>("/api/user/me", [session]);

  if (status === "loading" || !session || !me) {
    return <Loader />;
  }

  if (!me.isGlobalAdmin) {
    return <AuthAdminRequired />;
  }

  return (
    <>
      <Title p="md">Workouts</Title>
      <Stack spacing="md">
        {props.workouts.map((workout) => (
          <div key={workout.id} className="workout">
            <WorkoutEdit workout={workout} />
          </div>
        ))}
        {props.workouts.length === 0 && (
          <Alert color="blue" variant="light">
            There are no workouts defined. Click Create Workout to start
          </Alert>
        )}
        <Group position="right">
          <Anchor href="/createWorkout">Create Workout</Anchor>
        </Group>
      </Stack>
    </>
  );
};

export default Workouts;
