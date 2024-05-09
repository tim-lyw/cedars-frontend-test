"use client";

import { useState, useRef, useEffect } from "react";
import useSound from 'use-sound';
import { ChevronDown } from 'react-feather';
import {
  Text,
  Box,
  Button,
  Stack,
  Tabs,
  TabList,
  Tab,
  Collapse,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import ProgressDisplay from './ProgressDisplay';

const buttonStyle = {
  fontSize: '2xl',
  fontWeight: '600',
  width: '380px',
  padding: '32px',
  borderRadius: '16px',
}

type CycleCount = {
  workCount: number,
  breakCount: number,
}

type TimerDurations = {
  workTime: number,
  breakTime: number,
}

export default function PomodoroTimer() {

  const [play] = useSound('/bell.wav');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [timerDurations, setTimerDurations] = useState<TimerDurations>({
    workTime: 25 * 60,
    breakTime: 5 * 60,
  })
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(tabIndex === 0 ? timerDurations.workTime : timerDurations.breakTime);
  const [cycleCount, setCycleCount] = useState<CycleCount>({
    workCount: 1,
    breakCount: 1,
  });

  useEffect(() => {
    if (timeRemaining === 0) {
      play();
      setCycleCount((prev) => {
        return tabIndex === 0
          ? { ...prev, workCount: prev.workCount + 1 }
          : { ...prev, breakCount: prev.breakCount + 1 };
      });
      clearInterval(intervalRef.current!);
      intervalRef.current = null;
      setIsTimerRunning(false);
      if (tabIndex === 0) autoStartBreak();
      if (tabIndex === 1) setTabIndex(0);
    }
  }, [timeRemaining]);

  useEffect(() => {
    if (tabIndex === 0) {
      setTimeRemaining(timerDurations.workTime);
    } else setTimeRemaining(timerDurations.breakTime);
  }, [tabIndex]);

  const startTimer = () => {
    setIsDropdownOpen(false);
    if (intervalRef.current !== null) return;
    setIsTimerRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => prev === 0 ? 0 : prev - 1);
    }, 1000);
  };

  const pauseTimer = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    pauseTimer();
    setTimeRemaining(tabIndex === 0 ? timerDurations.workTime : timerDurations.breakTime);
  };

  const handleStartButtonClick = () => {
    if (isTimerRunning) {
      pauseTimer();
    } else startTimer();
  }

  const autoStartBreak = () => {
    setTabIndex(1);
    startTimer();
  };

  const handleTabChange = (index: number) => {
    resetTimer();
    setTabIndex(index);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  }

  useEffect(() => {
    resetTimer();
    setTimeRemaining(tabIndex === 0 ? timerDurations.workTime : timerDurations.breakTime);
  }, [timerDurations.workTime, timerDurations.breakTime]);

  const handleTimerDurationChange = (key: 'workTime' | 'breakTime') => (time: string) => {
    const newTimeInSeconds = parseInt(time, 10) * 60;

    setTimerDurations((prev) => ({
      ...prev,
      [key]: newTimeInSeconds,
    }));
  };

  const handleWorkTimeChange = handleTimerDurationChange('workTime');
  const handleBreakTimeChange = handleTimerDurationChange('breakTime');

  return (
      <Box
        h="100vh"
        w="100vw"
        display="flex"
        flexDir="column"
        justifyContent="start"
        alignItems="center"
        p={10}
        bg={tabIndex === 0 ? 'red.300' : 'blue.200'}
      >
        <Text fontSize='5xl' fontWeight="700">Pomodoro</Text>

        <Stack direction="row" spacing={4} mt={4} justify="center" align="center" mb={4}>
          <Tabs size="lg" index={tabIndex} onChange={handleTabChange} variant="soft-rounded" isFitted colorScheme='gray' borderRadius={20}>
            <TabList>
              <Tab px={8}>Work</Tab>
              <Tab px={8}>Break</Tab>
            </TabList>
          </Tabs>
          <Button colorScheme="gray" variant="ghost" onClick={toggleDropdown} borderRadius={20}>
            <ChevronDown />
          </Button>
        </Stack>
        <Collapse in={isDropdownOpen} startingHeight={0} endingHeight={70}>
          <Stack direction="row" spacing={4} pr={20} justify="center" align="center" >
            <NumberInput
              size="lg"
              fontWeight='600'
              maxW={24}
              defaultValue={timerDurations.workTime / 60}
              onChange={handleWorkTimeChange}
              min={1}
              max={60}
              focusBorderColor='white'
              onKeyDown={e => e.preventDefault()}
            >
              <NumberInputField bgColor='gray.100' />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <NumberInput
              size="lg"
              fontWeight='600'
              maxW={24}
              defaultValue={timerDurations.breakTime / 60}
              onChange={handleBreakTimeChange}
              min={1}
              max={60}
              focusBorderColor='white'
              onKeyDown={e => e.preventDefault()}
              >
              <NumberInputField bgColor='gray.100' />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Stack>
        </Collapse>
        <Box boxShadow='2xl' borderRadius={20} p={10} mb={2}>
          <ProgressDisplay
            isTimerRunning={isTimerRunning}
            timeDefinitions={timerDurations}
            tabIndex={tabIndex}
            timeRemaining={timeRemaining}
            cycleCount={tabIndex === 0 ? cycleCount.workCount : cycleCount.breakCount}
          />
        </Box>
        <Stack direction="column" spacing={4} mt={4}>
          <Button
            colorScheme={tabIndex === 0 ? 'red' : 'blue'}
            bgColor={tabIndex === 0 ? 'red.700' : 'blue.600'}
            onClick={handleStartButtonClick}
            sx={buttonStyle}>
            {isTimerRunning ? 'Pause' : 'Start'}
          </Button>
          <Button
            colorScheme={tabIndex === 0 ? 'red' : 'blue'}
            bgColor={tabIndex === 0 ? 'red.500' : 'blue.400'}
            onClick={resetTimer}
            sx={buttonStyle}
          >
            Reset
          </Button>
        </Stack>
      </Box>
  );
}
