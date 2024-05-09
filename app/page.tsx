"use client";
import PomodoroTimer from './components/PomodoroTimer';
import { ChakraProvider } from '@chakra-ui/react'

const Home = () => {
  return (
    <ChakraProvider>
      <PomodoroTimer />
    </ChakraProvider>
  );
};

export default Home;
